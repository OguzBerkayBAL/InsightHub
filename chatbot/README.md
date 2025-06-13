# Çok Dilli Adaptif RAG Sistemi

Bu proje, farklı dillerde sorguları işleyebilen ve cevapları orijinal dilde döndüren bir Adaptif RAG (Retrieval-Augmented Generation) sistemidir.

## Özellikler

- Farklı dillerde sorguları otomatik olarak tespit eder ve işler
- Cevapları kullanıcının orijinal dilinde döndürür
- Adaptif RAG sistemi ile doğru ve ilgili cevaplar üretir
- Web araması ile bilgi eksikliğini giderir
- Halüsinasyon kontrolü yapar
- RESTful API ve kullanıcı dostu web arayüzü sunar

## Kurulum

1. Gereksinimleri yükleyin:

```bash
pip install -r requirements.txt
```

2. `.env` dosyasını düzenleyin ve gerekli API anahtarlarını ekleyin:

```
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
DEEPL_API_KEY=your_deepl_api_key
```

## Kullanım

### API Sunucusunu Başlatma

```bash
python api.py
```

API sunucusu http://localhost:8000 adresinde çalışacaktır.

### Frontend Sunucusunu Başlatma

```bash
cd frontend
node server.js
```

Frontend http://localhost:3000 adresinde çalışacaktır.

### API Endpoint'leri

- `GET /`: API bilgilerini döndürür
- `POST /query`: Sorgu işleme endpoint'i
  - İstek gövdesi: `{ "question": "Sorgunuz buraya" }`
  - Yanıt: `{ "question": "Orijinal soru", "generation": "Üretilen cevap", "documents": [...], "detected_language": "TR" }`

## Sistem Mimarisi

1. **Dil Tespiti ve Çeviri**: DeepL API kullanılarak sorgunun dili tespit edilir ve İngilizce'ye çevrilir
2. **Soru Yönlendirme**: Soru, vektör veritabanı veya web araması için yönlendirilir
3. **Belge Alımı**: İlgili belgeler alınır ve değerlendirilir
4. **Cevap Üretme**: Belgeler kullanılarak cevap üretilir
5. **Halüsinasyon Kontrolü**: Üretilen cevap, belgelere ve soruya uygunluk açısından değerlendirilir
6. **Çeviri**: Cevap ve belgeler, kullanıcının orijinal diline çevrilir

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. 