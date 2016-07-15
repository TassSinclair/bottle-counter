IMAGE_NAME=bottle-counter

build:
		docker build -t ${IMAGE_NAME} .

run-dev:
		docker run -it --rm -p 8080:8080 ${IMAGE_NAME}
