# INSIGHT HUB 🌐

INSIGHT HUB, kullanıcıların bilgiye hızlı ve etkili bir şekilde erişimini sağlamak amacıyla geliştirilen bir uygulamadır. Proje, **Adaptive RAG** (Retrieval-Augmented Generation) mimarisini kullanarak sorgulara dayalı bilgi sunmaktadır. Aşağıda, projenin temel bileşenleri ve bu bileşenlerin nasıl bir araya geldiği açıklanmaktadır.

![Adaptive RAG](AdaptiveRAG.png)

## Adaptive RAG Aşamaları

1. **Query Analysis (Sorgu Analizi) 🔍**:
   - Kullanıcının girdiği sorguyu analiz eder. Sorgunun içeriğini ve niyetini anlamak için doğal dil işleme teknikleri kullanır. Bu aşama, kullanıcının ne tür bir bilgi aradığını belirlemek için kritik öneme sahiptir.

2. **Retrieve (Al) 📥**:
   - Analiz edilen sorguya dayalı olarak, bilgi kaynağından (veritabanı, dokümanlar vb.) ilgili verileri toplar. Bu aşamada, kullanıcıya en alakalı bilgileri sağlamak için belirli algoritmalar ve filtreleme yöntemleri kullanılır.

3. **Grade (Derecelendir) ⭐**:
   - Elde edilen bilgilerin kalitesini değerlendirir. Bu aşamada, bilgi parçalarının güvenilirliği ve doğruluğu kontrol edilir. Yanlış veya yanıltıcı bilgilerin kullanıcıya sunulmasını engellemek amacıyla bu aşama oldukça önemlidir.

4. **Hallucination (Halüsinasyon) 💭**:
   - Modelin, mevcut veri ve bilgilerden yola çıkarak doğru olmayan veya yanıltıcı bilgi üretme olasılığını minimize eder. Bu aşama, yanlış bilgiye dayanarak yapılan yanıtlardan kaçınmak için gereklidir ve sistemin güvenilirliğini artırır.

5. **Answer Questions (Soruları Yanıtla) ❓**:
   - Kullanıcının sorgusuna dayalı olarak elde edilen bilgileri kullanarak yanıt üretir. Bu aşamada, dil modeli kullanıcının ihtiyaçlarına uygun en iyi yanıtı oluşturur. Bu aşama, kullanıcı deneyimini geliştiren önemli bir bileşendir.

6. **Web Search(İnternette Arama) 💻**:
   - Kullanıcının sorgusuna dayalı olarak sorgu eğer döküman konuları ile alakalı değil ise internette doğal dil modeli yardımı ile aramalar yapılarak ilgili cevap etik bir yapıya uygun olarak geri dönülür.


 
