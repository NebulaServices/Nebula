<div align="center">
         
<img src="https://socialify.git.ci/nebulaservices/nebula/image?description=1&font=Inter&forks=1&issues=1&language=1&name=1&owner=1&pattern=Circuit%20Board&pulls=1&stargazers=1&theme=Dark" alt="ruby" width="640" height="320" />

<img alt="repo size" src="https://img.shields.io/github/repo-size/nebulaservices/nebula?style=for-the-badge"></img>
<img alt="website status" src="https://img.shields.io/website?url=https%3A%2F%2Fnebulaproxy.io&style=for-the-badge"></img>
<img alt="commit a week" src="https://img.shields.io/github/commit-activity/w/nebulaservices/nebula?style=for-the-badge"></img>

</div>

<div align="center">
    <h2>Get Started</h2>
    <a>To get started, press one of the buttons below to deploy Nebula</a>
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

-   This will **NOT** deploy on GitHub Pages, Netlify, Vercel, Gitlab Pages, or any other _static_ host
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

- By default, the marketplace is enabled and uses SQLite
- If you would like to disable the catalog, see [#config](#config)
- For big production instances, I recommend using PostgreSQL rather than SQLite. To do this see [#config](#config)
- To use PostgreSQL via the provided docker-compose files, see [#docker](#docker)

### How to make a theme

- Themes allow you to customize Nebula's *look*.

#### Prerequisites:
  - Make sure you have our [Discord server](https://discord.gg/unblocker) so you can submit your theme

##### Making the themes:

1. Firstly, copy the CSS vars:
```css
:root {
    --background-primary: /*Your stuff here */;
    --background-lighter: ;
    --navbar-color: ;
    --navbar-text-color: ;
    --navbar-link-color: ; 
    --navbar-link-hover-color: ; 
    --input-text-color: ;
    --input-placeholder-color: ; 
    --input-background-color: ;
    --input-border-color: ;
    --tab-color: ;
    --border-color: ; 
}
```

> [!NOTE]
>
> You can add a custom font as well! To do so, add this to your `:root`
> 
> ```css
> --font-family: /* Font family name */;
> ```
> 
> And this to the bottom of your CSS file/submission:
> ```css
> @font-face {
>    font-family: /* Name */;
>    src: url(/* Where the font is located! Local or external work! */);
>   }
>  ```
>
> A good example of using a custom font is the built-in `retro` theme [here](./database_assets/com.nebula.retro)

2. Add your colors and test! (Either with a self-hosted version of Nebula OR via a live preview (no clue when this will happen)

3. Once you're satisfied with the colors, submit your theme to the [Discord Server](https://discord.gg/unblocker)!

---
### How to make a plugin

- Plugins extend the functionality of either the proxied page(s) or the service worker.
- This guide provides an incredibly basic example of how to make either.

#### Prerequisites:
  - Make sure you have joined our [Discord server](https://discord.gg/unblocker) so you can submit your plugin.
  - Some knowledge of JS/TS

##### Serviceworker plugin:

- These plugins are handled by Workerware see [here](https://github.com/mercuryworkshop/workerware) for docs.

1. Create an index.js (or other file name) file:
```bash
touch index.js
```

2. Edit that file to include either of these:
    - Code encased in a string:
    ```js
    function setup() {
        // This function MUST return the following attributes:
        return {
            function: `console.log('Example code.')`,
            name: 'com.example', // Technically, it could be named anything. It is recommended to use the same name for everything (name when submitting and this)        
            events: ['fetch'] // See: https://github.com/mercuryworkshop/workerware for the event types you can use. (Also typed if you are using typescript)
        }
    }
    
    //This can be named anything. However, it's recommended to use `entryFunc` (with types, the naming IS enforced)
    self.entryFunc = setup; //DO NOT call the function here. Only assign the reference otherwise, it will error.
    ```
    - Code in an arrow function:    
    ```js
    const example = () => {
        console.log('Example code')
    }

    function setup() {
        //This function MUST return the following attributes:
        return {
            function: example, //Do not call the function, only assign the reference to the function.
            name: 'com.example', // Technicall could be name anything. Recommended to use the same name for everything (name when submitting and this)
            event: ['fetch'] // Se https://github.com/mercuryworkshop/workerware for the event types you can use. (Also typed if using typescript)
        }
    }

    //This can be named anything. However, it's recommended to use `entryFunc` (with types, the naming IS enforced)
    self.entryFunc = setup; //DO NOT call the function here. Only assign the reference; otherwise, it will result in an error.
    ```

> [!WARNING]
> The only *allowed* way to pass code to the `function` param is either a string or an arrow function. Named functions ***WILL NOT WORK***.
>
> Example of a named function: `function example() {/* Some form of code */}`.
>
> If a named function is used where it shouldn't be, your plugin will not be approved, nor will it work properly.

3. Submit your plugin in the [Discord](https://discord.gg/unblocker)!

##### Proxied page plugins

- They allow modification of websites that UV proxies, (EX: you could add Vencord to Discord with this)

1. Create an index.js file (or another file name)
```bash
touch index.js
```

2. Edit that file with your code and the following:
```js
//Name this whatever.
function example() {
    //You MUST return the following
    return {
        host: "example.com", //The host to match (so if the user visits example.com it will inject the html below.
        html: "<script>console.log('Example')</script>", //Must return a string (and be valid HTML or your plugin will break). How you get that string is up to you
        injectTo: "head" // Can be "head" or "body"
    }
}

// Technically, this could be named anything, it is recommended to call it `entryFunc`
self.entryFunc = example; //DO NOT run the function here. That will cause errors. Only assign the reference to the function here.
```

3. Submit it in our [Discord](https://discord.gg/unblocker)!

---

## Deployment

### Terminal

Prerequisites:
- Node & npm
- Git

1. Clone the repo:
```bash
git clone https://github.com/nebulaservices/nebula --recursive && cd nebula
```

2. Install all of the dependencies:
```bash
npm i
```

3. Create a `config.toml` file
```bash
cp config.example.toml config.toml
```

4. Modify the `config.toml` file to your liking (docs [here](#environment))
```
nano config.toml
```

5. Build the front end & server:
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

1. Clone the repo (skip if using a prebuilt image):
```bash
git clone https://github.com/nebulaservices/nebula --recursive && cd nebula
```

2. Create an `config.toml` file (if using prebuilt image, copy the example from the repo):
```bash
cp config.example.toml config.toml
```

3. Modify the `config.toml` file to your liking (docs [here](#environment))
```bash
nano config.toml
```

4. Build the docker image (skip if using prebuilt):
```bash
docker build nebula:latest
```
5. Run the docker images:

    - Prebuilt:
    ```bash
    docker run -v ./config.toml:/app/config.toml ghcr.io/nebulaservices/nebula:latest
    ```
    - Image you built yourself:
    ```bash
    docker run -v ./config.toml:/app/config.toml nebula:latest
    ```

#### Docker Compose

Prerequisites:
- Git
- Docker w/compose

1. Clone the repo (skip if using a prebuilt image):
```bash
git clone https://github.com/nebulaservices/nebula --recursive
```

2. Create an `config.toml` file (if using prebuilt image, copy the example from the repo):
```bash
cp config.example.toml config.toml
```

3. Modify the `config.toml` file to your liking (docs on that [here](#environment)]
```bash
nano config.toml
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
#### Extra (Postgres)

- To use Postgres over SQLite, uncomment the DB section in the `docker-compose` file (or use your own Postgres DB!). Then, modify the `config.toml` (See: [#config](#config) for knowledge on how to do this)
- To use Postgres over SQLite in a normal docker environment (no compose), you'll have to set one up and then modify the `config.toml` to use it. (See: [#config](#config) for knowledge on how to do this)

---

## Config

There are a couple of configuration options for Nebula. The defaults are fine most of the time, but there are instances where you may not want certain options enabled or certain things running.
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

## Deploying
### Koyeb
- First setup the config.toml file with the docker-compose instructions!
- Fork this repo
- Create new koyeb service, and select webservice
- Select import from github and import your forked repo
- Change package to dockerfile and press deploy!
