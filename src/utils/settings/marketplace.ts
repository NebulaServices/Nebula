//marketplace code & handlers
import { type Package, type PackageType } from "./types";
const AppearanceSettings = {
  themes: "nebula||themes",
  stylePayload: "nebula||stylepayload",
  video: "nebula||video",
  image: "nebula||image"
};

const marketPlaceSettings = {
  install: function (p: Package, packageName: string, payload?: any) {
    return new Promise<void>((resolve) => {
      if (p.theme) {
        let themes = localStorage.getItem(AppearanceSettings.themes) as any;
        themes ? (themes = JSON.parse(themes)) : (themes = []);
        if (!themes.find((theme: any) => theme === packageName)) {
          themes.push(packageName);
          localStorage.setItem(AppearanceSettings.themes, JSON.stringify(themes));
          this.changeTheme(false, payload, p.theme.video, p.theme.bgImage);
        }
        resolve();
      }
    });
  },
  uninstall: function (p: PackageType, packageName: string) {
    return new Promise<void>((resolve) => {
      if (p === "theme") {
        let items = localStorage.getItem(AppearanceSettings.themes) as any;
        items ? (items = JSON.parse(items)) : (items = []);
        if (items.find((theme: any) => theme === packageName)) {
          const idx = items.indexOf(packageName);
          items.splice(idx, 1);
          localStorage.setItem(AppearanceSettings.themes, JSON.stringify(items));
          this.changeTheme(true);
        }
        resolve();
      }
    });
  },
  changeTheme: async function (
    reset: Boolean,
    payload?: any,
    videoSource?: string,
    bgSource?: string
  ) {
    async function resetCSS() {
      const stylesheet = document.getElementById("stylesheet")! as HTMLLinkElement;
      localStorage.removeItem(AppearanceSettings.stylePayload);
      stylesheet.href = "/nebula.css";
    }
    function resetVideo() {
      localStorage.removeItem(AppearanceSettings.video);
      const source = document.getElementById("nebulaVideo")! as HTMLVideoElement;
      source.src = "";
    }
    function resetBGImage() {
      localStorage.removeItem(AppearanceSettings.image);
      const image = document.getElementById("nebulaImage")! as HTMLImageElement;
      image.style.display = "none";
      image.src = "";
    }
    if (reset === true) {
      await resetCSS();
      await resetCSS();
      resetBGImage();
      resetVideo();
    }
    if (videoSource || localStorage.getItem(AppearanceSettings.video)) {
      resetBGImage();
      resetVideo();
      const source = document.getElementById("nebulaVideo")! as HTMLVideoElement;
      if (!localStorage.getItem(AppearanceSettings.video)) {
        localStorage.setItem(AppearanceSettings.video, videoSource as string);
      }
      source.src = `/videos/${videoSource ? videoSource : localStorage.getItem(AppearanceSettings.video)}`;
    }
    if (bgSource || localStorage.getItem(AppearanceSettings.image)) {
      resetVideo();
      resetBGImage();
      const image = document.getElementById("nebulaImage")! as HTMLImageElement;
      if (!localStorage.getItem(AppearanceSettings.image)) {
        localStorage.setItem(AppearanceSettings.image, bgSource as string);
      }
      image.style.display = "block";
      image.src = `/images/${bgSource ? bgSource : localStorage.getItem(AppearanceSettings.image)}`;
    }
    if (payload) {
      const stylesheet = document.getElementById("stylesheet")! as HTMLLinkElement;
      if (localStorage.getItem(AppearanceSettings.stylePayload) !== payload) {
        localStorage.setItem(AppearanceSettings.stylePayload, payload);
      }
      stylesheet.href = `/styles/${localStorage.getItem(AppearanceSettings.stylePayload)}`;
    } else {
      if (localStorage.getItem(AppearanceSettings.stylePayload)) {
        const stylesheet = document.getElementById("stylesheet")! as HTMLLinkElement;
        stylesheet.href = `/styles/${localStorage.getItem(AppearanceSettings.stylePayload)}`;
      }
    }
  }
};

export { AppearanceSettings, marketPlaceSettings };
