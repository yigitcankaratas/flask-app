pipeline {
    agent any

    environment {
        APP_NAME = "flask-app"
        DOCKER_IMAGE = "yck4756/flask-app"
        KUBE_NAMESPACE = "default"
    }

    stages {
        stage('Checkout') {
            steps {
                echo '🔹 Kod GitHub'dan çekiliyor...'
                git branch: 'main', url: 'https://github.com/yigitcankaratas/flask-app'
            }
        }

        stage('Install & Test') {
            steps {
                echo '🧪 Testler çalıştırılıyor...'
                sh '''
                    python3 -m venv venv
                    . venv/bin/activate
                    pip install -r requirements.txt
                    pip install pytest
                    pytest --maxfail=1 --disable-warnings -q
                '''
            }
        }

        stage('Docker Build') {
            steps {
                echo '🐳 Docker image oluşturuluyor...'
                sh 'docker build -t $DOCKER_IMAGE:latest .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo '⬆️ Docker image Docker Hub’a gönderiliyor...'
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push $DOCKER_IMAGE:latest
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo '🚀 Kubernetes’e deploy ediliyor...'
                withCredentials([file(credentialsId: 'kubeconfig-credential', variable: 'KUBECONFIG')]) {
                    sh '''
                        kubectl --kubeconfig=$KUBECONFIG set image deployment/$APP_NAME $APP_NAME=$DOCKER_IMAGE:latest -n $KUBE_NAMESPACE
                        kubectl --kubeconfig=$KUBECONFIG rollout status deployment/$APP_NAME -n $KUBE_NAMESPACE
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '🎉 Deploy işlemi başarıyla tamamlandı!'
        }
        failure {
            echo '❌ Pipeline başarısız oldu!'
        }
    }
}
