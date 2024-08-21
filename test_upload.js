// This is a test file to upload files to the Nebula server
import { FormData, File } from "formdata-node";
import { fileFromPath } from "formdata-node/file-from-path";

const form = new FormData();
// const file = new File(["My hovercraft is full of eels"], "example.txt");

form.set("file", await fileFromPath("asgard.png"));

await fetch("http://localhost:8080/upload", { method: "post", body: form });
