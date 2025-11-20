# 🚀 Flask Web App - Modern CI/CD Pipeline

Bu proje, modern web geliştirme pratiklerini göstermek için oluşturulmuş kapsamlı bir Flask web uygulamasıdır. Docker, Jenkins ve Kubernetes teknolojileri ile production-ready bir CI/CD pipeline içerir.

![Flask](https://img.shields.io/badge/flask-2.3.3-blue)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![Python](https://img.shields.io/badge/python-3.11-green)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Özellikler

### 🎨 Frontend
- **Responsive Design**: Bootstrap 5 ile modern, mobile-first tasarım
- **Interactive UI**: JavaScript ile canlı istatistikler ve form validasyonu
- **Modern Icons**: Font Awesome ikconları
- **Progressive Enhancement**: Temel işlevsellik JavaScript olmadan çalışır

### ⚙️ Backend
- **Flask Framework**: Python 3.11 ile modern web uygulaması
- **RESTful API**: JSON endpoint'leri (/api/stats, /health)
- **Template Engine**: Jinja2 ile dinamik sayfa renderıng
- **Error Handling**: Özelleştirilmiş 404/500 hata sayfaları
- **Security**: CSRF koruması ve güvenli session yönetimi

### 🐳 DevOps & Deployment
- **Docker**: Multi-stage build ile optimized container
- **Jenkins**: Automated CI/CD pipeline
- **Kubernetes**: Production-ready deployment manifests
- **Health Checks**: Container ve application health monitoring

## 📁 Proje Yapısı

```
flask-app/
├── app.py                 # Ana Flask uygulaması
├── config.py             # Konfigürasyon sınıfları
├── requirements.txt      # Python bağımlılıkları
├── Dockerfile           # Production container
├── Dockerfile.dev      # Development container
├── docker-compose.yml  # Container orkestrasyon
├── Makefile            # Build ve deployment komutları
├── Jenkinsfile         # CI/CD pipeline
├── k8s-deployment.yaml # Kubernetes manifests
├── templates/          # HTML template'leri
│   ├── base.html
│   ├── index.html
│   ├── about.html
│   ├── contact.html
│   ├── 404.html
│   └── 500.html
├── static/             # CSS, JS, resimler
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── tests/              # Unit testler
│   └── test_basic.py
└── README.md           # Bu dosya
```

## 🚀 Hızlı Başlangıç

### 1. Repository'yi klonlayın

```bash
git clone https://github.com/yigitcankaratas/flask-app.git
cd flask-app
```

### 2. Development ortamı (Yerel)

```bash
# Python virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Bağımlılıkları yükle
pip install -r requirements.txt

# Uygulamayı çalıştır
python app.py
```

Uygulama http://localhost:5000 adresinde çalışacak.

### 3. Docker ile çalıştırma

#### Development
```bash
# Development container (hot reload)
make dev
# veya
docker-compose --profile dev up flask-dev --build
```

#### Production
```bash
# Production container
make build
make run
# veya
docker build -t yck4756/flask-app:latest .
docker-compose up -d
```

### 4. Kubernetes Deployment

```bash
# Docker image'ı build et ve push et
make push

# Kubernetes'e deploy et
kubectl apply -f k8s-deployment.yaml

# Deploy durumunu kontrol et
kubectl get pods
kubectl get services
```

## 📊 API Endpoints

### 🏠 Web Sayfaları
- `GET /` - Ana sayfa
- `GET /about` - Hakkında sayfası
- `GET /contact` - İletişim formu
- `POST /contact` - İletişim mesajı gönderme

### 🔌 API Endpoints
- `GET /api/stats` - Canlı istatistikler (JSON)
- `GET /health` - Health check endpoint

### 📡 API Örnek Yanıt
```json
{
  "visitors": 42,
  "total_requests": 128,
  "last_visit": "2025-11-20 17:30:45",
  "messages_count": 5,
  "status": "healthy"
}
```

## 🧪 Testler

```bash
# Unit testleri çalıştır
make test-local
# veya
python -m pytest tests/ -v

# Coverage ile testler
python -m pytest --cov=app tests/
```

## 🔧 Makefile Komutları

```bash
make help          # Tüm komutları listele
make dev           # Development server başlat
make build         # Production image build et
make run           # Production container çalıştır
make test          # Testleri containerda çalıştır
make push          # Docker Hub'a push et
make deploy        # Kubernetes'e deploy et
make health        # Health check yap
make logs          # Container loglarını göster
make clean         # Docker kaynaklarını temizle
```

## 🚀 CI/CD Pipeline

### GitHub Actions (Önerilen)
1. GitHub repository'nizde **Settings > Secrets** bölümünden secrets ekleyin:
   ```
   DOCKER_USERNAME: Docker Hub kullanıcı adı
   DOCKER_PASSWORD: Docker Hub şifre/token
   REMOTE_SERVER: Deployment sunucu IP
   REMOTE_USER: SSH kullanıcı adı
   SSH_PRIVATE_KEY: SSH private key
   ```

2. Kod push'ladığınızda otomatik olarak:
   - Testler çalışır
   - Docker image build edilir
   - Docker Hub'a push edilir
   - Remote sunucuda deploy edilir

### Jenkins Pipeline
1. Jenkins'te yeni Pipeline job oluşturun
2. Repository URL'i girin
3. Pipeline script path: `Jenkinsfile`
4. Credentials ekleyin:
   - `dockerhub-credentials`
   - `ssh-remote-credentials`

## 🔒 Güvenlik

- **Non-root User**: Container non-root kullanıcı ile çalışır
- **Secret Management**: Environment variables ile gizli bilgi yönetimi
- **Health Checks**: Container ve uygulama sağlık kontrolleri
- **Input Validation**: Form girişleri doğrulanır
- **CSRF Protection**: Cross-site request forgery koruması

## 🚀 Production Deployment

### 1. Environment Variables
```bash
# .env dosyası oluşturun
cp .env.example .env

# Değişkenleri düzenleyin
SECRET_KEY=your-super-secret-production-key
FLASK_ENV=production
```

### 2. Docker Swarm
```bash
docker swarm init
docker stack deploy -c docker-compose.yml flask-app
```

### 3. Kubernetes
```bash
# Namespace oluştur
kubectl create namespace flask-app

# Secret oluştur
kubectl create secret generic flask-secrets \
  --from-literal=secret-key=your-secret-key \
  -n flask-app

# Deploy et
kubectl apply -f k8s-deployment.yaml -n flask-app
```

## 📈 Monitoring & Logging

### Health Checks
- **Container**: Docker HEALTHCHECK
- **Application**: `/health` endpoint
- **Kubernetes**: Liveness ve readiness probes

### Logging
```bash
# Container logs
docker-compose logs -f

# Kubernetes logs
kubectl logs -f deployment/flask-app
```

## 🤝 Contributing

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 License

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## 🎯 Roadmap

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Redis cache layer
- [ ] User authentication system
- [ ] Real-time WebSocket features
- [ ] Prometheus metrics
- [ ] Elasticsearch logging
- [ ] Multi-environment support

## 📞 İletişim

- **GitHub**: [@yigitcankaratas](https://github.com/yigitcankaratas)
- **Docker Hub**: [yck4756](https://hub.docker.com/u/yck4756)

## 🙏 Teşekkürler

Bu projeyi geliştirirken kullanılan teknolojiler:

- [Flask](https://flask.palletsprojects.com/) - Web framework
- [Bootstrap](https://getbootstrap.com/) - CSS framework
- [Font Awesome](https://fontawesome.com/) - Icons
- [Docker](https://www.docker.com/) - Containerization
- [Kubernetes](https://kubernetes.io/) - Orchestration
- [Jenkins](https://www.jenkins.io/) - CI/CD

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!