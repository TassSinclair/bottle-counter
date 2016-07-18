# Bottle Counter

[Raspberry Pi](https://www.raspberrypi.org/) + [Johnny Five](http://johnny-five.io/) + [Bottle Opener](http://www.barware.com.au/p/open-bottle-here-wall-mounted-bottle-opener/SX-OBH) + [tipsy devs](https://xkcd.com/323/) = Bottle Counter

## Development

In order to run bottle-counter in dev, it is easier to use Docker.

```sh
$ make build #will build a docker image, install node and deps using your local src.

$ make run #will run the latest build image. But will not mount your current repo.

$ make run-with-mount #will run the app with your src mounted.
```

One thing to remember, Docker ignores the `node_modules` folder. When running, the `node_modules` folder is inside the docker container and is never mounted from your local filesystem

## test

```sh
#this will build a fresh docker-container and run jasmine tests
$ make test
```
