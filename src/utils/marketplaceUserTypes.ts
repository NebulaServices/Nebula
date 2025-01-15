import { type SWPluginFunction as PluginFunction, type SWPagePlugin, type SWPlugin } from "./marketplace";

interface PagePlugin extends Omit<SWPagePlugin, "type"> {}
interface ServiceWorkerPlugin extends Omit<SWPlugin, "type"> {}

declare global {
    function entryFunc(): PagePlugin | ServiceWorkerPlugin;
}

export { type PagePlugin, type ServiceWorkerPlugin, type PluginFunction };
