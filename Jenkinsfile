podTemplate(label: 'docker-build',
	containers: [
		//Pull container for clone and build process
		containerTemplate(name: "docker", image: "docker", ttyEnabled: true, command: "cat"),
        containerTemplate(name: "git", image: "alpine/git", ttyEnabled: true, command: "cat")
	],
    volumes: [
        hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
    ]
) {
    node('docker-build') {

        stage('Clone repository') {
            container('git') {
                checkout scm
            }
        }

        stage('Build image') {
            container('docker') {
                script {
                    app = docker.build(
                        "'cf-signed-url'",
                        "--network host ."
                    )
                }
            }
        }

        stage('Push image') {
            container('docker') {
                script {
                    docker.withRegistry(
                        'https://451741833328.dkr.ecr.ap-northeast-2.amazonaws.com/cf-signed-url', 
                        'ecr:ap-northeast-2:jenkins-ecr-user') {
                        app.push("${env.BUILD_NUMBER}")
                        app.push("latest")
                    }
                }
            }
        }
    }
}