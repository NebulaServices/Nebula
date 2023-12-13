import { useTranslation } from 'react-i18next';

export function discordPag() {
	const { t } = useTranslation()
	return (
		<section class="h-full">
			<div class="flex justify-center items-center h-full flex-col">
				<div class="p-6 flex flex-col items-center">
					<p class="text-4xl font-roboto font-bold">Nebula's Discord Server</p>
					<span class="text-3xl font-roboto">Would you like to Load this via Proxy?</span>
				</div>
                <a href="https://discord.gg/unblocker">
					<button class="p-2 border border-input-border-color rounded-2xl h-14 w-44 text-center bg-input text-xl placeholder:text-input-text focus:outline-none font-roboto">Open Normally</button>
				</a>
                <a href="/">
					<button class="p-2 border border-input-border-color rounded-2xl h-14 w-44 text-center bg-input text-xl placeholder:text-input-text focus:outline-none font-roboto">Use Proxy</button>
				</a>
			</div>
		</section>
	);
}