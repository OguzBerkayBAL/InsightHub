# Insight Hub - Geliştirme Planı 🚀

Bu plan, Insight Hub projesinin geliştirilme sürecini adım adım açıklamaktadır. Backend kısmı için **NestJS**, frontend kısmı için **React.js**, veri depolama için **PostgreSQL** ve **Chroma**, yapay zeka destekli arama fonksiyonları için **Python** kullanılacaktır. 

## 1. Backend: NestJS & PostgreSQL 🔧

### 1.1 Proje Kurulumu ve Yapılandırması
- [ ] NestJS ile proje oluştur. (`nest new insight-hub`)
- [ ] Gerekli bağımlılıkları yükle:
  - **TypeORM**: Veri tabanı ile iletişim için.
  - **bcryptjs**: Şifrelerin güvenli saklanması için.
  - **JWT**: Kullanıcı kimlik doğrulaması için.
- [ ] `.env` dosyası oluştur ve güvenli ortam değişkenlerini ayarla (veritabanı bilgileri, JWT secret vb.).

### 1.2 PostgreSQL Yapılandırması
- [ ] PostgreSQL veri tabanını kur ve gerekli tabloları oluştur:
  - **Kullanıcılar (Users)**: Kayıt, giriş ve kullanıcı bilgileri için.
  - **Yorumlar (Comments)**: Kullanıcıların makalelere yorum bırakabilmesi için.
  - **Kullanıcı Tercihleri**: Kullanıcıların beğendiği ve kaydettiği makaleler.
  
- [ ] TypeORM ile modelleri ve veri tabanı ilişkilerini oluştur:
  - **Kullanıcı Modeli**: Kullanıcı bilgileri (isim, email, şifre vb.).
  - **Yorum Modeli**: Her makaleye bağlı yorumlar.
  
- [ ] Kullanıcı yetkilendirme sistemi oluştur:
  - [ ] JWT ile kullanıcı giriş ve kayıt işlemlerini güvenli hale getir.
  - [ ] Şifreleme için `bcryptjs` kullanarak şifreleri güvenli bir şekilde sakla.

### 1.3 API Geliştirme
- [ ] CRUD işlemleri için gerekli API endpoint'lerini oluştur:
  - **Kullanıcılar**: Kayıt olma, giriş yapma, kullanıcı bilgilerini güncelleme.
  - **Yorumlar**: Yorum ekleme, silme ve güncelleme.
  - **Makale tercihleri**: Kullanıcıların beğendiği veya kaydettiği makaleleri listeleme.

---

## 2. Frontend: React.js ve Ant Design 🖥️

### 2.1 React.js Projesini Başlatma
- [ ] React.js ile projeyi oluştur 
- [ ] **Ant Design** gibi bir UI kütüphanesi entegre et, projeye hızlı bir başlangıç için.

### 2.2 Kullanıcı Arayüzü Tasarımı
- [ ] Kullanıcı giriş/kayıt sayfasını oluştur ve API ile entegre et.
- [ ] Ana sayfa için:
  - **Makale Arama Bölümü**: Kullanıcılar makaleleri arayabilecek.
  - **Son Yorumlar ve Popüler Makaleler**: Ana sayfada listelenen dinamik içerikler.
  
- [ ] **Makaleler Detay Sayfası**: Her makale için ayrıntılı bir görüntüleme ve yorum bölümü tasarla.
- [ ] **Kullanıcı Profil Sayfası**: Kullanıcıların kendi bilgilerini görebileceği ve yorumlarını yönetebileceği bir sayfa geliştir.

---

## 3. Chroma ile Makale Depolama ve Arama 🧠

### 3.1 Chroma Yapılandırması
- [ ] Chroma veri tabanını kur ve yapılandır.
- [ ] Python ile Chroma veritabanına makale, tez, araştırma yazıları eklenmesi için script yaz:
  - [ ] **Web scraping veya API entegrasyonu** ile arXiv gibi kaynaklardan makaleleri çek.
  - [ ] Bu makaleleri Chroma'ya kaydet ve gerekli indekslemeleri yap.

### 3.2 Chroma ile Gelişmiş Arama Fonksiyonu
- [ ] **Python** ve **LangChain** ile doğal dil işleme (NLP) destekli arama fonksiyonu oluştur:
  - [ ] Kullanıcıların Chroma veritabanında arama yapabileceği bir API oluştur.
  - [ ] Arama sonuçlarını filtrele ve sıralama fonksiyonları ekle.

- [ ] **LangGraph** entegrasyonu ile yapay zeka destekli akıllı öneri sistemi geliştir:
  - [ ] Kullanıcıların ilgisini çekebilecek makaleleri öneren bir algoritma oluştur.

---

## 4. Yapay Zeka ve RAG Entegrasyonu 🤖

### 4.1 RAG (Retrieval-Augmented Generation) Yapılandırması
- [ ] Python ile yapay zeka destekli sorgulama sistemi kur:
  - [ ] **OpenAI Embeddings** veya benzeri bir embed model ile metin verilerini vektörize et.
  - [ ] **Chroma**'daki vektör veri tabanından sorgu sonuçlarını çek.

- [ ] Doğal dilde yapılan sorgulara uygun sonuçlar getirecek bir yapı oluştur.
  
### 4.2 Makale Özetleme ve Detaylı Bilgi Sağlama
- [ ] Kullanıcıların makale özetlerine kolayca ulaşabilmesi için:
  - [ ] Her makale için kısa özetler oluşturan bir yapay zeka modeli entegre et.
  - [ ] Özet sonuçlarını React frontend'de kullanıcıya göster.

---

## 5. Test ve Optimizasyon 🔍

### 5.1 Backend Testleri
- [ ] NestJS API'leri için testler yaz (unit ve integration testleri).
- [ ] Veritabanı işlemleri ve JWT kimlik doğrulama sistemini test et.

### 5.2 Frontend Testleri
- [ ] React bileşenleri için testler yaz.
- [ ] Kullanıcı arayüzünde performans ve hız testleri yap.

### 5.3 Yapay Zeka ve Chroma Entegrasyonu
- [ ] Yapay zeka sorgularının doğruluğunu test et.
- [ ] Chroma veritabanından doğru sonuçların alındığını ve arama sonuçlarının optimize edildiğini kontrol et.

---

## 6. Yayına Alma ve Geri Bildirim 🔔

### 6.1 Beta Yayını
- [ ] Projenin beta sürümünü bir kullanıcı kitlesi ile test et.
- [ ] Geri bildirimler topla ve gerekli düzenlemeleri yap.

### 6.2 Tam Sürüm Yayını
- [ ] Projeyi tam sürüm olarak yayına al.
- [ ] Yayın sonrası izleme ve destek sistemi kur.
  
---

**Kullanılan Teknolojiler**:
- **Backend**: NestJS, TypeORM, PostgreSQL
- **Frontend**: React.js, Ant Design
- **Veritabanı**: Chroma (makale verisi), PostgreSQL (kullanıcı, yorum)
- **Yapay Zeka**: Python, LangChain, OpenAI Embeddings
