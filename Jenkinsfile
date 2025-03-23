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
                withCredentials([file(credentialsId: 'env-file', variable: 'ENV_FILE')]) {
                    sh 'cp "$ENV_FILE" .env'
                    sh 'cp "$ENV_FILE" backend/.env'
                    sh 'cp "$ENV_FILE" frontend/.env'
                }
            }
        }
        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                    sh 'echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USER" --password-stdin'
                }
            }
        }
        stage('Build Images') {
            steps {
                sh 'docker compose build --no-cache'
                sh 'docker images'
            }
        }
        stage('Tag and Push Images') {
            steps {
                script {
                    sh '''  
                    docker tag newmatheused/ticketsadmin_backend:latest ${DOCKER_HUB_REPO_BACKEND}:latest 
                    docker tag newmatheused/ticketsadmin_frontend:latest ${DOCKER_HUB_REPO_FRONTEND}:latest
                    docker push ${DOCKER_HUB_REPO_BACKEND}:latest
                    docker push ${DOCKER_HUB_REPO_FRONTEND}:latest
                    ''' 
                }
            }
        }
        stage('Deploy') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'vps-ssh', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
                    sh '''
                        mkdir -p ~/.ssh
                        ssh-keyscan -H 69.62.87.90 >> ~/.ssh/known_hosts
                        eval "$(ssh-agent -s)"
                        ssh-add "$SSH_KEY"
                        ssh "$SSH_USER"@69.62.87.90 "
                            cd /home/tickets &&
                            git pull &&
                            docker network create --driver overlay tickets_network &&
                            docker stack deploy -c docker-compose.yml ticketsadmin
                        "
                        ssh-agent -k
                    '''
                }
            }
        }
        stage('Clean Up') {
            steps {
                sh '''
                    docker image prune -f
                    docker container prune -f
                '''
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
