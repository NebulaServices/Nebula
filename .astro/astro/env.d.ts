declare module 'astro:env/client' {
	export const VERSION: string;	
export const MARKETPLACE_ENABLED: boolean;	

}

declare module 'astro:env/server' {
	

	export const getSecret: (key: string) => string | undefined;
}
