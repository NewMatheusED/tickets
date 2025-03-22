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

        stage('Download Docker') {
            steps {
                // Baixa o binário do Docker
                sh 'curl -fsSL https://get.docker.com -o get-docker.sh'
                sh 'sh get-docker.sh'
                sh 'chmod +x /usr/local/bin/docker-compose'
                sh 'docker --version'
            }
        }
        stage('Build Images') {
            steps {
                // Constrói as imagens conforme o docker-compose.yml
                sh 'docker compose build'
            }
        }
        stage('Tag and Push Images') {
            steps {
                script {
                    // Tagueia as imagens. Certifique-se de que os nomes sejam os mesmos usados na build.
                    sh 'docker tag ticketsadmin_backend:latest ${DOCKER_HUB_REPO_BACKEND}:latest'
                    sh 'docker tag ticketsadmin_frontend:latest ${DOCKER_HUB_REPO_FRONTEND}:latest'
                    
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
                        ssh -i $SSH_KEY $SSH_USER@69.62.87.90 "docker stack deploy -c /home/tickets/docker-compose.yml ticketsadmin"
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