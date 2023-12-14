import { useTranslation } from "react-i18next";
import { Link } from 'preact-router';

interface HeaderButtonProps {
    href: string;
    Icon: any;
    translationKey: string;
}

export function HeaderButton(props: HeaderButtonProps) {
    const { href, Icon, translationKey } = props;
    const { t } = useTranslation();

    return (
        <Link href={href}>
            <div class="p-4 flex flex-row items-center">
                <Icon class="w-6 h-6"/>
                <span className="text-text-color text-lg pl-1 font-roboto font-bold">{t(translationKey)}</span>
            </div>
        </Link>
    )
}