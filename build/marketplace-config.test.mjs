import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("static build gives its worker a remote marketplace origin", async () => {
  const config = await readFile(new URL("../dist/marketplace-config.js", import.meta.url), "utf8");
  assert.match(config, /self\.__catalogOrigin\s*=\s*"https:\/\/nebulaproxy\.io"/);
});
