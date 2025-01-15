import { defaultLang, ui } from "./ui";

export const STATIC_PATHS = [{ params: { lang: "en_US" } }, { params: { lang: "jp" } }];

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split("/");
    if (lang in ui) return lang as keyof typeof ui;
    return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
    return function t(key: keyof (typeof ui)[typeof defaultLang]) {
        return ui[lang][key] || ui[defaultLang][key];
    };
}
