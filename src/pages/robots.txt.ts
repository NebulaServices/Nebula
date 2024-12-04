import type { APIRoute } from "astro";
import { SEO } from "astro:env/client";
const SEOConfig = JSON.stringify(SEO);

const genRobotsTXT = (sitemap: URL) => `
User-Agent: *
Allow: /
User-Agent: *
Disallow: /uv
SiteMap: ${sitemap.href}
`;

export const GET: APIRoute = ({ site, request }) => {
    const url = new URL('sitemap-index.xml', site);
    console.log(new URL(request.url).host);
return new Response(genRobotsTXT(url));
};
