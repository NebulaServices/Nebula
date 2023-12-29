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
    <Link href={href} className="flex h-full w-full bg-navbar-color sm:h-auto">
      <div className="group flex w-full flex-row items-center justify-center border-t-2 border-solid border-navbar-text-color p-4 md:border-none">
        <Icon className="h-10 w-10 text-text-color transition duration-500 group-hover:text-text-hover-color md:h-6 md:w-6" />
        <span className="font-roboto pl-1 text-center text-4xl font-bold text-text-color transition duration-500 group-hover:text-text-hover-color md:text-lg">
          {t(translationKey)}
        </span>
      </div>
    </Link>
  );
}
