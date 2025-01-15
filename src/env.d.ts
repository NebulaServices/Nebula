/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@titaniumnetwork-dev/ultraviolet/client" />
interface SJOptions {
    prefix: string;
    globals?: {
        wrapfn: string;
        wrapthisfn: string;
        trysetfn: string;
        importfn: string;
        rewritefn: string;
        metafn: string;
        setrealmfn: string;
        pushsourcemapfn: string;
    };
    files: {
        wasm: string;
        shared: string;
        worker: string;
        client: string;
        sync: string;
    };
    flags?: {
        serviceworkers?: boolean;
        syncxhr?: boolean;
        naiiveRewriter?: boolean;
        strictRewrites?: boolean;
        rewriterLogs?: boolean;
        captureErrors?: boolean;
        cleanErrors?: boolean;
        scramitize?: boolean;
        sourcemaps?: boolean;
    };
    siteFlags?: {};
    codec?: {
        encode: string;
        decode: string;
    };
}

declare class ScramjetController {
    constructor(opts: SJOptions);
    init(): Promise<void>;
    encodeUrl(term: string): string;
}
