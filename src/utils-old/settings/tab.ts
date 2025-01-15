//Tab specific settings.
import { type AbCloaks, type TabCloaks } from "./types";
const TabSettings = {
    tabCloak: "nebula||tabCloak",
    abblob: "nebula||abBlob"
};

function cloak(cloak: AbCloaks | string, redirect: string, url: string) {
    switch (cloak) {
        case "a:b":
            window.location.replace(redirect);
            const win = window.open();
            win!.document.body.style.margin = "0";
            win!.document.body.style.height = "100vh";
            const iframe = win!.document.createElement("iframe");
            iframe.style.border = "none";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.margin = "0";
            iframe.src = url;
            win!.document.body.appendChild(iframe);
            break;
        case "blob":
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                <style type="text/css">
                body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
                </style>
                </head>
                <body>
                <iframe style="border: none; width: 100%; height: 100vh;" src="${window.location.href}"></iframe>
                </body>
                </html>
            `;
            window.location.replace("https://google.com");
            const blob = new Blob([htmlContent], { type: "text/html" });
            const blobURL = URL.createObjectURL(blob);
            window.open(blobURL, "_blank");
            break;
    }
}

const tabSettings = {
    cloakTab: function (cloak: TabCloaks | string) {
        const faviconElement = document.getElementById("favicon") as HTMLLinkElement;
        localStorage.setItem(TabSettings.tabCloak, cloak);
        switch (cloak) {
            case "google":
                document.title = "Google";
                faviconElement.href = "/cloaks/google.png";
                break;
            case "wikipedia":
                document.title = "Wikipedia";
                faviconElement.href = "/cloaks/wikipedia.ico";
                break;
            case "canvas":
                document.title = "Dashboard";
                faviconElement.href = "/cloaks/canvas.ico";
                break;
            case "classroom":
                document.title = "Home";
                faviconElement.href = "/cloaks/classroom.png";
                break;
            case "powerschool":
                document.title = "PowerSchool";
                faviconElement.href = "/cloaks/ps.ico";
                break;
            case "reset":
                //force a reset of favicon & title
                localStorage.setItem("nebula||tabCloak", "default");
                window.location.reload();
            default:
                return;
        }
    },
    abCloak: function (type: AbCloaks | string) {
        localStorage.setItem(TabSettings.abblob, type);
        cloak(type as AbCloaks, "https://google.com", window.location.href);
    }
};
export { tabSettings, TabSettings, cloak };
