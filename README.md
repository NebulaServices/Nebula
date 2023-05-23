# Nebula

NebulaWeb is an official flagship of Nebula Services and Nebula Developer Labs. NebulaWeb is a stunning, sleek, and functional web-proxy with support for thousands of popular sites. With NebulaWeb, the sky is the limit.

Quick note: If you are a system administrator, and have questions, our email is always open `chloe@nebulaproxy.io`



![license](https://img.shields.io/badge/License-GNU%20AGPL%20v3-blue)

![chat](https://img.shields.io/badge/chat-1139%20online-brightgreen)

## Features

- Stunning and highly functional UI with multiple themes
- XOR/b64 encoding all traffic
- Hides your IP from sites
- [List of officially supported sites](https://github.com/NebulaServices/Nebula/blob/dev/docs/officially-supported-sites.md)
- _limited_ mobile support
- Stealth Mode (buffed `about:blank` cloaking)
- **NEW** Clickoff cloaking
- **NEW** Email OTP verification

# Deployment

Table of contents

- Quick & easy deployment
- Deployment configuration explaination
- how to use email OTP Verification mode
- Advanced Deployment
- Filesystem

## Quick & Easy Deployment Options

## PLEASE READ THIS NOTICE: IF YOU ARE USING NODE VERSION 20 (HEROKU, RAILWAY), YOU WILL NEED TO TEMPORARILY DOWNGRADE TO 19 OR EARLIER.


[![Deploy to IBM Cloud](https://raw.githubusercontent.com/BinBashBanana/deploy-buttons/master/buttons/remade/ibmcloud.svg)](https://cloud.ibm.com/devops/setup/deploy?repository=https://github.com/NebulaServices/Nebula)
<br>
[![Deploy to Amplify Console](https://raw.githubusercontent.com/BinBashBanana/deploy-buttons/master/buttons/remade/amplifyconsole.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/NebulaServices/Nebula)
<br>
[![Run on Google Cloud](https://raw.githubusercontent.com/BinBashBanana/deploy-buttons/master/buttons/remade/googlecloud.svg)](https://deploy.cloud.run/?git_repo=https://github.com/NebulaServices/Nebula)
<br>
[![Deploy on Railway](https://binbashbanana.github.io/deploy-buttons/buttons/remade/railway.svg)](https://railway.app/new/template/pBzeiN)
<br>
[![Deploy To Koyeb](https://binbashbanana.github.io/deploy-buttons/buttons/remade/koyeb.svg)](https://app.koyeb.com/deploy?type=git&repository=github.com/NebulaServices/Nebula&branch=main&name=NebulaProxy)

---

## Deployment Configuration Guide

(Example configuration with none-json notes)

```json
{
  "sendgrid_verification": false,
  "sendgrid_options": {
    "api_key": "YOUR_SENDGRID_API_KEY",
    "sendFromEmail": "THE EMAIL THE CODES WILL BE SENT FROM (MUST BE VERIFIED IN SENDGRID)",
    "to_email": "THE EMAIL YOU WANT THE CODES SENT TO"
  },

  "discord_verification": false,
  "webhook_url": "YOUR DISCORD WEBHOOK URL",

  "smtp_verification": false,
  "smtp_options": {
    "to_email": "THE EMAIL YOU WANT THE CODES SENT TO",
    "sendFromEmail": "THE EMAIL THE CODES ARE SENT FROM",
    "host": "YOUR SMTP HOST",
    "port": 465,
    "auth": {
      "user": "SMTP USER",
      "pass": "YOUR PASSWORD"
    }
  }
}
```

## Email Verification OTP

### What is this?

Email verification is a new and unique feature that we've implemented in the event that someone wants to keep their deployment of Nebula private and secure.

### What does it do

When a user tries to access the website, before allowed access they will be asked for a One time password sent to an email set in the deployment configuration. Once verified, they will have 15 day access to the site.

#### SendGrid Setup Instructions

- Firstly, We need to enable verification within the deployment configuration

  - change `"sendgrid_verification":false,` to `"sendgrid_verification":true,` above the SendGrid Section

  - _Note: You have to reboot the node app for any changes to take place._

- Now, we need to use an api to send a message
  - Make an account at Sendgrid (https://app.sendgrid.com/)
  - _Note: It is likely that other versions of Nebula will use a different package to send emails._
- Verify the email you want to recieve emails from (Create a sender identity)
  - Go to settings -> Sender authentication and click Verify a Single Sender
- Now, We need to get the API key to connect to the API
  - Go to settings -> API Keys -> and make an API key.
- Complete the information in the deployment config `deployment.config.json` under the `sendgrid_options` section such as: sendFromEmail, to_email and api_key

#### Discord Webhook Setup Instructions

- Set discord_verification to true in the deployment configuration.
- Create a channel in a discord server you have admin in.
- Click the Edit Channel button.
- Click Integrations
- Click create web hook and copy the URL.
- Paste it under the `webhook_url` section in the deployment configuration.

#### SMTP Setup Instructions

- Set `smtp_verification` to true.
- Change `to_email` to the email address you want the codes to be sent to.
- Change `sendFromEmail to the email address that is going to send the codes.
- Get the host and port from your email provider's documentation.
- Fill in your username and password under the `user` and `pass` section under auth.

## Advanced Deployment

### Initial configuration

credits to @ProgrammerIn-wonderland for writing this wonderful tutorial (which can also be found in the docs :)

- Create an account at https://www.cloudflare.com/
- Create an account at https://www.freenom.com/ (or any registrars)
- Find a free domain name at Freenom
- Click checkout
  - Select (12 Months @ FREE)
  - Select "Use DNS"
    - Select Use your own DNS
- Go to cloudflare, click add new site, and enter the free domain name
- Select "Free Plan"
- Click continue, ignore DNS
  - Copy the name servers cloudflare gives you
- Go back to your Freenom tab, enter in the name servers which cloudflare gave you
  - You can keep IP blank
- Click continue
- Click complete order
- Go back to cloudflare tab, click "Check Nameservers"
- Select DNS on your right bar
- Enter in the IP of the server which will be hosting Nebula
  - Target will be `@`
- Click Enable proxy (little gray cloud icon, if active its orange)
- Select SSL/TLS in your right bar
- Click "Flexible"

---

### Server configuration

- SSH into the server you'll be using, I'll assume its running Ubuntu 22.04 (though the commands are the same for debian 10+ versions, and Ubuntu versions 20.04+)
- run

```
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - \ &&
sudo apt-get install -y nodejs npm
git clone https://github.com/NebulaServices/Nebula.git
cd Nebula
npm i
npm ci
sudo nohup PORT=80 node . &
```

**Make sure your firewall is configured to let through port 80 traffic!** \
_Note: Server will need to run` cd Nebula && sudo nohup PORT=80 node . &` on reboot_

## File Structure

| **File**                         | Purpose                                                                                                  |     |
| -------------------------------- | -------------------------------------------------------------------------------------------------------- | --- |
| `src/index.html`                 | The main frontend visuals for NebulaWEB.                                                                 |     |
| `src/unv.html`                   | The verification-required frontend/visuals.                                                              |     |
| `src/options.html`               | The frontend for Nebula's options, settings, and preferences.                                            |     |
| `public/resources/v.js`          | Client verification system for the OTP system.                                                           |     |
| `public/resources/nebulamain.js` | All of the DOM/client code for NebulaWEB. Includes options, themeSystem, cloak, stealthengine, and more. |     |
| `app.js`                         | The backend server for Nebula. Contains Nodestatic, Bare, HTTP, and more.                                |     |

## Tech Stack

- HTML, JS, CSS
- Partical.JS (Specifically v4, 5, 6.1 &< only)
- Ultraviolet (proxy)
- Osana (proxy)
- TompHTTP Bare Server Node
- ExpressJS

## Support

For support, email chloe@nebula.bio or join our discord: discord.gg/unblocker

## Demo

[Click here to see a demo of Nebula](https://nebulaproxy.io/)

## Acknowledgements

- [UV (one of the proxies use)](https://github.com/titaniumnetwork-dev/Ultraviolet)
- [Osana (one of the proxies we use)](https://github.com/NebulaServices/Osana)
- [Bare Server Node](https://github.com/tomphttp/bare-server-node)
- [Partical.JS (v4, 5, 6.1 &< only)](https://github.com/VincentGarreau/particles.js)

## License

(Nebula's license is now GNU AGPL V3 as of v7.10)
Copyright Nebula Services 2021 - Present
<br>
This project uses the AGLP GNU V3 license.
