// OPTIONS

const storedSetTheme = localStorage.getItem("theme");

function switchProxy() {
  var selecter = document.getElementById("proxySwitcher");
  var selectedOption = selecter.value;

  localStorage.setItem("proxy", selectedOption);
  var storedChoice = localStorage.getItem("proxy");
}

function setDefaultsIfUndefined() {
    if (localStorage.ADVcloak == undefined) localStorage.setItem("ADVcloak", "off")
    if (localStorage.nogg == undefined) localStorage.setItem("nogg", "off")
    if (localStorage.ABtitle == undefined) localStorage.setItem("ABtitle", "")
    if (localStorage.ABfaviconURL == undefined) localStorage.setItem("ABfaviconURL", "")
    if (localStorage.theme == undefined) localStorage.setItem("theme", "dark")
    if (localStorage.proxy == undefined) localStorage.setItem("proxy", "uv")
}
setDefaultsIfUndefined();

function resetViews() {
  changeCSS("--background-primary", "#191724", true);
  changeCSS("--navbar-color", "#26233a", true);
  changeCSS("--navbar-height", "60px", true);
  changeCSS("--navbar-text-color", "rgb(121 103 221)", true);
  changeCSS("--navbar-link-color", "#e0def4", true);
  changeCSS("--navbar-font", '"Roboto"', true);
  changeCSS("--input-text-color", "#e0def4", true);
  changeCSS("--input-placeholder-color", "#6e6a86", true);
  changeCSS("--input-background-color", "#1f1d2e", true);
  changeCSS("--input-placeholder-color", "white", true);
  changeCSS("--input-border-color", "#eb6f92", true);
  changeCSS("--input-border-size", "1.3px", true);
  return "All views reset";
}
function saveIc() {
  var notification = `
              <div class="notification-container" id="notification-container">
              <div class="notification notification-success">
                  <strong>Success!</strong> Your settings have been saved!
              </div>
          </div>
          `;
  document.getElementById("notifhere").innerHTML = notification;
  setTimeout(() => {
    var NotificationOBJ = document.getElementById("notifhere");
  }, 2000);
}

function unsavedChanges() {
  var notification = `
      <div class="notification-container" id="notification-container">
      <div class="notification notification-danger" id="notification-container">
      <strong>Danger!</strong> You have unsaved changes!
  </div>
  </div>
          `;
  document.getElementById("notifhere").innerHTML = notification;
  setTimeout(() => {
    var NotificationOBJ = document.getElementById("notifhere");
  }, 2000);
}

var option = localStorage.getItem("nogg");

function toggleNoGG() {
  if (option === "on") {
    option = "off";
    localStorage.setItem("nogg", "off");
  } else {
    option = "on";
    localStorage.setItem("nogg", "on");
  }
}
var option2 = localStorage.ADVcloak;
function toggleClickoff() {
  if (option2 == undefined) return console.error("ADVcloak key unset!")
  if (option2 === "on") {
    option2 = "off";
    localStorage.setItem("ADVcloak", "off");
  } else {
    option2 = "on";
    localStorage.setItem("ADVcloak", "on");
  }
}

function toggleSetting(localStorageKey, value) {
  localStorage.setItem(localStorageKey, value);
}

window.onload = function () {
  if (localStorage.getItem("ABfaviconURL") === null) {
  } else if (localStorage.getItem("ABfaviconURL") == "") {
  } else {
    document.querySelector("#faviconInput").value =
      localStorage.getItem("ABfaviconURL");
  }
  if (localStorage.getItem("ABtitle") === null) {
  } else if (localStorage.getItem("ABtitle") == "") {
  } else {
    document.querySelector("#titleInput").value =
      localStorage.getItem("ABtitle");
  }
};

function saveAbInfo() {
  var faviconURL = document.getElementById("faviconInput").value;
  var title = document.getElementById("titleInput").value;
  localStorage.setItem("ABfaviconURL", faviconURL);
  localStorage.setItem("ABtitle", title);
  var notification = `
  <div class="notification-container" id="notification-container">
  <div class="notification notification-success">
      <strong>Success!</strong> Your settings have been saved!
  </div>
</div>
      `;
  document.getElementById("notifhere").innerHTML = notification;
  setTimeout(() => {
    var NotificationOBJ = document.getElementById("notifhere");
  }, 2000);
}
