import { useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

export function Settings() {
	const [isFocused, setIsFocused] = useState(false);
	const { t } = useTranslation();

	return (
		<div class="flex justify-center items-center h-full">
			<p>WIP</p>
		</div>
	);
}