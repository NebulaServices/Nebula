import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import { TomlPrimitive, parse } from "smol-toml";

interface TomlData {
    marketplace: {
        enabled: boolean;
        psk: String;
    };
    server: {
        server: {
            port: number;
            wisp: boolean;
            logging: boolean;
        };
    };
    seo: {
        enabled: boolean;
        domain: string;
    };
    db: {
        name: string;
        username: string;
        password: string;
        postgres: boolean;
    };
    postgres: {
        domain: string;
        port: number;
    };
}

interface Verify {
    name: string;
    typeOF: any;
    type: any;
    verifyExtras?: () => boolean | Error;
}

let doc = readFileSync(fileURLToPath(new URL("../config.toml", import.meta.url))).toString();
const parsedDoc = parse(doc) as unknown as TomlData;

function verify(t: Verify[]) {
    for (let i: number = 0; i !== t.length; i++) {
        if (typeof t[i].typeOF !== t[i].type) {
            throw new Error(`Invalid structure: "${t[i].name}" should be a(n) ${t[i].type}`);
        }
        if (t[i].verifyExtras) {
            const extra = t[i].verifyExtras();
            if (extra !== true) {
                throw extra;
            }
        }
    }
}

verify([
    { name: "marketplace", typeOF: parsedDoc.marketplace, type: "object" },
    { name: "marketplace.enabled", typeOF: parsedDoc.marketplace.enabled, type: "boolean" },
    { name: "marketplace.psk", typeOF: parsedDoc.marketplace.psk, type: "string" },
    { name: "server", typeOF: parsedDoc.server, type: "object" },
    { name: "server.server", typeOF: parsedDoc.server.server, type: "object" },
    { name: "server.server.port", typeOF: parsedDoc.server.server.port, type: "number" },
    { name: "server.server.wisp", typeOF: parsedDoc.server.server.wisp, type: "boolean" },
    { name: "server.server.logging", typeOF: parsedDoc.server.server.logging, type: "boolean" },
    { name: "seo", typeOF: parsedDoc.seo, type: "object" },
    { name: "seo.enabled", typeOF: parsedDoc.seo.enabled, type: "boolean" },
    { name: "seo.domain", typeOF: parsedDoc.seo.domain, type: "string", verifyExtras: () => {
        try {
            new URL(parsedDoc.seo.domain);
        }
        catch (e) {
            return Error(e);
        }
        return true;
    }},
    { name: "db", typeOF: parsedDoc.db, type: "object" },
    { name: "db.name", typeOF: parsedDoc.db.name, type: "string" },
    { name: "db.username", typeOF: parsedDoc.db.username, type: "string" },
    { name: "db.password", typeOF: parsedDoc.db.password, type: "string" },
    { name: "db.postgres", typeOF: parsedDoc.db.postgres, type: "boolean" },
    { name: "postgres", typeOF: parsedDoc.postgres, type: "object" },
    { name: "postgres.domain", typeOF: parsedDoc.postgres.domain, type: "string" },
    { name: "postgres.port", typeOF: parsedDoc.postgres.port, type: "number" }
]);

if (parsedDoc.marketplace.psk === "CHANGEME") {
    console.warn(chalk.yellow.bold('PSK should be changed from "CHANGEME"'));
}
if (parsedDoc.db.password === "password") {
    console.warn(chalk.red.bold("You should change your DB password!!"));
}

export { TomlData, parsedDoc };
