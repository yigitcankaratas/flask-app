from flask import Flask, render_template, request, jsonify, flash, redirect, url_for
from datetime import datetime
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Uygulama verileri (normalde veritabanı kullanırsınız)
app_data = {
    'visitors': 0,
    'messages': [],
    'stats': {
        'total_requests': 0,
        'last_visit': None
    }
}

@app.before_request
def before_request():
    app_data['stats']['total_requests'] += 1
    app_data['stats']['last_visit'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

@app.route('/')
def home():
    app_data['visitors'] += 1
    return render_template('index.html', 
                         visitors=app_data['visitors'],
                         stats=app_data['stats'])

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        if name and email and message:
            app_data['messages'].append({
                'name': name,
                'email': email,
                'message': message,
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            })
            flash('Mesajınız başarıyla gönderildi!', 'success')
            return redirect(url_for('contact'))
        else:
            flash('Lütfen tüm alanları doldurunuz!', 'error')
    
    return render_template('contact.html')

@app.route('/api/stats')
def api_stats():
    return jsonify({
        'visitors': app_data['visitors'],
        'total_requests': app_data['stats']['total_requests'],
        'last_visit': app_data['stats']['last_visit'],
        'messages_count': len(app_data['messages']),
        'status': 'healthy'
    })

@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=os.environ.get('FLASK_DEBUG', 'False').lower() == 'true')