// LEGIT here for ONE global.

import type { SW } from "@utils/serviceWorker";

declare global {
    interface Window {
        sw: SW;
    }
};

export {};
