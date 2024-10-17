<div align="center">
         
<img src="https://socialify.git.ci/nebulaservices/nebula/image?description=1&font=Inter&forks=1&issues=1&language=1&name=1&owner=1&pattern=Circuit%20Board&pulls=1&stargazers=1&theme=Dark" alt="ruby" width="640" height="320" />

<img alt="repo size" src="https://img.shields.io/github/repo-size/nebulaservices/nebula?style=for-the-badge"></img>
<img alt="website status" src="https://img.shields.io/website?url=https%3A%2F%2Fnebulaproxy.io&style=for-the-badge"></img>
<img alt="commit a week" src="https://img.shields.io/github/commit-activity/w/nebulaservices/nebula?style=for-the-badge"></img>

</div>

<div align="center">
    <h2>Get Started</h2>
    <a>To get started, press one of the buttons below to deploy Incog</a>
    <br />
    <br />
    <a href="#terminal">
        <img src="https://img.shields.io/badge/terminal-%23121011.svg?style=for-the-badge&logo=gnu-bash&logoColor=white" alt="Terminal">
        </img>
    </a>
    <a href="#docker">
        <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
        </img>
    </a>
</div>

## NOTE:

-   This will **NOT** deploy on Github Pages, Netlify, Vercel, Gitlab Pages or any other _static_ host
-   This will **NOT** work on Render
---

## How to get links

[![Nebula Services Discord](https://invidget.switchblade.xyz/unblocker?theme=darl)](https://discord.gg/unblocker)
[![Titanium Network Discord](https://invidget.switchblade.xyz/unblock?theme=dark)](https://discord.gg/unblock)

---

## Features

-   Multiple Proxy "Backends":
    -   [Ultraviolet](https://github.com/titaniumnetwork-dev/ultraviolet)
    -   [RammerHead](https://github.com/binary-person/rammerhead)
---

## Contributors

- [Rifting](https://github.com/rifting) - Owner & Maintainer
- [MotorTruck1221](https://motortruck1221.com) - Maintainer
---

## Tech Stack

-   [Astro](https://astro.build)
-   [Fastify](https://fastify.dev)
-   [Ultraviolet](https://github.com/titaniumnetwork-dev/ultraviolet)
-   [RammerHead](https://github.com/binary-person/rammerhead)
-   [Epoxy](https://github.com/mercuryworkshop/epoxy-tls)
-   [Libcurl.js](https://github.com/ading2210/libcurl.js)
-   HTML, CSS, and JavaScript (DUH)
---

## Catalog/Marketplace

- By default the marketplace is enabled, and uses SQLite
- If you would like to disable the catalog, see [#config](#config)
- For big production instances I would recommend using Postgres over SQLite. To do this see [#config](#config)
- By default, the Docker images use Postgres. If you would like to disable this, see [#docker](#docker)

## Deployment

### Terminal

Prerequisites:
- Node & npm
- Git

1. Clone the repo:
```bash
git clone https://github.com/nebulaservices/nebula && cd nebula
```

2. Install all of the dependencies:
```bash
npm i
```

3. Create a `config.toml` file
```bash
cp config.example.toml config.toml
```

4. Modify the `config.toml` file to you liking (docs [here](#environment))
```
nano .env
```

5. Build the frontend:
```bash
npm run build
```

6. Start the server
```bash
npm start
```

> [!NOTE]
> You can run `npm run bstart` to build and start together
---

### Docker

- There are two ways to deploy with docker:
    - [Normal docker](#normal-docker)
    - [Docker Compose](#docker-compose)

#### Normal Docker

Prerequisites:
- Git
- Docker

1. Clone the repo (skip if using prebuilt image):
```bash
git clone https://github.com/nebulaservices/nebula && cd nebula
```

2. Create an .env file (if using prebuilt image, copy the example from the repo):
```bash
cp .env.example .env
```

3. Modify the .env file to your liking (docs [here](#environment))
```bash
nano .env
```

4. Build the docker image (skip if using prebuilt):
```bash
docker build --build-arg BARE_SERVER_OPTION=true GAMES_LINK=true RAMMERHEAD_OPTION=true -t incog:latest
```
For info on the build arg check [here](#environment)

5. Run the docker images:

    - Prebuilt:
    ```bash
    docker run --env-file ./.env motortruck1221/nebula:latest
    ```
    - Image you built yourself:
    ```bash
    docker run --env-file ./.env incog:latest
    ```

#### Docker Compose

Prerequisites:
- Git
- Docker w/compose

1. Clone the repo (skip if using prebuilt image):
```bash
git clone https://github.com/nebulaservices/nebula
```

2. Create an .env file (if using prebuilt image, copy the example from the repo):
```bash
cp .env.example .env
```

3. Modify the .env file to your liking (docs on that [here](#environment)]
```bash
nano .env
```

4. Build the docker image (skip if using prebuilt):
```bash
docker compose -f ./docker-compose.build.yml build
```

5. Run the docker image:

    - Prebuilt:
    ```bash
    docker compose up
    ```
    - Image you built yourself:
    ```bash
    docker compose -f ./docker-compose.build.yml up
    ```
---

## Config

- There are a couple of configuration options for nebula. Most of the time, the defaults are fine, but there are instances where you may not want certain options enabled or certain things running.
- An example config file is located [here](./config.example.toml). 
- Config format is in TOML

| Variable | Description | Type | Default |
|:----------:|:-------------:|:------:|:---------:|
| `marketplace` | The options below are for the marketplace section | `object` | N/A |
| `enabled` | Enable marketplace functionality | `boolean` | `true` |
| `psk` | The password and authentication key for the marketplace. ***CHANGE FROM DEFAULT*** | `string` | `CHANGEME` |
|----------------------------| ----------------------------------------------------------------------------|------------|--------------|
| `db` | The below options are for the db (database) section | `object` | N/A |
| `name` | The database name to use | `string` | `database` |
| `username` | The username for the DB | `string` | `username` |
| `password` | The database password. ***CHANGE FROM DEFAULT VALUE*** | `string` | `password` |
| `postgres` | Whether to use postgres over sqlite *(recommended for large production instances)* | `boolean` | `false` |
|----------------------------| ----------------------------------------------------------------------------|------------|--------------|
| `postgres` | The below options are for the postgres section. (Only worry about this if you enabled postgres in the db section.) | `object` | N/A |
| `domain` | Either the TLD or the IP address of your postgres server. | `string` | `''` |
| `port` | The port your postgres server is listening on | `number` | `5432` |
|----------------------------| ----------------------------------------------------------------------------|------------|--------------|
| `server.server` | The below options are to configure the server. | `object` | N/A |
| `port` | What port the server should listen on. *(Note: Can also be configured via environment variable `PORT`)* | `number` | `8080` |
| `wisp` | Whether the server should use the inbuilt wisp server. (Disabled if your using an external wisp server) | `boolean` | `true` |
| `logging` | Whether or not to enable logging. *Note: Logs are massive* | `boolean` | `true` |
|----------------------------| ----------------------------------------------------------------------------|------------|--------------|
| `server.rammerhead` | Configure the Rammerhead server. ***DO NOT TOUCH UNLESS YOU ARE CERTAIN YOU KNOW WHAT YOU ARE DOING*** | `object` | N/A |
| `reverseproxy` | Whether or not the Rammerhead server is behind a reverse proxy | `boolean` | `true` |
| `localstorage_sync` | Whether or not to use localstorage sync | `boolean` | `true` |
| `http2` | Whether to allow http2 or not | `boolean` | `true` |
