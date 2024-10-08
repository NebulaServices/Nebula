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

- [MotorTruck1221](https://motortruck1221.com) - Maintainer
- [Rifting](https://github.com/rifting) - Maintainer
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

3. Create a .env file
```bash
cp .env.example .env
```

4. Modify the .env file to you liking (docs [here](#environment))
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

### Games

- By default, games are reverse proxied by the server
    - Game assets are located [here](https://github.com/ruby-network/ruby-assets)
- To turn off Games, and access to them see [#environment](#environment)


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

## Environment

- There are a couple of environment variables for nebula. Most of the time, the defaults are fine, but there are instances where you may not want certain options enabled or certain things running.

| Variable               | Description                                                                                              | Default |
|------------------------|----------------------------------------------------------------------------------------------------------|---------|
| | | |
