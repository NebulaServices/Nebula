// Stealth engine, a dependency for everything above.

// ensures that the js file is loaded
window.stealthEngineLoaded = true;
function stealthEngine(encodedURL) {
  // Remember that the EncodedURL argument must be pre-encoded, or encoded before the function is called.
  // This function does not encode the argument at all!

  // Initialize the variable
  let inFrame;
  // make sure there isn't a window open already
  try {
    inFrame = window !== top;
  } catch (e) {
    inFrame = true;
  }
  setTimeout(() => {
    // Basically, a checklist to make sure that an error won't occur.
    // In this if statement, we're checking if an iframe is already being opened, if popups are disabled, and if the user agent IS NOT firefox (firefox sucks, sorry Moz)
    if (!inFrame && !navigator.userAgent.includes("Firefox")) {
      const popup = open("about:blank", "_blank");
      if (!popup || popup.closed) {
        alert(
          "StealthEngine was unable to open a popup. (do you have popups disabled?)"
        );
      } else {
        const doc = popup.document;
        const iframe = doc.createElement("iframe");
        const style = iframe.style;
        popup.onload = () => {
          document.getElementById("lpoader").style.display = "none";
          document.getElementById("connectorText").textContent =
            "connecting to service";
          setTimeout(() => {
            document.getElementById("connectorText").textContent =
              "connecting to service";
          }, 17500);
        };
        var isClosed = setInterval(function () {
          if (popup.closed) {
            clearInterval(isClosed);
            document.getElementById("lpoader").style.display = "none";
            document.getElementById("connectorText").textContent =
              "connecting to service";
          }
        }, 1000);
        // Favicon attachment
        const img = doc.createElement("link");
        const arcSrc = doc.createElement("script");
        // We attach ARC because it supports us, keeping our arc link there would be greatly appreciated :)
        arcSrc.setAttribute("src", "https://arc.io/widget.min.js#BgaWcYfi");
        arcSrc.setAttribute("async", "");
        doc.head.appendChild(arcSrc);
        const link = location.href;
        img.rel = "icon";
        img.href =
          ABFavicon ||
          "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png";
        if (localStorage.nogg == "on") {
          doc.title = ABTitle || getRandomName();
        } else {
          doc.title = ABTitle || "Nebula";
        }

        var currentLink = link.slice(0, link.length - 1);

        iframe.src = currentLink + encodedURL;

        style.position = "fixed";
        style.top = style.bottom = style.left = style.right = 0;
        style.border = style.outline = "none";
        style.width = style.height = "100%";

        doc.body.appendChild(iframe);
        doc.head.appendChild(img);
      }
    }
  }, 1500);
}

let tryAbFavi = localStorage.getItem("ABfaviconURL");
let ABFavicon = "";
if (tryAbFavi === null) {
  console.warn("ABfaviconURL is null, Defaulting");
  ABFavicon = "";
} else if (tryAbFavi == "") {
  console.warn("ABfaviconURL is empty, Defaulting");
  ABFavicon = "";
} else {
  ABFavicon = tryAbFavi;
}

let tryAbTitle = localStorage.getItem("ABtitle");
let ABTitle = "";
if (tryAbTitle === null) {
  console.warn("ABtitle is null, Defaulting");
  ABTitle = "";
} else if (tryAbTitle == "") {
  console.warn("ABtitle is empty, Defaulting");
  ABTitle = "";
} else {
  ABTitle = tryAbTitle;
}
