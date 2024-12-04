# Blog-Management-System-API

Bu proje, blog yazıları yönetimi ve kullanıcı etkileşimi için geliştirilmiş bir API'dir. Proje, kullanıcı kayıt, JWT güvenlik mekanizması, yazı yönetimi ve performans optimizasyonu gibi önemli özellikler sunmaktadır.

Özellikler
✨ Kullanıcı Kaydı ve JWT Kimlik Doğrulama
Kullanıcılar sisteme kaydolabilir ve JWT ile güvenli bir şekilde oturum açabilirler.

🛠️ Roller ve Yetkiler
Her kullanıcıya özel roller tanımlanmıştır ve her rolün belirli yetkileri vardır.

📚 Kategorilere Göre Yazı Listeleme
Yazılar, belirli kategorilere göre sıralanabilir ve filtrelenebilir.

✍️ Kullanıcı Yazı Yönetimi
Kullanıcılar yalnızca kendi yazılarını görüntüleyebilir, düzenleyebilir ve silebilir.

🚀 Performans Optimizasyonu
Redis ile veritabanı sorguları hızlandırılmıştır ve sık kullanılan veriler cache'de tutulmaktadır.

📊 Loglama ve Hata Yönetimi
API üzerinden yapılan işlemler loglanır ve oluşabilecek hatalar düzgün bir şekilde yönetilir.

Kullanılan Teknolojiler
Node.js: Sunucu tarafı teknolojisi
Express.js: API geliştirme framework'u
MongoDB: Veritabanı yönetimi
Redis: Veritabanı önbellekleme
JWT: Kimlik doğrulama
Kurulum ve Çalıştırma
Depoyu Klonlayın:
git clone https://github.com/yasinylz/Blog-Management-System-API.git


Gerekli Bağımlılıkları Yükleyin:


npm install
Çevre Değişkenlerini Yapılandırın:

.env dosyasındaki değerleri uygun şekilde doldurun.

Projeyi Çalıştırın:


npm start
API Endpoints
POST /register: Kullanıcı kaydı
POST /login: Kullanıcı girişi (JWT oluşturur)
GET /posts: Tüm yazıları listele
GET /posts/:id: Belirli bir yazıyı görüntüle
POST /posts: Yeni yazı oluştur
PUT /posts/:id: Mevcut yazıyı güncelle
DELETE /posts/:id: Yazıyı sil
