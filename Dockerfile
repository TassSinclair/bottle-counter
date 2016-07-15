FROM alpine:3.4
ENV NODE_ENV development

RUN apk --no-cache add gcc g++ nodejs python make
COPY . /src
WORKDIR /src
RUN npm install

CMD node src/app.
