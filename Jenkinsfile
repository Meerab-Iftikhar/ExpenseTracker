pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                url: 'https://github.com/AizaKhadim/ExpenseTrackerDocker.git'
            }
        }

        stage('Build & Run App Using Docker Compose') {
            steps {
                sh 'docker-compose down || true'
                sh 'docker-compose up --build -d'
            }
        }

        stage('Run Selenium Tests (Non-blocking)') {
            steps {
                dir('selenium-tests') {
                    // Prevent pipeline failure even if tests fail
                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        sh 'docker build -t selenium-tests .'
                        sh 'docker run --network=host selenium-tests'
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'docker-compose down || true'
        }
    }
}
