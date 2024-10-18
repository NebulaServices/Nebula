FROM node:22-alpine

WORKDIR /app

COPY package*.json .
COPY . .

RUN apk update
RUN apk add python3 py3-pip alpine-sdk openssl-dev build-base python3-dev
RUN python3 -m pip install setuptools --break-system-packages
RUN cp -n config.example.toml config.toml 
RUN npm i -g pnpm
RUN pnpm install
RUN pnpm run build
RUN export TERM=xterm-256color
VOLUME /app
EXPOSE 8080
ENTRYPOINT ["pnpm"]
CMD ["start", "--color"]
