declare module 'astro:env/client' {
	export const VERSION: string;	
export const MARKETPLACE_ENABLED: boolean;	
export const SEO: string;	

}

declare module 'astro:env/server' {
	

	export const getSecret: (key: string) => string | undefined;
}
