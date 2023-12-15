import { HeaderButton } from "./HeaderButton";
import { useTranslation } from "react-i18next";
import { Link } from "preact-router";

// Header icons
import { HiOutlineCube } from "react-icons/hi";
import { RxMixerVertical, RxHamburgerMenu } from "react-icons/rx";
import { RiLinksFill } from "react-icons/ri";
import { useState } from "preact/hooks";

export function Header() {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      id="navbar"
      className="flex h-16 flex-row items-center justify-between bg-navbar-color px-4"
    >
      <Link href="/" class="w-1/2">
        <div className="flex flex-row items-center">
          <img
            src="/logo.png"
            className="h-16 w-16 transition-all duration-1000 hover:rotate-[360deg]"
          ></img>
          <h1 className="font-roboto text-2xl font-bold text-navbar-text-color md:text-4xl">
            {t("header.title")}
          </h1>
        </div>
      </Link>
      <button
        type="button"
        className="z-10 md:hidden"
        aria-expanded={isActive}
        aria-controls="navbar-default"
        onClick={() => setIsActive(!isActive)}
      >
        <RxHamburgerMenu />
      </button>
      <div
        className={`z-5 fixed inset-0 flex md:relative md:right-0 ${
          window.innerWidth <= 768 && !isActive && "hidden"
        }`}
      >
        <div className="h-full w-full">
          <div
            className="flex h-full w-full whitespace-nowrap"
            onClick={() => setIsActive(false)}
          >
            <div className="flex w-full flex-col justify-evenly md:flex-row">
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
      </div>
    </div>
  );
}
