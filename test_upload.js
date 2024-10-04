import fs from "fs";
// This is a test file to upload files to the Nebula server
import { File, FormData } from "formdata-node";
import { fileFromPath } from "formdata-node/file-from-path";

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const form = new FormData();
// const file = new File(["My hovercraft is full of eels"], "example.txt");

form.set("file", await fileFromPath("asgard.png"));

console.log(config.marketplace_psk);
console.log(form);
await fetch("http://localhost:8080/api/upload-image", {
  headers: {
    PSK: config.marketplace_psk
  },
  method: "post",
  body: form
});
