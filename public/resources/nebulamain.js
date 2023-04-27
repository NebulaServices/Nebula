// Welcome to the main Nebula script
// This script handles all the tasks neccesary for a proxy.
// What this doesn't include is the actual proxies, just the neccesary tasks in order for the proxies to be able to preform, such as registering the service worker required by Interception proxies.

// Documentation Writers/Contributors:
// GreenWorld#0001 (Discord) / GreenyDev (Github)
// If you would like to contribute, feel free to open a pull request.
// These docs are not finished

// Navigation controls for smaller devices
// Executed in the inline HTML
function openNav() {
  document.getElementById("sidenav").style.width = "260px";
}
function closeNav() {
  document.getElementById("sidenav").style.width = "0px";
}

function setLoaderText() {
  document.getElementById("connectorText").textContent =
    "connecting to service";
  const loader = document.getElementById("lpoader");

  const loadConstructer = loader.style;
  loadConstructer.display = "flex";
  loadConstructer.justifyContent = "center";
  // Changing the text over multiple periods of time creates character, and aliveness (is that even a word?)
  setTimeout(() => {
    document.getElementById("connectorText").style.fontSize = "12px";
    document.getElementById("connectorText").textContent =
      "Due to high server load, this may take a while.";
  }, 3200);
  setTimeout(() => {
    document.getElementById("connectorText").style.fontSize = "14px";
    document.getElementById("connectorText").textContent =
      "Hmmm.. Something isn't right..";
  }, 17000);
}

window.stealthEngineLoaded = false;

window.addEventListener("load", () => {
  // Register the service workers for Osana and Ultraviolet proxy protocols
  // This is a better method than registering onsubmit because this allows the ability to use proxied links on the main page.

  navigator.serviceWorker.register("./sw.js", {
    scope: "/service/"
  });

  // Link evaluation
  // This functions' purpose is to check a string of text (the argument)
  // it recognizes whether a string is a URL or not, and it returns a true or false value
  function isUrl(val = "") {
    if (
      /^http(s?):\/\//.test(val) ||
      (val.includes(".") && val.substr(0, 1) !== " ")
    )
      return true;
    return false;
  }

  const proxy = localStorage.getItem("proxy") || "uv";
  const inpbox = document.querySelector("form");
  // Display the "loading" indicators on the main page, looks much better than a static/still screen.

  const hasLoadedElement = document.createElement("div");
  hasLoadedElement.id = "hasLoaded";
  hasLoadedElement.style.display = "none";
  document.body.appendChild(hasLoadedElement);

  inpbox.addEventListener("submit", (event) => {
    // Prevents the default event tasks
    event.preventDefault();
    console.log("Connecting to service -> loading");
    setLoaderText();
  });

  // Form submission
  const form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    // Check if the service worker (commonly called SW) is registered
    if (typeof navigator.serviceWorker === "undefined")
      alert(
        "An error occured registering your service worker. Please contact support - discord.gg/unblocker"
      );
    //
    if (proxy === "uv" || proxy === "osana") {
      // Re-register the service worker incase it failed to onload
      navigator.serviceWorker
        .register("./sw.js", {
          scope: "/service/"
        })
        .then(() => {
          const value = event.target.firstElementChild.value;
          let url = value.trim();
          if (!isUrl(url)) url = "https://www.google.com/search?q=" + url;
          if (!(url.startsWith("https://") || url.startsWith("http://")))
            url = "http://" + url;
          // encode the URL for UltraViolet
          let redirectTo =
            proxy === "uv"
              ? __uv$config.prefix + __uv$config.encodeUrl(url)
              : __osana$config.prefix + __osana$config.codec.encode(url);
          const option = localStorage.getItem("nogg");
          if (option === "on") {
            if (window.stealthEngineLoaded !== false) {
              stealthEngine(redirectTo);
            } else {
              console.error(
                "Stealth Engine failed to load! Please contact support - discord.gg/unblocker"
              );
            }
          } else {
            setTimeout(() => {
              // If StealthMode is off, this is the enabled option.
              const _popout = window.open("/blob", "_self");
              const blob = _popout.document;
              // Write all of the neccesary page elements, and the Options including the cloak (if enabled)
              // The blob writing is just the background elements, like the "Nebula is loading your content, please wait" screen. It does not carry proxied content, or even the iframe.
              blob.write(`
           <script> 
           function handleTabLeave(activeInfo) {
  var link = document.querySelector("link[rel~='icon']");
  if (localStorage.getItem('ADVcloak') == "on") {
  if (document.title == "Nebula") {
    document.title = "Google"
    if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
}
link.href = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo7AE3IF34XPGyseQjkXIOsWXpkZiLlMjSAwySjcJSPAwlv3hnGKi1&usqp=CAU';
    document.title = "Google"
  } else if (document.title == "Google") {
    document.title = "Nebula"
    if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
    }
    } else {
      return false;
    }
}
}
document.addEventListener("visibilitychange", handleTabLeave)
</script> 
          
           <style>@import "https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap"; body{background:#191724;color:#fff}div{margin-top:30px;font-size:100px;text-align:center;font-family:"Roboto";font-weight:700}.loader .b1{left:42%}.loader .b2{left:50%;animation-delay:100ms}.loader .b3{left:58%;animation-delay:200ms;color:#eb6f92}.loader .b1,.loader .b2,.loader .b3{width:10px;height:30px;position:absolute;top:50%;transform:rotate(0);animation-name:spinify;animation-duration:1600ms;animation-iteration-count:infinite;color:#eb6f92;background-color:#eb6f92}@keyframes spinify{0%{transform:translate(0px,0px)}33%{transform:translate(0px,24px);border-radius:100%;width:10px;height:10px}66%{transform:translate(0px,-16px)}88%{transform:translate(0px,4px)}100%{transform:translate(0px,0px)}}</style> 
           <div class="loader">
  <div>Nebula is loading your content!</div>
  <div style='font-size:35px;'>Please wait</div>
  <div class="b1"></div> 
  <div class="b2"></div>
  <div class="b3"></div>
</div> 
`);
              // inside of the blob, create and append the Iframe element which WILL carry the proxied content.
              const iframe = blob.createElement("iframe");
              const style = iframe.style;
              const img = blob.createElement("link");
              const link = location.href;
              // We attach ARC because it supports us, keeping our arc link there would be greatly appreciated :)
              const arcSrc = blob.createElement("script");
              arcSrc.setAttribute(
                "src",
                "https://arc.io/widget.min.js#BgaWcYfi"
              );
              // Arc requires the Async attribute
              // Async means not running parallel to other tasks, so it loads seperately to everything else (in a sense)
              // Aysnchronous and Synchronous are somewhat difficult topics, so we recommend you
              arcSrc.setAttribute("async", "");
              blob.head.appendChild(arcSrc);
              img.rel = "icon";
              img.href =
                "https://static.nebulacdn.xyz/content/images/nebula_logo_619x619.png";
              blob.title = getRandomName();
              // slice the link like some nice fruit :)
              // Removing the '/' from 'whateverthislinkis.gay/'
              //                                              ^
              var currentLink = link.slice(0, link.length - 1);
              // To attribute the iframe to a source, we need to + the current link (post-slice) to the requested website, which is passed through the functions argument
              iframe.src = currentLink + redirectTo;

              // Style the Iframe to fill the entire screen and remove the bessels.
              style.position = "fixed";
              style.top = style.bottom = style.left = style.right = 0;
              style.border = style.outline = "none";
              style.width = style.height = "100%";
              // finally, append the iframe to the blob's (window) body
              blob.body.appendChild(iframe);
            }, 1000);
          }
        });
    }
  });
});

// Set the option
var option = localStorage.getItem("nogg");
if (localStorage.getItem("theme") == null) {
  localStorage.setItem("theme", "dark");
}

// Extra logging for support
function log() {
  setTimeout(
    console.log.bind(
      console,
      "%cWelcome To Nebula!",
      "background: #3F51B5;color:#FFF;padding:5px;border-radius: 5px;line-height: 26px; font-size:24px;"
    )
  );
  setTimeout(
    console.log.bind(
      console,
      "%cIf you are seeing this, Nebula's main script has succesfully loaded!",
      "background: green;color:#FFF;padding:5px;border-radius: 5px;line-height: 26px; font-size:16px;"
    )
  );
  setTimeout(
    console.log.bind(
      console,
      "%cIf you encounter an error, contact our support team on discord. Copy and paste the information below and send it in the ticket",
      "background: red;color:#FFF;padding:5px;border-radius: 5px;line-height: 26px; font-size:12px;"
    )
  );
  let online = navigator.onLine;
  let userAgent = navigator.userAgent;
  let browserName;
  let diagnosticDomain = window.location.href;
  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "Chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "Firefox";
  } else if (userAgent.match(/safari/i)) {
    browserName = "Safari";
  } else if (userAgent.match(/opr\//i)) {
    browserName = "Opera";
  } else if (userAgent.match(/edg/i)) {
    browserName = "Edge";
  } else {
    browserName = "Browser not detected!";
  }
  setTimeout(
    console.log.bind(
      console,
      `%c Information: \n Online: ${online} \n URL: ${diagnosticDomain} \n Browser: ${browserName} \n UA: ${userAgent}`, 
      "background: gray;color:#FFF;padding:5px;line-height: 26px; font-size:14px;"
    )
  )

}
log();

// Adjectives and surnames for a more advanced stealth engine.
// Used together to generate random names for the tab name
let adjectives;
let surnames;

async function surnameAdjectivesData() {
  await fetch("/resources/adjectives_surnames.json")
    .then((response) => response.json())
    .then((data) => {
      adjectives = data.adjectives;
      surnames = data.surnames;
    });
}
surnameAdjectivesData();

// Random number generator
// Dependency of getRandomName function
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Random name generator
function getRandomName() {
  const random1 = getRandomNumber(0, adjectives.length);
  const random2 = getRandomNumber(0, surnames.length);
  const adjective = adjectives[random1];
  const surname = surnames[random2];
  // Connect the adjective and surname together to create a random name
  const randomName = adjective + "-" + surname;
  return randomName;
}

// Clickoff cloaking
// This is used to cloak the tab when it is not active
function handleTabLeave() {
  var link = document.querySelector("link[rel~='icon']");
  if (localStorage.getItem("ADVcloak") == "on") {
    if (document.title == "Nebula") {
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
      link.href = "https://www.google.com/favicon.ico";
      document.title = "Google";
    } else if (document.title == "Google") {
      document.title = "Nebula";
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
      link.href =
        "https://camo.githubusercontent.com/b565ae2e136e0ac6023e7099288a62382de7c2b8cdce86a8b90449b86649434c/68747470733a2f2f6e6562756c6170726f78792e6e6562756c612e62696f2f696d616765732f6c6f676f2e706e67";
    } else {
      return false;
    }
  }
}
// Create and Add the event listener
document.addEventListener("visibilitychange", handleTabLeave);

const stealthStored = localStorage.getItem("nogg");
function link(_link) {
  if (stealthStored == "on") {
    let inFrame;
    try {
      inFrame = window !== top;
    } catch (e) {
      inFrame = true;
    }
    setTimeout(() => {
      if (!inFrame && !navigator.userAgent.includes("Firefox")) {
        const popup = open("about:blank", "_blank");
        if (!popup || popup.closed) {
          alert("Popups are disabled!");
        } else {
          const doc = popup.document;
          const iframe = doc.createElement("iframe");
          const style = iframe.style;
          const img = doc.createElement("link");
          img.rel = "icon";
          img.href =
            "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png";
          doc.title = getRandomName();
          var currentLink = _link.slice(0, _link.length - 1);
          iframe.src =
            location.origin +
            "/service/go/" +
            __uv$config.encodeUrl(currentLink);
          style.position = "fixed";
          style.top = style.bottom = style.left = style.right = 0;
          style.border = style.outline = "none";
          style.width = style.height = "100%";
          doc.body.appendChild(iframe);
        }
      }
    }, 200);
  } else {
    location.href =
      "service/go/" + __uv$config.encodeUrl("https://radon.games/");
  }
}
