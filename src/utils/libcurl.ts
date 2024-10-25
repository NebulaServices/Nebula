//helper for libcurl as we have to use it in multiple locations and we don't want to re-download the WASM every time
//@ts-expect-error No types, expected. See: https://github.com/ading2210/libcurl.js for docs on how to use.
import { libcurl } from "libcurl.js-new/bundled";
import { WispServerURLS } from "@utils/settings/index";
let clientExists: boolean = false;
async function initLibcurl() {
    if (!clientExists) {
        await libcurl.load_wasm();
        libcurl.set_websocket(WispServerURLS.default);
        console.debug("Libcurl ready?", libcurl.ready);
        clientExists = true;
    }
}

type fetchType = "json" | "text"

async function fetchFromLibcurl(url: string, type: fetchType): Promise<string | [] | {}> {
    const res = await libcurl.fetch(url);
    const data = type === "json" ? await res.json() : await res.text();
    return data;
}

const client = {
    initLibcurl,
    fetchFromLibcurl
}

export { client };
