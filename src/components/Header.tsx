import { useLocation } from "preact-iso";
import LinkSvg from "../assets/link.svg";
import LogoSvg from "../assets/logo.svg";
import GamesSvg from '../assets/games.svg';

import { useState, useEffect } from "preact/hooks"
import { useTranslation } from 'react-i18next';

export function Header() {
  const { url } = useLocation();
  const { t, i18n } = useTranslation();

  return (
    <div id="navbar" className="h-16 px-4 bg-navbar-color flex flex-row items-center justify-between">
			<div className="flex flex-row items-center w-1/2">
				<img src="/logo.png" className="h-16 w-16"></img>
				<h1 className="font-roboto text-navbar-text-color text-4xl">{t('header.title')}</h1>
			</div>
			<div className="w-1/2">
				<div className="flex flex-row justify-end items-center">
					<div class="p-4 flex flex-row items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
							style="width: 23px"
							>
							<path
								style="fill: #ffffff00"
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
							/>
						</svg>
						<span className="text-text-color text-lg pl-1">{t('header.games')}</span>
					</div>
					<div class="p-4 flex flex-row items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
							style="width: 23px"
						>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"
						/>
						</svg>
						<span className="text-text-color text-lg pl-1">{t('header.settings')}</span>
					</div>
					<div class="p-4 flex flex-row items-center">
						<svg
							style="width: 23px"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
						<path
							style="fill: #ffffff00"
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
						/>
						</svg>
						<span className="text-text-color text-lg pl-1">{t('header.discord')}</span>
					</div>
				</div>
			</div>
    </div>
  );
}
// yes i got itdfsdsdfsdfsdfsdfsdfsdfsdfsdfsdfsdf
// @madjikun do the DAMN CSS
// clock in middle, logo on left, buttons on side yk

// oh yeah go to the liveshare tab then click on the shared serer