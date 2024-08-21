// This is a test file to upload files to the Nebula server
import { FormData, File } from "formdata-node";
import { fileFromPath } from "formdata-node/file-from-path";
import config from "./config.json" assert { type: "json" };

const form = new FormData();
// const file = new File(["My hovercraft is full of eels"], "example.txt");

form.set("file", await fileFromPath("asgard.png"));

console.log(config.marketplace_psk);

await fetch("http://localhost:8080/api/upload-image", {
  headers: {
    PSK: config.marketplace_psk,
  },
  method: "post",
  body: form,
});
