import { useTranslation } from 'react-i18next';

export function discordPag() {
	const { t } = useTranslation()
	return (
		<section class="h-full">
			<div class="flex justify-center items-center h-full flex-col">
				<div class="p-6 flex flex-col items-center">
					<p class="text-4xl font-roboto font-bold">{t('discord.title')}</p>
					<span class="text-3xl font-roboto">{t('discord.sub')}</span>
				</div>
                <a href="https://discord.gg/unblocker" class="p-6">
					<button class="p-2 border border-input-border-color rounded-2xl h-14 w-56 text-center bg-input text-xl placeholder:text-input-text focus:outline-none font-roboto">{t('discord.button1')}</button>
				</a>
                <a href="/" class="p-6">
					<button class="p-2 border border-input-border-color rounded-2xl h-14 w-56 text-center bg-input text-xl placeholder:text-input-text focus:outline-none font-roboto">{t('discord.button2')}</button>
				</a>
			</div>
		</section>
	);
}