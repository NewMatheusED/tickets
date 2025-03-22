//// filepath: Jenkinsfile
pipeline {
    agent any
    environment {
        DOCKER_HUB_REPO_BACKEND = 'newmatheused/ticketsadmin_backend'
        DOCKER_HUB_REPO_FRONTEND = 'newmatheused/ticketsadmin_frontend'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Prepare .env Files') {
            steps {
                withCredentials([
                    string(credentialsId: 'SECRET_KEY', variable: 'SECRET_KEY'),
                    string(credentialsId: 'DB_USERNAME', variable: 'DB_USERNAME'),
                    string(credentialsId: 'DB_PASSWORD', variable: 'DB_PASSWORD'),
                    string(credentialsId: 'DB_NAME', variable: 'DB_NAME'),
                    string(credentialsId: 'MYSQL_ROOT_PASSWORD', variable: 'MYSQL_ROOT_PASSWORD'),
                    string(credentialsId: 'MYSQL_DATABASE', variable: 'MYSQL_DATABASE'),
                    string(credentialsId: 'MYSQL_USER', variable: 'MYSQL_USER'),
                    string(credentialsId: 'MYSQL_PASSWORD', variable: 'MYSQL_PASSWORD')
                    ]) {
                    writeFile file: '.env', text: """
                    # Variáveis comuns
                    SECRET_KEY=${env.SECRET_KEY}
                    DB_USERNAME=${env.DB_USERNAME}
                    DB_PASSWORD=${env.DB_PASSWORD}
                    DB_NAME=${env.DB_NAME}
                    MYSQL_ROOT_PASSWORD=${env.MYSQL_ROOT_PASSWORD}
                    MYSQL_DATABASE=${env.MYSQL_DATABASE}
                    MYSQL_USER=${env.MYSQL_USER}
                    MYSQL_PASSWORD=${env.MYSQL_PASSWORD}
                    """
                    
                    // Cria o .env no backend
                    writeFile file: 'backend/.env', text: """
                    SECRET_KEY=${env.SECRET_KEY}
                    DB_USERNAME=${env.DB_USERNAME}
                    DB_PASSWORD=${env.DB_PASSWORD}
                    DB_NAME=${env.DB_NAME}
                    MYSQL_ROOT_PASSWORD=${env.MYSQL_ROOT_PASSWORD}
                    MYSQL_DATABASE=${env.MYSQL_DATABASE}
                    MYSQL_USER=${env.MYSQL_USER}
                    MYSQL_PASSWORD=${env.MYSQL_PASSWORD}
                    """
                    
                    // Cria o .env no frontend (adapte conforme as variáveis necessárias)
                    writeFile file: 'frontend/.env', text: """
                    REACT_APP_API_URL=${env.REACT_APP_API_URL}
                    """
                    // Idem para backend e frontend, se necessário.
                }
            }
        }
        stage('Build Images') {
            steps {
                sh 'docker compose build --no-cache'  // Força a reconstrução das imagens
                sh 'docker images'  // Lista as imagens construídas
            }
        }
        stage('Tag and Push Images') {
            steps {
                script {
                    sh 'docker tag newmatheused/ticketsadmin_backend:latest ${DOCKER_HUB_REPO_BACKEND}:latest'
                    sh 'docker tag newmatheused/ticketsadmin_frontend:latest ${DOCKER_HUB_REPO_FRONTEND}:latest'
                    
                    // Login no Docker Hub usando as credenciais armazenadas no Jenkins (ID: dockerhub)
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                        sh 'docker login -u $DOCKERHUB_USER -p $DOCKERHUB_PASSWORD'
                    }
                    
                    // Envia as imagens para o Docker Hub
                    sh 'docker push ${DOCKER_HUB_REPO_BACKEND}:latest'
                    sh 'docker push ${DOCKER_HUB_REPO_FRONTEND}:latest'
                }
            }
        }
        stage('Deploy') {
            steps {
                // Realiza o deploy na VPS utilizando SSH.
                // O comando abaixo assume que você possui uma chave SSH configurada no Jenkins e a credencial com id: vps-ssh.
                withCredentials([sshUserPrivateKey(credentialsId: 'vps-ssh', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
                    sh '''
                        ssh -i "$SSH_KEY" "$SSH_USER"@69.62.87.90 "docker stack deploy -c /home/tickets/docker-compose.yml ticketsadmin"
                    '''
                }
            }
        }
        stage('Clean Up') {
            steps {
                // Remove imagens "dangling" (sem tag) e containers parados
                sh 'docker system prune -af'
            }
        }
    }
    post {
        success {
            echo 'Deploy realizado com sucesso!'
        }
        failure {
            echo 'Houve uma falha no pipeline.'
        }
    }
}