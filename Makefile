IMAGE_NAME=bottle-counter

build:
		docker build -t ${IMAGE_NAME} .

run:
		docker run -it --rm -p 8080:8080 ${IMAGE_NAME}

run-with-mount:
		docker run -it --rm -p 8080:8080 -v `pwd`/src:/src/src ${IMAGE_NAME}

test: build
		docker run -it --rm ${IMAGE_NAME} npm test

deploy:
	  ansible-playbook -i playbook/hosts playbook/site.yml -vv

dry-deploy:
	  ansible-playbook -i playbook/hosts playbook/site.yml -Cvv
