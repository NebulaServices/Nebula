import { readFileSync } from 'node:fs';
import { parse, TomlPrimitive } from 'smol-toml';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';

interface TomlData {
    marketplace: {
        enabled: boolean;
        psk: String
    }
    server: {
        server: {
            port: number;
            wisp: boolean;
            logging: boolean;
        }
        rammerhead: {
            reverseproxy: boolean;
            localstorage_sync: boolean;
            http2: boolean;
        }
    },
    db: {
        name: string;
        username: string;
        password: string;
        postgres: boolean;
    },
    postgres: {
        domain: string;
        port: number;
    }
}

interface Verify {
    name: string,
    typeOF: any,
    type: any 
}

let doc = readFileSync(fileURLToPath(new URL('../config.toml', import.meta.url))).toString();
const parsedDoc = parse(doc) as unknown as TomlData;

function verify(t: Verify[]) {
    for (let i: number = 0; i !== t.length; i++) {
        if (typeof t[i].typeOF !== t[i].type) {
            throw new Error(`Invalid structure: "${t[i].name}" should be a(n) ${t[i].type}`);
        }
    }
}

verify([
    {name: 'marketplace', typeOF: parsedDoc.marketplace, type: 'object'},
    {name: 'marketplace.enabled', typeOF: parsedDoc.marketplace.enabled, type: 'boolean'},
    {name: 'marketplace.psk', typeOF: parsedDoc.marketplace.psk, type: 'string'},
    {name: 'server', typeOF: parsedDoc.server, type: 'object'},
    {name: 'server.server', typeOF: parsedDoc.server.server, type: 'object'},
    {name: 'server.rammerhead', typeOF: parsedDoc.server.rammerhead, type: 'object'},
    {name: 'server.server.port', typeOF: parsedDoc.server.server.port, type: 'number'},
    {name: 'server.server.wisp', typeOF: parsedDoc.server.server.wisp, type: 'boolean'},
    {name: 'server.server.logging', typeOF: parsedDoc.server.server.logging, type: 'boolean'},
    {name: 'server.rammerhead.reverseproxy', typeOF: parsedDoc.server.rammerhead.reverseproxy, type: 'boolean'},
    {name: 'server.rammerhead.localstorage_sync', typeOF: parsedDoc.server.rammerhead.localstorage_sync, type: 'boolean'},
    {name: 'server.rammerhead.http2', typeOF: parsedDoc.server.rammerhead.http2, type: 'boolean'},
    {name: 'db', typeOF: parsedDoc.db, type: 'object'},
    {name: 'db.name', typeOF: parsedDoc.db.name, type: 'string'},
    {name: 'db.username', typeOF: parsedDoc.db.username, type: 'string'},
    {name: 'db.password', typeOF: parsedDoc.db.password, type: 'string'},
    {name: 'db.postgres', typeOF: parsedDoc.db.postgres, type: 'boolean'},
    {name: 'postgres', typeOF: parsedDoc.postgres, type: 'object'},
    {name: 'postgres.domain', typeOF: parsedDoc.postgres.domain, type: 'string'},
    {name: 'postgres.port', typeOF: parsedDoc.postgres.port, type: 'number'}
]);

if (parsedDoc.marketplace.psk === "CHANGEME") {
    console.warn(chalk.yellow.bold('PSK should be changed from "CHANGEME"'));
}
if (parsedDoc.db.password === "password") {
    console.warn(chalk.red.bold('You should change your DB password!!'));
}

export { TomlData, parsedDoc } 
