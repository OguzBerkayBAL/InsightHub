from dotenv import load_dotenv
from graph.graph import app
import os
import requests
from fastapi import HTTPException
import traceback
import sys
from ingestion import fetch_and_process_papers, update_vectorstore
from langdetect import detect, LangDetectException
import redis
import json
import hashlib
from openai import OpenAI

load_dotenv()

# OpenAI Client
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Redis bağlantısı
try:
    redis_host = os.getenv("REDIS_HOST", "localhost")
    redis_port = int(os.getenv("REDIS_PORT", "6379"))
    redis_client = redis.Redis(host=redis_host, port=redis_port, db=0, decode_responses=True)
    redis_client.ping() # Test connection
    print("Redis bağlantısı başarılı")
    USE_REDIS = True
except Exception as e:
    print(f"Redis bağlantı hatası: {str(e)}")
    print("Redis önbelleği devre dışı, yerel önbellek kullanılacak")
    USE_REDIS = False
    # Yerel önbellek için basit bir dict
    local_cache = {}

# Önbellek anahtarını oluştur
def create_cache_key(text, target_lang):
    # Hash oluştur
    text_hash = hashlib.md5(f"{text}_{target_lang}".encode('utf-8')).hexdigest()
    return f"translate:{text_hash}"

def get_from_cache(text, target_lang):
    # Kısa metinleri önbellekleme (çok kısa ise gereksiz)
    if len(text) < 5:
        return None
        
    cache_key = create_cache_key(text, target_lang)
    
    if USE_REDIS:
        cached_result = redis_client.get(cache_key)
        if cached_result:
            print("💾 Önbellekten çeviri alındı")
            return cached_result
    else:
        # Yerel önbellek kullan
        if cache_key in local_cache:
            print("💾 Yerel önbellekten çeviri alındı")
            return local_cache[cache_key]
            
    return None

def save_to_cache(text, target_lang, translated_text, expire_time=86400): # 24 saat
    # Kısa metinleri önbellekleme (çok kısa ise gereksiz)
    if len(text) < 5:
        return
        
    cache_key = create_cache_key(text, target_lang)
    
    if USE_REDIS:
        redis_client.set(cache_key, translated_text, ex=expire_time)
        print("💾 Çeviri önbelleğe kaydedildi")
    else:
        # Yerel önbellek kullan
        local_cache[cache_key] = translated_text
        print("💾 Çeviri yerel önbelleğe kaydedildi")

def detect_language(text):
    """Metinin dilini tespit eder"""
    try:
        # langdetect kütüphanesi kullanarak dil tespiti yap
        detected_lang = detect(text)
        
        # langdetect ISO 639-1 kodlarını döndürüyor, biz kendi formatımıza çevirelim
        lang_map = {
            "tr": "TR",
            "en": "EN",
            "de": "DE",
            "fr": "FR",
            "es": "ES",
            # Diğer desteklenen diller eklenebilir
        }
        
        # Eşleşen bir dil kodu varsa döndür, yoksa tespit edilen kodu büyük harfe çevir
        return lang_map.get(detected_lang, detected_lang.upper())
    except LangDetectException as e:
        print(f"Dil algılama hatası: {str(e)}")
        return "TR"  # Bir hata durumunda varsayılan olarak TR dönüyoruz
    except Exception as e:
        print(f"Beklenmeyen dil algılama hatası: {str(e)}")
        return "TR"  # Bir hata durumunda varsayılan olarak TR dönüyoruz

def translate_text(text, target_lang="EN"):
    """Metni belirtilen dile çevirir - OpenAI API kullanarak"""
    if not text:
        return text
    
    # Önbellekten kontrol et
    cached_translation = get_from_cache(text, target_lang)
    if cached_translation:
        return cached_translation
    
    try:
        # ISO formattaki dil kodlarını OpenAI'nin anlayacağı formata çevir
        target_language_names = {
            "EN": "English",
            "TR": "Turkish",
            "DE": "German", 
            "FR": "French",
            "ES": "Spanish"
        }
        
        target_language_name = target_language_names.get(target_lang, target_lang)
        
        # OpenAI API ile çeviri
        completion = openai_client.chat.completions.create(
            model="gpt-3.5-turbo", 
            messages=[
                {"role": "system", "content": f"You are a precise translator. Translate the text to {target_language_name}. Output ONLY the translation without any explanations or additional content."},
                {"role": "user", "content": text}
            ],
            temperature=0.1  # Tutarlı çeviriler için düşük sıcaklık
        )
        
        translated_text = completion.choices[0].message.content.strip()
        
        # Önbelleğe kaydet
        save_to_cache(text, target_lang, translated_text)
        
        return translated_text
    except Exception as e:
        print(f"OpenAI ile çeviri hatası: {str(e)}")
        return text  # Hata durumunda orijinal metni döndür

def process_multilingual_query(query):
    """Farklı dillerdeki sorguları işler ve cevapları orijinal dilde döner"""
    try:
        # 1. Kullanıcı sorgusunun dilini tespit et
        source_language = detect_language(query)
        print(f"🌍 Dil tespiti: {source_language}")
        
        # 2. Sorguyu İngilizce'ye çevir (eğer zaten İngilizce değilse)
        if source_language != "EN":
            english_query = translate_text(query, "EN")
            print(f"🔄 Çeviri: {english_query}")
        else:
            english_query = query
            print("🔄 Çeviri: Gerekli değil (zaten İngilizce)")
        
        # 3. Sorguya göre makaleleri çek ve vektör veritabanını güncelle
        try:
            print("📚 Makale arama başlatılıyor...")
            documents = fetch_and_process_papers(english_query)
            
            # Eğer belge listesi boşsa, mevcut veritabanını kullan
            if not documents or len(documents) == 0:
                print("📚 Yeni makale bulunamadı, mevcut veritabanı kullanılıyor")
                from ingestion import retriever  # Önceden yaratılmış retriever'ı kullan
            else:
                # Yeni makaleler bulunduysa veritabanını güncelle
                retriever = update_vectorstore(documents)
                print(f"📚 Veritabanı güncellendi: {len(documents)} yeni belge eklendi")
        except Exception as e:
            print(f"Makale çekme veya veritabanı güncelleme hatası: {str(e)}")
            print(f"Hata detayı: {traceback.format_exc()}")
            print("---MEVCUT VERİTABANI KULLANILIYOR---")
            from ingestion import retriever  # Hata durumunda önceden yaratılmış retriever'ı kullan
        
        # 4. RAG sistemini kullanarak cevap al
        try:
            print("🤖 RAG sistemi çalışıyor...")
            result = app.invoke(input={"question": english_query})
            
            # İşlem sonrası belge sayısını ve türünü loglayalım
            if isinstance(result, dict) and "documents" in result:
                doc_count = len(result["documents"]) if result["documents"] else 0
                print(f"🤖 Cevap hazırlandı ({doc_count} belge kullanıldı)")
                
                # Makale linklerini cevaba ekle
                for doc in result["documents"]:
                    if hasattr(doc, "metadata"):
                        if "link" in doc.metadata:
                            doc.page_content += f"\n\nMakale Linki: {doc.metadata['link']}"
                        if "pdf_link" in doc.metadata:
                            doc.page_content += f"\nPDF Linki: {doc.metadata['pdf_link']}"
            
        except Exception as e:
            print(f"RAG sistemi hatası: {str(e)}")
            print(f"Hata detayı: {traceback.format_exc()}")
            
            # Basit bir yanıt döndürelim
            result = {
                "generation": f"Üzgünüm, sorunuzu yanıtlarken bir hata oluştu. Teknik detay: {str(e)}",
                "documents": []
            }
        
        # 5. Cevabı ve belgeleri kaynak dile geri çevir
        if source_language != "EN":
            print(f"🔄 Cevap {source_language} diline çevriliyor...")
            
            # Generation alanını çevir
            if isinstance(result, dict) and "generation" in result:
                result["generation"] = translate_text(result["generation"], source_language)
                
                # Orijinal soruyu kullan
                if "question" in result:
                    result["question"] = query
                    
                # Belgeleri çevir
                if "documents" in result and isinstance(result["documents"], list):
                    translated_docs = []
                    
                    for doc in result["documents"]:
                        # Document nesnesinin page_content özelliğini çevir
                        if hasattr(doc, "page_content"):
                            try:
                                # Belgenin içeriğini çevir
                                translated_content = translate_text(doc.page_content, source_language)
                                
                                # Yeni bir Document nesnesi oluştur veya mevcut nesneyi değiştir
                                doc.page_content = translated_content
                            except Exception as e:
                                print(f"Belge çeviri hatası: {str(e)}")
                    
        # İşlem tamamlandı mesajı API'da gösterilecek
        return result, source_language
    except Exception as e:
        print(f"Genel hata: {str(e)}")
        print(f"Hata detayı: {traceback.format_exc()}")
        
        # Hatada bile bir yanıt döndürelim
        result = {
            "generation": f"Üzgünüm, sorunuzu işlerken bir hata oluştu. Teknik detay: {str(e)}",
            "documents": []
        }
        return result, "TR"

if __name__ == "__main__":
    # Test sorgusu
    user_query = input("Sorgunuzu girin: ")
    
    # Sorguyu işle ve cevap al
    try:
        result, detected_language = process_multilingual_query(user_query)
        
        print(f"Tespit edilen dil: {detected_language}")
        print(f"Sonuç: {result}")
    except Exception as e:
        print(f"Ana işlem hatası: {str(e)}")
        print(f"Hata detayı: {traceback.format_exc()}")