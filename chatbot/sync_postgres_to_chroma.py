import psycopg2
from langchain.schema import Document
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
import os

# Çevre değişkenlerini yükle (.env dosyasındaki API anahtarları için)
load_dotenv()

print("PostgreSQL veritabanındaki makaleleri Chroma vektör veritabanına aktarma işlemi başlatılıyor...")

try:
    # PostgreSQL bağlantısı
    conn = psycopg2.connect("dbname=postgres user=postgres password=postgres host=localhost port=5433")
    cur = conn.cursor()
    print("PostgreSQL veritabanına bağlantı başarılı.")
    
    # ArXiv makalelerini al
    print("Makaleler PostgreSQL'den alınıyor...")
    cur.execute("SELECT title, summary, authors, link, \"pdfLink\", categories FROM arxiv_article")
    articles = cur.fetchall()
    print(f"Toplam {len(articles)} makale bulundu.")
    
    if not articles:
        print("PostgreSQL'de makale bulunamadı. İşlem sonlandırılıyor.")
        exit(0)
    
    # Belgeleri hazırla
    print("Makaleler Document nesnelerine dönüştürülüyor...")
    documents = []
    for article in articles:
        title, summary, authors, link, pdf_link, categories = article
        doc = Document(
            page_content=summary,
            metadata={
                "title": title,
                "authors": authors,
                "link": link,
                "pdf_link": pdf_link,
                "categories": categories
            }
        )
        documents.append(doc)
    
    # Chunklara böl
    print("Belgeler chunklara bölünüyor...")
    text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        chunk_size=350,
        chunk_overlap=0
    )
    
    chunks = []
    for doc in documents:
        chunks.extend(text_splitter.split_documents([doc]))
    
    print(f"Toplam {len(chunks)} chunk oluşturuldu.")
    
    # Chroma'ya ekle
    print("Chunklar Chroma veritabanına ekleniyor...")
    embeddings = OpenAIEmbeddings()
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name="rag-chroma",
        persist_directory="./.chroma"
    )
    
    print(f"{len(chunks)} chunk başarıyla Chroma veritabanına eklendi.")
    
    # Bağlantıyı kapat
    cur.close()
    conn.close()
    print("PostgreSQL bağlantısı kapatıldı.")
    
except Exception as e:
    print(f"Hata oluştu: {str(e)}")
    import traceback
    print(traceback.format_exc()) 