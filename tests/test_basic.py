import sys
import os
import pytest

# Flask uygulamasını import etmek için path'i ayarla
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

@pytest.fixture
def client():
    """Test için Flask client'ı oluştur"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home_page(client):
    """Ana sayfa testleri"""
    response = client.get('/')
    assert response.status_code == 200
    assert b"Hello from Flask + Jenkins + Kubernetes!" in response.data

def test_example():
    """Basit matematik testi"""
    assert 2 + 2 == 4

