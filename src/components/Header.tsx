import { HeaderButton } from "./HeaderButton";
import { useTranslation } from "react-i18next";
import { Link } from "preact-router";
import { motion } from "framer-motion";

// Header icons
import { HiOutlineCube } from "react-icons/hi";
import { RxMixerVertical, RxHamburgerMenu } from "react-icons/rx";
import { RiLinksFill } from "react-icons/ri";
import { BsQuestionLg } from "react-icons/bs";
import { useState } from "preact/hooks";

export function Header() {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      id="navbar"
      className="flex h-16 flex-row items-center justify-between bg-navbar-color px-4"
    >
      <Link href="/" className="w-1/8">
        <div className="relative flex flex-row items-center">
          <img
            src="/logo.png"
            className="h-16 w-16 transition-all duration-1000 hover:rotate-[360deg]"
            alt="Nebula Logo"
          ></img>
          <h1 className="font-roboto invisible whitespace-nowrap text-2xl font-bold text-navbar-text-color sm:visible sm:text-4xl">
            {" "}
            {t("header.title")}{" "}
          </h1>
        </div>
      </Link>

      <motion.button
        type="button"
        className="text-bold z-20 mr-4 text-3xl text-text-color md:hidden"
        aria-expanded={isActive}
        aria-controls="navbar-default"
        onClick={() => setIsActive(!isActive)}
        initial={{ rotate: 0 }}
        animate={{ rotate: isActive ? 90 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <RxHamburgerMenu />
      </motion.button>
      {window.innerWidth >= 768 && (
        //standard menu
        <div
          className={`fixed inset-0 z-10 flex md:relative md:right-0 ${
            window.innerWidth <= 768 && !isActive && "hidden"
          }`}
        >
          <div className="mt-16 h-[calc(100%-4rem)] w-full md:mt-auto md:h-full lg:mt-auto lg:h-full">
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
                  href="/faq"
                  Icon={BsQuestionLg}
                  translationKey="header.faq"
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
      )}
      {window.innerWidth <= 768 && (
        //animated mobile menu
        <motion.div
          className={`fixed inset-0 z-10 flex md:relative md:right-0 ${
            window.innerWidth <= 768 && !isActive && "hidden"
          }`}
          initial={{ x: 0 }}
          animate={{ x: isActive ? 0 : 1000 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mt-16 h-[calc(100%-4rem)] w-full md:mt-auto md:h-full lg:mt-auto lg:h-full">
            <div
              className="flex h-full w-full"
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
                  href="/faq"
                  Icon={BsQuestionLg}
                  translationKey="header.faq"
                />
                <HeaderButton
                  href="/discord"
                  Icon={RiLinksFill}
                  translationKey="header.discord"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
