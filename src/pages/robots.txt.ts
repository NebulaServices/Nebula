import type { APIRoute } from "astro";
import { SEO } from "astro:env/client";
interface config {
    enabled: boolean;
    domain: string;
}
const SEOConfig: config = JSON.parse(SEO);

const genRobotsTXT = (sitemap: URL) => `
User-Agent: *
Allow: /
User-Agent: *
Disallow: /uv
SiteMap: ${sitemap.href}
`;

const otherDomainTXT = `
User-Agent: *
Disallow: /*
`

export const GET: APIRoute = ({ site, request }) => {
    const url = new URL('sitemap-index.xml', site);
    const host = new URL(request.url).host;
    if (SEOConfig.enabled && host === SEOConfig.domain) {
        return new Response(genRobotsTXT(url));
    }
    return new Response(otherDomainTXT);
};
