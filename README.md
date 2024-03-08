# Nebula

![license](https://img.shields.io/badge/License-GNU%20AGPL%20v3-blue?style=flat-square&logo=gnu) ![skidded: no](https://img.shields.io/badge/skidded%3F-no-red?style=flat-square) ![commit activity](https://img.shields.io/github/commit-activity/m/NebulaServices/Nebula?style=flat-square&logo=github) ![latest commit](https://img.shields.io/github/last-commit/NebulaServices/Nebula?display_timestamp=author&style=flat-square&logo=github) ![language](https://img.shields.io/github/languages/top/NebulaServices/Nebula?style=flat-square&logo=typescript) ![discord](https://img.shields.io/badge/discord-blue?logo=discord&link=https%3A%2F%2Fdiscord.gg%2Funblock&style=flat-square) ![latest release](https://img.shields.io/github/v/release/NebulaServices/Nebula?style=flat-square&logo=github) ![forks](https://img.shields.io/github/forks/NebulaServices/Nebula?style=flat-square&logo=github) ![stars](https://img.shields.io/github/stars/NebulaServices/Nebula?style=flat-square&logo=github) ![followers](https://img.shields.io/github/followers/NebulaServices?style=flat-square&logo=github) ![watchers](https://img.shields.io/github/watchers/NebulaServices/Nebula?style=flat-square&logo=github) ![size](https://img.shields.io/github/repo-size/NebulaServices/Nebula?style=flat-square&logo=github) ![files](https://img.shields.io/github/directory-file-count/NebulaServices/Nebula?style=flat-square&logo=github) ![issues (open)](https://img.shields.io/github/issues/NebulaServices/Nebula?style=flat-square&logo=github) ![issues (closed)](https://img.shields.io/github/issues-closed/NebulaServices/Nebula?style=flat-square&logo=github) ![prs (open)](https://img.shields.io/github/issues-pr/NebulaServices/Nebula?style=flat-square&logo=github) ![prs (closed)](https://img.shields.io/github/issues-pr-closed/NebulaServices/Nebula?style=flat-square&logo=github) ![issues (closed)](https://img.shields.io/librariesio/github/NebulaServices/Nebula?style=flat-square&logo=npm)

NebulaWeb is an official flagship of Nebula Services and Nebula Developer Labs. NebulaWeb is a stunning, sleek, and functional web-proxy with support for thousands of popular sites. With NebulaWeb, the sky is the limit.

## Features

- Stunning and highly functional UI
- 3 different backend proxies
- Hides your IP from sites
- [List of officially supported sites (WIP)](https://github.com/NebulaServices/Nebula/blob/dev/docs/officially-supported-sites.md) <!-- bruh this link is dead -->
- Full mobile support
- `about:blank` cloaking
- Tons of configuration

## Easy Deployment
If you're ~~artistic~~ less technologically proficient, use these.

Firstly, make sure you have a GitHub account (sign in!). If you don't, make one for free [here](https://github.com/join). Then, scroll to the top of this page, press the blue `Code` button, then the `Codespaces` tab, and then `Create codespace on main`. 

Next, wait for the page to load. Near the bottom of the page will be a terminal. Type in the following:
```
pnpm i
```
Then press enter. Then type in the following:
```
npm run bstart
```
And press enter. You should get a popup, select `Make public`. Next select the `PORTS (1)` tab, hover over the line under `Forwarded Address`, and click the globe icon. That's it.

## Advanced Deployment

<!-- bro who tf wrote this section!? -->
<!--Table of contents

- Deployment

--- 

## Deployment-->
This is only for people more familar with running a server. If you are, run these commands on your server:  
```
$ git clone https://github.com/NebulaServices/Nebula.git
$ pnpm i
$ npm run bstart
```

> Note: You may also need to run `npm i -g pnpm tsx`

## Tech Stack & Credits

- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind](https://tailwindcss.com/)
- [ExpressJS](https://expressjs.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [react-i18next](https://github.com/i18next/react-i18next)
- [Ultraviolet (proxy)](https://github.com/titaniumnetwork-dev/Ultraviolet)
- [Dynamic (proxy)](https://github.com/NebulaServices/Dynamic)
- [Rammerhead (proxy)](https://github.com/binary-person/rammerhead)
- [Bare Server (nodejs edition)](https://github.com/tomphttp/bare-server-node)
- [Catppuccin (themes)](https://github.com/catppuccin/catppuccin) (sidenote: [catppuccin](https://github.com/catppuccin/nvim) is objectively the best neovim theme 💯)

## Support

For support, join our discord: [.gg/unblocker](https://discord.gg/unblocker)

## Demo

[Click here to see a demo of Nebula](https://nebulaproxy.io/)

## License

(Nebula's license is now GNU AGPL V3 as of v7.10)
Copyright Nebula Services 2021 - Present
<br>
This project uses the AGLP GNU V3 license.
