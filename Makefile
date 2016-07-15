IMAGE_NAME=bottle-counter

build:
		docker build -t ${IMAGE_NAME} .

run:
		docker run -it --rm -p 8080:8080 ${IMAGE_NAME}

run-with-mount:
		docker run -it --rm -p 8080:8080 -v `pwd`:/src ${IMAGE_NAME}
