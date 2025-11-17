#!/bin/bash

# Otomatik deployment script'i - Diğer makinede çalıştırılacak
# Bu script'i crontab ile periyodik olarak çalıştırabilirsiniz

PROJECT_DIR="/home/$(whoami)/flask-app"
REPO_URL="https://github.com/yigitcankaratas/flask-app"
DOCKER_IMAGE="yck4756/flask-app:latest"

echo "🚀 Otomatik deployment başlıyor..."

# Proje klasörü yoksa oluştur
if [ ! -d "$PROJECT_DIR" ]; then
    echo "📁 Proje klasörü oluşturuluyor..."
    git clone $REPO_URL $PROJECT_DIR
else
    echo "🔄 Git repository güncelleniyor..."
    cd $PROJECT_DIR
    
    # Mevcut değişiklikleri kaydet
    git stash save "Auto-stash before pull $(date)"
    
    # Son değişiklikleri çek
    git pull origin main
    
    # Eğer değişiklik varsa
    if [ $? -eq 0 ]; then
        echo "✅ Repository güncellendi"
    else
        echo "❌ Repository güncelleme başarısız"
        exit 1
    fi
fi

cd $PROJECT_DIR

echo "🐳 Docker image güncelleniyor..."
docker pull $DOCKER_IMAGE

echo "🔄 Uygulama yeniden başlatılıyor..."
# Mevcut container'ları durdur
docker-compose down

# Yeni container'ları başlat
docker-compose up -d

echo "⏳ Uygulama başlaması bekleniyor..."
sleep 15

echo "🏥 Sağlık kontrolü yapılıyor..."
if curl -f http://localhost:5000 > /dev/null 2>&1; then
    echo "✅ Uygulama başarıyla çalışıyor!"
else
    echo "❌ Uygulama başlatılamadı!"
    docker-compose logs
    exit 1
fi

echo "🎉 Deployment tamamlandı!"

# Log kaydet
echo "$(date): Deployment completed successfully" >> /var/log/flask-app-deploy.log