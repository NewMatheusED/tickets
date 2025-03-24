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
                    sh 'ls -la'
                    sh 'pwd'
                    sh 'echo "Criando arquivos .env"'
                    sh 'rm -f .env backend/.env frontend/.env'
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
                withCredentials([string(credentialsId: 'vps-ssh-password', variable: 'SSH_PASSWORD'), string(credentialsId: 'vps-ssh-user', variable: 'SSH_USER')]) {
                    sh '''
                        set -e  # Para o script em caso de erro

                        # Criação do diretório para as chaves SSH (aqui, você pode omitir a parte de chave privada)
                        mkdir -p ~/.ssh

                        # Adiciona o host à lista de conhecidos
                        ssh-keyscan -H 69.62.87.90 >> ~/.ssh/known_hosts

                        # Usando sshpass para passar a senha diretamente para o comando SSH
                        sshpass -p "Aloi@3781152" ssh -o StrictHostKeyChecking=no "$SSH_USER"@69.62.87.90 "cd /home/tickets && git reset --hard origin/main && git pull origin main"

                        # Copiar os arquivos para a VPS
                        echo "Copiando arquivos para a VPS"
                        sshpass -p "Aloi@3781152" scp .env "$SSH_USER"@69.62.87.90:/home/tickets/.env
                        sshpass -p "Aloi@3781152" scp backend/.env "$SSH_USER"@69.62.87.90:/home/tickets/backend/.env
                        sshpass -p "Aloi@3781152" scp frontend/.env "$SSH_USER"@69.62.87.90:/home/tickets/frontend/.env

                        # Verifica e cria a rede, se necessário
                        sshpass -p "Aloi@3781152" ssh -o StrictHostKeyChecking=no "$SSH_USER"@69.62.87.90 "cd /home/tickets && docker network ls | grep -q tickets_network || docker network create --driver overlay --attachable tickets_network"

                        # Faz o deploy do stack no Docker Swarm
                        sshpass -p "Aloi@3781152" ssh -o StrictHostKeyChecking=no "$SSH_USER"@69.62.87.90 "cd /home/tickets && docker stack deploy -c docker-compose.yml ticketsadmin"
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
