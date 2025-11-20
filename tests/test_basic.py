import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home_page(client):
    """Test home page loads successfully"""
    response = client.get('/')
    assert response.status_code == 200
    assert 'Flask Web App' in response.data.decode('utf-8')

def test_about_page(client):
    """Test about page loads successfully"""
    response = client.get('/about')
    assert response.status_code == 200
    assert 'Proje Hakkında' in response.data.decode('utf-8')

def test_contact_page_get(client):
    """Test contact page GET request"""
    response = client.get('/contact')
    assert response.status_code == 200
    assert 'İletişim Formu' in response.data.decode('utf-8')

def test_contact_page_post_valid(client):
    """Test contact page POST request with valid data"""
    response = client.post('/contact', data={
        'name': 'Test User',
        'email': 'test@example.com',
        'message': 'This is a test message with enough characters.'
    }, follow_redirects=True)
    assert response.status_code == 200
    assert 'Mesajınız başarıyla gönderildi!' in response.data.decode('utf-8')

def test_contact_page_post_invalid(client):
    """Test contact page POST request with invalid data"""
    response = client.post('/contact', data={
        'name': '',
        'email': 'invalid-email',
        'message': ''
    })
    assert response.status_code == 200
    assert 'Lütfen tüm alanları doldurunuz!' in response.data.decode('utf-8')

def test_api_stats(client):
    """Test API stats endpoint"""
    response = client.get('/api/stats')
    assert response.status_code == 200
    assert response.content_type == 'application/json'
    data = response.get_json()
    assert 'visitors' in data
    assert 'total_requests' in data
    assert 'status' in data
    assert data['status'] == 'healthy'

def test_health_check(client):
    """Test health check endpoint"""
    response = client.get('/health')
    assert response.status_code == 200
    assert response.content_type == 'application/json'
    data = response.get_json()
    assert data['status'] == 'healthy'
    assert 'timestamp' in data

def test_404_page(client):
    """Test 404 error page"""
    response = client.get('/nonexistent-page')
    assert response.status_code == 404
    assert '404' in response.data.decode('utf-8')

def test_visitor_counter_increments(client):
    """Test that visitor counter increments"""
    # Get initial stats
    response1 = client.get('/api/stats')
    initial_visitors = response1.get_json()['visitors']
    
    # Visit home page
    client.get('/')
    
    # Check that visitors increased
    response2 = client.get('/api/stats')
    new_visitors = response2.get_json()['visitors']
    assert new_visitors > initial_visitors

def test_request_counter_increments(client):
    """Test that request counter increments"""
    # Get initial stats
    response1 = client.get('/api/stats')
    initial_requests = response1.get_json()['total_requests']
    
    # Make another request
    client.get('/about')
    
    # Check that requests increased
    response2 = client.get('/api/stats')
    new_requests = response2.get_json()['total_requests']
    assert new_requests > initial_requests

def test_multiple_contact_messages(client):
    """Test that multiple messages are stored"""
    # Send first message
    client.post('/contact', data={
        'name': 'User 1',
        'email': 'user1@example.com',
        'message': 'First test message with enough characters.'
    })
    
    # Send second message
    client.post('/contact', data={
        'name': 'User 2',
        'email': 'user2@example.com',
        'message': 'Second test message with enough characters.'
    })
    
    # Check stats
    response = client.get('/api/stats')
    data = response.get_json()
    assert data['messages_count'] >= 2

def test_form_validation_edge_cases(client):
    """Test form validation edge cases"""
    # Test with whitespace-only values
    response = client.post('/contact', data={
        'name': '   ',
        'email': '   ',
        'message': '   '
    })
    assert response.status_code == 200
    assert 'Lütfen tüm alanları doldurunuz!' in response.data.decode('utf-8')
    
    # Test with missing fields
    response = client.post('/contact', data={
        'name': 'Test User'
        # Missing email and message
    })
    assert response.status_code == 200