import os
import psycopg2
import requests
import json
import re
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv

# .env dosyasını yükle
load_dotenv()

# Dosya yolunu tam olarak belirle (göreceli değil)
def get_absolute_path(rel_path):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(script_dir, rel_path)

# Dosya adlarını temizleme - geçersiz karakterleri kaldır
def sanitize_filename(filename):
    # Windows'da geçersiz olan karakterleri kaldır (< > : " / \ | ? *)
    # LaTeX formatındaki metinleri de temizle ($, \textit{} vb.)
    # Önce LaTeX komutlarını temizle
    filename = re.sub(r'\\[a-zA-Z]+{([^}]*)}', r'\1', filename)
    # Özel karakterleri kaldır
    filename = re.sub(r'[<>:"/\\|?*$\\{}]', '', filename)
    # Birden fazla alt çizgiyi tek alt çizgiye dönüştür
    filename = re.sub(r'_+', '_', filename)
    # Boşlukları alt çizgi ile değiştir
    filename = filename.replace(' ', '_')
    return filename

# PostgreSQL bağlantısı
def get_db_connection():
    try:
        # DB bilgilerini güvenli şekilde al
        db_host = os.getenv("DB_HOST", "127.0.0.1")
        db_port = os.getenv("DB_PORT", "5433")  # 5433 portu backend'de kullanılıyor
        db_name = os.getenv("DB_NAME", "postgres")
        db_user = os.getenv("DB_USER", "postgres")
        db_password = os.getenv("DB_PASSWORD", "postgres")
        
        print(f"Veritabanına bağlanılıyor: {db_host}:{db_port}/{db_name} (kullanıcı: {db_user})")
        
        conn = psycopg2.connect(
            host=db_host,
            port=db_port,
            database=db_name,
            user=db_user,
            password=db_password
        )
        return conn
    except Exception as e:
        print(f"Veritabanı bağlantı hatası: {str(e)}")
        raise

# PDF'leri indirme
def download_pdf(pdf_url, file_path):
    # Eğer dosya zaten varsa, tekrar indirme
    if os.path.exists(file_path):
        print(f"Zaten indirilmiş: {file_path}")
        return True
        
    response = requests.get(pdf_url, stream=True)
    if response.status_code == 200:
        with open(file_path, 'wb') as f:
            f.write(response.content)
        print(f"İndirildi: {file_path}")
        return True
    else:
        print(f"İndirilemedi: {pdf_url}, Durum Kodu: {response.status_code}")
        return False

# İşlenmiş makale ID'lerini yükleme
def load_processed_ids():
    processed_ids_file = get_absolute_path("processed_articles.json")
    processed_ids = set()
    
    if os.path.exists(processed_ids_file):
        try:
            with open(processed_ids_file, 'r') as f:
                content = f.read().strip()
                if content:  # Dosya boş değilse
                    processed_ids = set(json.loads(content))
                    print(f"İşlenmiş makale listesi yüklendi. {len(processed_ids)} makale daha önce işlenmiş.")
                else:
                    print("İşlenmiş makale dosyası boş.")
        except json.JSONDecodeError as e:
            print(f"JSON decode hatası: {str(e)}. Yeni bir liste oluşturuluyor.")
        except Exception as e:
            print(f"İşlenmiş makale listesi yüklenirken hata: {str(e)}. Yeni bir liste oluşturuluyor.")
    else:
        print("İşlenmiş makale dosyası bulunamadı. Yeni oluşturulacak.")
        # Dosya yoksa, işlenmiş makale ID'leri sıfırlanır - bu sorunun ana nedeni
        
    return processed_ids

# İşlenmiş makale ID'lerini kaydetme
def save_processed_ids(processed_ids):
    processed_ids_file = get_absolute_path("processed_articles.json")
    
    try:
        with open(processed_ids_file, 'w') as f:
            json.dump(list(processed_ids), f)
        print(f"{len(processed_ids)} makale ID'si başarıyla kaydedildi.")
        
        # İçeriği doğrulama
        with open(processed_ids_file, 'r') as f:
            content = f.read().strip()
            if content:
                loaded = json.loads(content)
                print(f"Doğrulama: Kaydedilen dosya {len(loaded)} makale ID'si içeriyor.")
            else:
                print("UYARI: Kaydedilen dosya boş!")
    except Exception as e:
        print(f"İşlenmiş makale listesi kaydedilirken hata: {str(e)}")

# Ana işlem
def process_papers():
    # PDF'lerin indirileceği klasörü oluştur
    pdf_dir = get_absolute_path("downloaded_papers")
    os.makedirs(pdf_dir, exist_ok=True)
    
    # Daha önce işlenmiş ID'leri yükle
    processed_ids = load_processed_ids()
    print(f"İşleme başlarken {len(processed_ids)} makale ID'si işlenmiş durumda.")
    
    # Embeddings oluşturucu
    embeddings = OpenAIEmbeddings()
    
    # Chroma veritabanı
    persist_directory = get_absolute_path("chroma_db")
    vectordb = Chroma(persist_directory=persist_directory, embedding_function=embeddings)
    
    try:
        # PostgreSQL'den makale bilgilerini çek
        conn = get_db_connection()
        cur = conn.cursor()
        
        # İşlenmiş ID'ler boşsa (dosya yoksa), indirilen PDF'lere göre liste oluştur
        if len(processed_ids) == 0 and os.path.exists(pdf_dir):
            print("İşlenmiş makale listesi bulunamadı, indirilen PDF'lere göre liste oluşturuluyor...")
            # Veritabanındaki tüm makaleleri al
            cur.execute('SELECT id, "arxivId", title FROM arxiv_article')
            all_db_articles = cur.fetchall()
            
            # İndirilen PDF dosyalarını kontrol et
            pdf_files = os.listdir(pdf_dir)
            
            # İndirilen her PDF için, veritabanında eşleşen makale ID'sini bul
            for article in all_db_articles:
                db_id, arxiv_id, title = article
                
                # Dosya adı kalıbını oluştur
                file_prefix = f"{arxiv_id}_"
                
                # Bu arXiv ID ile başlayan dosya var mı kontrol et
                for pdf_file in pdf_files:
                    if pdf_file.startswith(file_prefix):
                        # Eşleşen PDF bulundu, bu makale zaten işlenmiş
                        processed_ids.add(db_id)
                        break
            
            print(f"PDF klasöründen {len(processed_ids)} işlenmiş makale tespit edildi.")
        
        # Tüm makaleleri çek
        cur.execute('SELECT id, "arxivId", title, "pdfLink" FROM arxiv_article')
        all_articles = cur.fetchall()
        
        # İşlenmemiş makaleleri filtrele
        articles_to_process = []
        for article in all_articles:
            db_id = article[0]  # PostgreSQL'den gelen ID
            if db_id not in processed_ids:
                articles_to_process.append(article)
        
        print(f"Veritabanında toplam {len(all_articles)} makale var.")
        print(f"Bunlardan {len(processed_ids)} tanesi daha önce işlenmiş.")
        print(f"İşlenecek {len(articles_to_process)} yeni makale bulundu.")
        
        if len(articles_to_process) == 0:
            print("İşlenecek yeni makale yok.")
            return
        
        # Bu çalıştırmada işlenen makale ID'lerini takip et
        newly_processed_ids = []
        
        for db_id, arxiv_id, title, pdf_link in articles_to_process:
            if not pdf_link:
                print(f"PDF linki yok: {title}")
                continue
                
            # PDF dosya adını oluştur - arxivId kullanarak daha anlamlı isimler
            # Başlığı dosya adı için temizle
            safe_title = sanitize_filename(title)
            file_name = f"{arxiv_id}_{safe_title[:50]}.pdf"
            file_path = os.path.join(pdf_dir, file_name)
            
            # PDF'yi indir ve işle
            if download_pdf(pdf_link, file_path):
                try:
                    # PDF'yi yükle
                    loader = PyPDFLoader(file_path)
                    documents = loader.load()
                    
                    # Metadata'ya makale bilgilerini ekle
                    for doc in documents:
                        doc.metadata["title"] = title
                        doc.metadata["db_id"] = db_id  # Veritabanı ID'si
                        doc.metadata["arxiv_id"] = arxiv_id  # ArXiv ID'si
                        doc.metadata["pdf_link"] = pdf_link
                    
                    # Metni chunklara ayır
                    text_splitter = RecursiveCharacterTextSplitter(
                        chunk_size=1000,
                        chunk_overlap=200,
                        separators=["\n\n", "\n", " ", ""]
                    )
                    chunks = text_splitter.split_documents(documents)
                    
                    # Chroma veritabanına ekle
                    vectordb.add_documents(chunks)
                    print(f"Eklendi: {title}, {len(chunks)} chunk")
                    
                    # Başarıyla işlenen makale ID'sini kaydet
                    newly_processed_ids.append(db_id)
                    
                except Exception as e:
                    print(f"Hata: {title}, {str(e)}")
        
        # Veritabanını kapat
        cur.close()
        conn.close()
        
        # İşlenen ID'leri mevcut ID'lere ekle
        processed_ids.update(newly_processed_ids)
        
        # İşlenen ID'leri dosyaya kaydet
        save_processed_ids(processed_ids)
            
        print(f"Bu çalıştırmada {len(newly_processed_ids)} yeni makale işlendi. Toplam işlenen makale sayısı: {len(processed_ids)}")
        
    except Exception as e:
        print(f"Veritabanı işlemi sırasında hata oluştu: {str(e)}")
    
    print("İşlem tamamlandı.")

if __name__ == "__main__":
    process_papers() 