import { useLocation } from "preact-iso";
import LinkSvg from "../assets/link.svg";
import LogoSvg from "../assets/logo.svg";
import { useState, useEffect } from "preact/hooks"
import Clock from "./Clock";
export function Header() {
  const { url } = useLocation();

  return (
    <div id="navbar" className="h-16 px-4 bg-navbar-color flex flex-row items-center justify-between">
			<div className="flex flex-row items-center w-1/3">
				<img src="/logo.png" className="h-16 w-16"></img>
				<h1 className="font-roboto text-text-color text-4xl">nebula.</h1>
			</div>
      
			<div className="w-1/3">
				<Clock />
			</div>
			<div className="w-1/3">
				<span className="">Games</span>
			</div>
    </div>
  );
}
// yes i got itdfsdsdfsdfsdfsdfsdfsdfsdfsdfsdfsdf
// @madjikun do the DAMN CSS
// clock in middle, logo on left, buttons on side yk

// oh yeah go to the liveshare tab then click on the shared serer