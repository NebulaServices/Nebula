type TabCloaks = "default" | "google" | "wikipedia" | "canvas" | "classroom" | "powerschool"
function cloakTab(cloak: TabCloaks | string) {
    const faviconElement = document.getElementById("favicon") as HTMLLinkElement;
    localStorage.setItem("nebula||tabCloak", cloak); 
    switch(cloak) {
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
}

export { cloakTab }
