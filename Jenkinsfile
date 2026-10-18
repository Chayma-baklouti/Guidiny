pipeline {
  agent any
  options {
    disableConcurrentBuilds()
    timeout(time: 40, unit: 'MINUTES')
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Préparer les secrets') {
      steps { sh 'cp /home/guidiny/app/.env .env' }
    }
    stage('Déployer') {
      steps {
        sh '''
          docker compose up -d --build
          docker image prune -f
        '''
      }
    }
  }
  post {
    always { sh 'rm -f .env || true' }
    failure { sh 'docker compose logs --tail=30 || true' }
  }
}
