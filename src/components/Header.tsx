import { HeaderButton } from "./HeaderButton";
import { useTranslation } from "react-i18next";

// Header icons
import { HiOutlineCube } from "react-icons/hi";
import { RxMixerVertical } from "react-icons/rx";
import { RiLinksFill } from "react-icons/ri";

export function Header() {
  const { t } = useTranslation();

  return (
    <div
      id="navbar"
      className="flex h-16 flex-row items-center justify-between bg-navbar-color px-4"
    >
      <a href="/" class="w-1/2">
        <div className="flex flex-row items-center">
          <img
            src="/logo.png"
            className="h-16 w-16 transition-all duration-1000 hover:rotate-[360deg]"
          ></img>
          <h1 className="font-roboto text-4xl font-bold text-navbar-text-color">
            {t("header.title")}
          </h1>
        </div>
      </a>
      <div className="w-1/2">
        <div className="flex flex-row items-center justify-end">
          <HeaderButton
            href="/games"
            Icon={HiOutlineCube}
            translationKey="header.games"
          />
          <HeaderButton
            href="/settings"
            Icon={RxMixerVertical}
            translationKey="header.settings"
          />
          <HeaderButton
            href="/discord"
            Icon={RiLinksFill}
            translationKey="header.discord"
          />
        </div>
      </div>
    </div>
  );
}
