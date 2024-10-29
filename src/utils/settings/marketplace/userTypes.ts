import { type SWPagePlugin, type SWPlugin, type SWPluginFunction as PluginFunction } from "./types";

interface PagePlugin extends Omit<SWPagePlugin, "type"> {};
interface ServiceWorkerPlugin extends Omit<SWPlugin, "type"> {};

declare global {
    function entryFunc(): PagePlugin | ServiceWorkerPlugin;
}

export { type PagePlugin, type ServiceWorkerPlugin, type PluginFunction };
