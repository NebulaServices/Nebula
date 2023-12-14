import { useTranslation } from 'react-i18next';
import { Link } from 'preact-router';

export function NotFound() {
	const { t } = useTranslation()
	return (
		<section class="h-full">
			<div class="flex justify-center items-center h-full flex-col">
				<img src="/404.png" class="h-72"></img>
				<div class="p-6 flex flex-col items-center">
					<p class="text-4xl font-roboto font-bold">{t('404.text')}</p>
					<span class="text-3xl font-roboto">404</span>
				</div>
				<Link href="/">
					<button class="p-2 border border-input-border-color rounded-2xl h-14 w-44 text-center bg-input text-xl placeholder:text-input-text focus:outline-none font-roboto">{t('404.return')}</button>
				</Link>
			</div>
		</section>
	);
}
