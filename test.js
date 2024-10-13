import fs from "fs";
// This is a test file to upload files to the Nebula server
import { File, FormData } from "formdata-node";
import { fileFromPath } from "formdata-node/file-from-path";
import { parsedDoc } from "./server/config.js";
const form = new FormData();
const file = new File(["My hovercraft is full of eels"], "example.txt");
form.set("file", file);
console.log(form);
await fetch("http://localhost:8080/api/upload-image", {
    headers: {
        PSK: parsedDoc.marketplace.psk
    },
    method: "post",
    body: form
}).then(async (res) => { console.log(await res.text()) });
