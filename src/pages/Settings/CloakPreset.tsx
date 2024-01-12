import { useState, useEffect } from "preact/hooks";

interface Props {
  faviconUrl: string;
  title: string;
}

const CloakPreset = (props: Props) => {
  const cloak = (event: any) => {
    event.preventDefault();
    console.log(props.faviconUrl);
    localStorage.setItem("cloakFavicon", props.faviconUrl);
    localStorage.setItem("cloakTitle", props.title);
    window.location.reload();
  };

  return (
    <div
      onClick={cloak}
      className="cursor-pointer rounded-full border border-input-border-color bg-lighter"
    >
      <img
        src={props.faviconUrl === "none" ? "/logo.png" : props.faviconUrl}
        className="h-16 w-16 p-4"
      />
    </div>
  );
};

export default CloakPreset;
