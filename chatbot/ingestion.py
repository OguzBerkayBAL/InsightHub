from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.schema import Document
import requests
import xml.etree.ElementTree as ET
import os
import glob
# Önbellek fonksiyonlarını main.py'den import et
try:
    from main import get_from_cache, save_to_cache, openai_client
    USE_CACHE = True
except ImportError:
    print("Uyarı: main.py'deki önbellek fonksiyonları bulunamadı. Önbellek devre dışı.")
    USE_CACHE = False
    try:
        from openai import OpenAI
        openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    except ImportError:
        print("OpenAI kütüphanesi bulunamadı.")

load_dotenv()

# Global değişkenler
CHROMA_DIR = "./.chroma"  # Varsayılan Chroma vektör veritabanı dizini
CHROMA_DB_DIR = "./chroma_db"  # process_papers.py tarafından oluşturulan Chroma DB dizini
COLLECTION_NAME = "rag-chroma"

def translate_query(query):
    """Sorguyu İngilizce'ye çevirir - OpenAI API kullanarak"""
    # Önbellekten kontrol et
    if USE_CACHE:
        cached_translation = get_from_cache(query, "EN")
        if cached_translation:
            return cached_translation

    try:
        # OpenAI API ile çeviri
        completion = openai_client.chat.completions.create(
            model="gpt-3.5-turbo", 
            messages=[
                {"role": "system", "content": "You are a precise translator. Translate the text to English. Output ONLY the translation without any explanations or additional content."},
                {"role": "user", "content": query}
            ],
            temperature=0.1  # Tutarlı çeviriler için düşük sıcaklık
        )
        
        translated_text = completion.choices[0].message.content.strip()
        
        # Önbelleğe kaydet
        if USE_CACHE:
            save_to_cache(query, "EN", translated_text)
            
        return translated_text
    except Exception as e:
        print(f"OpenAI ile çeviri hatası: {str(e)}")
        # Çeviri başarısız olursa orijinal sorguyu kullan
        return query

def fetch_arxiv_papers(query, max_results=10):
    base_url = "http://export.arxiv.org/api/query?"
    search_query = f"search_query=all:{query}&start=0&max_results={max_results}"
    response = requests.get(base_url + search_query)

    if response.status_code == 200:
        return response.text
    else:
        raise Exception("Error fetching data from ArXiv")

def parse_arxiv_response(xml_response):
    root = ET.fromstring(xml_response)
    papers = []

    entries = root.findall('{http://www.w3.org/2005/Atom}entry')
    if not entries:
        print("ArXiv API'den makale bulunamadı")
        return papers  # Boş liste döndür

    for entry in root.findall('{http://www.w3.org/2005/Atom}entry'):
        title = entry.find('{http://www.w3.org/2005/Atom}title').text
        summary = entry.find('{http://www.w3.org/2005/Atom}summary').text
        authors = [author.find('{http://www.w3.org/2005/Atom}name').text for author in
                   entry.findall('{http://www.w3.org/2005/Atom}author')]
        # Makale linkini al
        link = entry.find('{http://www.w3.org/2005/Atom}link').get('href')
        # PDF linkini al
        pdf_link = link.replace('abs', 'pdf') + '.pdf'

        authors_str = ", ".join(authors)

        papers.append({
            'title': title,
            'summary': summary,
            'authors': authors_str,
            'link': link,
            'pdf_link': pdf_link
        })

    return papers

def fetch_and_process_papers(query, max_results=10):
    """Kullanıcı sorgusuna göre makaleleri çeker ve işler"""
    try:
        # Sorguyu İngilizceye çevir
        english_query = translate_query(query)
        
        # ArXiv'den makaleleri çek
        xml_response = fetch_arxiv_papers(english_query, max_results)
        papers = parse_arxiv_response(xml_response)
        
        if not papers:
            print(f"'{query}' için ArXiv'de makale bulunamadı")
            return []
        
        # Belgeleri bir listeye çevir ve Document nesnesi olarak oluştur
        docs_list = [Document(
            page_content=paper['summary'], 
            metadata={
                "title": paper['title'], 
                "authors": paper['authors'],
                "link": paper['link'],
                "pdf_link": paper['pdf_link']
            }
        ) for paper in papers]
        
        # Belgeleri böl
        text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
            chunk_size=350,
            chunk_overlap=0
        )
        
        splits = []
        for doc in docs_list:
            splits.extend(text_splitter.split_documents([doc]))
        
        return splits
    except Exception as e:
        print(f"Makale çekme hatası: {str(e)}")
        return []

# İki farklı Chroma veritabanını kontrol et ve birlikte kullan
def get_combined_retriever():
    embedding_function = OpenAIEmbeddings()
    retrievers = []
    
    # 1. Varsayılan Chroma veritabanı
    if os.path.exists(CHROMA_DIR) and os.path.isdir(CHROMA_DIR):
        try:
            chroma_db = Chroma(
                collection_name=COLLECTION_NAME,
                embedding_function=embedding_function,
                persist_directory=CHROMA_DIR
            )
            retrievers.append(chroma_db.as_retriever(search_kwargs={"k": 3}))
            print(f"Varsayılan Chroma veritabanı yüklendi: {CHROMA_DIR}")
        except Exception as e:
            print(f"Varsayılan Chroma veritabanı yüklenirken hata: {str(e)}")
    
    # 2. process_papers tarafından oluşturulan Chroma veritabanı
    if os.path.exists(CHROMA_DB_DIR) and os.path.isdir(CHROMA_DB_DIR):
        try:
            papers_db = Chroma(
                embedding_function=embedding_function,
                persist_directory=CHROMA_DB_DIR
            )
            retrievers.append(papers_db.as_retriever(search_kwargs={"k": 3}))
            print(f"PostgreSQL makaleleri için Chroma veritabanı yüklendi: {CHROMA_DB_DIR}")
        except Exception as e:
            print(f"PostgreSQL makaleleri veritabanı yüklenirken hata: {str(e)}")
    
    # Eğer hiçbir retriever yoksa, yeni bir tane oluştur
    if not retrievers:
        print("Hiçbir Chroma veritabanı bulunamadı, yeni bir tane oluşturuluyor...")
        default_query = "large language model OR llm OR artifical intelligence OR siber saldırı"
        default_documents = fetch_and_process_papers(default_query)
        vectorstore = Chroma.from_documents(
            documents=default_documents,
            collection_name=COLLECTION_NAME,
            embedding=embedding_function,
            persist_directory=CHROMA_DIR
        )
        retrievers.append(vectorstore.as_retriever(search_kwargs={"k": 5}))
    
    # Tek bir retriever döndür - çoklu retriever kullanmak için daha karmaşık bir
    # yapı gerekir, bu örnekte sadece ilk retriever'ı kullanıyoruz
    # ancak birden fazla veritabanı mevcutsa, ikisi de yüklenir ve 
    # birleştirilmiş sorgu sonuçları alınabilir
    if len(retrievers) > 1:
        # İlk retrieveri tercih et, ama iki veritabanının da yüklendiğini bil
        print(f"{len(retrievers)} farklı retriever yüklendi, ilk retriever kullanılıyor")
        return retrievers[0]
    
    return retrievers[0] if retrievers else None

# Chroma'ya belgeleri ekle
def update_vectorstore(documents):
    if not documents or len(documents) == 0:
        print("Boş belge listesi, veritabanı güncellenmeyecek")
        return retriever
        
    vectorstore = Chroma.from_documents(
        documents=documents,
        collection_name=COLLECTION_NAME,
        embedding=OpenAIEmbeddings(),
        persist_directory=CHROMA_DIR
    )
    return vectorstore.as_retriever()

# Başlangıçta retriever'ı oluştur
print("ingestion.py: Varsayılan retriever başlatılıyor...")
retriever = get_combined_retriever()
print("ingestion.py: Varsayılan retriever başlatıldı.")

# Test için örnek kullanım
if __name__ == "__main__":
    test_query = "large language model OR llm OR artifical intelligence OR siber saldırı"
    documents = fetch_and_process_papers(test_query)
    retriever = update_vectorstore(documents)
