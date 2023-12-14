import { useTranslation } from "react-i18next";
import { Link } from "preact-router";

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
      <div className="group flex flex-row items-center p-4">
        <Icon className="h-6 w-6 transition duration-500 group-hover:text-text-hover-color" />
        <span className="font-roboto pl-1 text-lg font-bold text-text-color transition duration-500 group-hover:text-text-hover-color">
          {t(translationKey)}
        </span>
      </div>
    </Link>
  );
}
