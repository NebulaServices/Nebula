import type { Proxy } from "./settings";
type ProxyChoices = Exclude<Proxy, "automatic">;

const SupportedSites: Record<string, ProxyChoices> = {
  "discord.gg": "uv",
  "discord.com": "uv",
  "spotify.com": "rh",
  "spotify.link": "rh",
  "youtube.com": "uv",
  "youtu.be": "uv"
};

export { SupportedSites };
