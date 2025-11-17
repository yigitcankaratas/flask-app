#!/bin/bash

# GitHub Webhook Listener - Diğer makinede çalıştırılacak
# Bu script GitHub'dan webhook aldığında otomatik deployment yapar

# Port 9000'de webhook dinle
echo "🎯 GitHub webhook dinleniyor (Port: 9000)..."

# Simple webhook server
while true; do
    echo -e "HTTP/1.1 200 OK\n\n$(date): Webhook received!" | nc -l -p 9000 -q 1
    
    echo "📡 Webhook alındı - Deployment başlatılıyor..."
    
    # Auto-deploy script'ini çalıştır
    /home/$(whoami)/flask-app/auto-deploy.sh
    
    echo "✅ Webhook işlendi - $(date)"
done