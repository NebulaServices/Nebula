// OPTIONS

const storedSetTheme = localStorage.getItem("theme");

function switchProxy() {
  var selecter = document.getElementById("proxySwitcher");
  var selectedOption = selecter.value;

  localStorage.setItem("proxy", selectedOption);
  var storedChoice = localStorage.getItem("proxy");
  console.log(selectedOption);
}
function switchTheme() {
  var selecter = document.getElementById("themeSwitcher");
  var selectedOption = selecter.value;
  if (selectedOption == "dark") {
    changeCSS("--background-primary", "#191724", true);
    changeCSS("--navbar-color", "#26233a", true);
    changeCSS("--navbar-height", "60px", true);
    changeCSS("--navbar-text-color", "#7967dd", true);
    changeCSS("--input-text-color", "#e0def4", true);
    changeCSS("--input-placeholder-color", "#6e6a86", true);
    changeCSS("--input-background-color", "#1f1d2e", true);
    changeCSS("--input-placeholder-color", "white", true);
    changeCSS("--input-border-color", "#eb6f92", true);
    changeCSS("--input-border-size", "1.3px", true);
    changeCSS("--navbar-link-color", "#e0def4", true);
    changeCSS("--navbar-font", '"Roboto"', true);
    changeCSS("--navbar-logo-filter", "invert(0%)", true);
    changeCSS("--text-color-primary", "#e0def4", true);
    localStorage.setItem("theme", "dark");
  }
  if (selectedOption == "light") {
    changeCSS("--background-primary", "#d8d8d8", true);
    changeCSS("--navbar-color", "#a2a2a2", true);
    changeCSS("--navbar-height", "4em", true);
    changeCSS("--navbar-text-color", "#000000", true);
    changeCSS("--input-text-color", "#e0def4", true);
    changeCSS("--input-placeholder-color", "white", true);
    changeCSS("--input-background-color", "black", true);
    changeCSS("--input-border-color", "#eb6f92", true);
    changeCSS("--input-border-size", "1.3px", true);
    changeCSS("--navbar-link-color", "#000000", true);
    changeCSS("--navbar-font", '"Roboto"', true);
    changeCSS("--navbar-logo-filter", "invert(30%)", true);
    changeCSS("--text-color-primary", "#303030", true);
    localStorage.setItem("theme", "light");
  }
  if (selectedOption == "custom") {
    let startCustom = prompt(
      "Would you like to have an interactive setup? Y/N",
      ""
    );
    if (startCustom == "Y" || startCustom == "y") {
      alert(
        "Welcome to the interactive setup. Please enter the following values. If you don't know what to enter, just press enter. They will default to Dark Mode."
      );
      let background = prompt(
        "Background color || Possible Types: Keywords, RGB, RBBA, HSL, HSLA, Hexadecimal. || Default Value: #191724",
        ""
      );
      let navbar = prompt(
        "Navbar color || Possible Types: Keywords, RGB, RBBA, HSL, HSLA, Hexadecimal. || Default Value: #26233a",
        ""
      );
      let navbarHeight = prompt(
        "Navbar height || Possible Types: ABSOLUTE: cm, mm, Q, in, pc, pt, px  RELATIVE: em, ex, ch, rem, lh, rlh, vw, vh, vb, vi || Default Value: 60px",
        ""
      );
      let navbarText = prompt(
        "Navbar text color || Possible Types: Keywords, RGB, RBBA, HSL, HSLA, Hexadecimal. || Default Value: #7967dd",
        ""
      );
      let inputText = prompt(
        "Input text color || Possible Types: Keywords, RGB, RBBA, HSL, HSLA, Hexadecimal. || Default Value: #e0def4",
        ""
      );
      let inputPlaceholder = prompt(
        "Input placeholder color || Possible Types: Keywords, RGB, RBBA, HSL, HSLA, Hexadecimal. || Default Value: #6e6a86",
        ""
      );
      let inputBackground = prompt(
        "Input background color || Possible Types: Keywords, RGB, RBBA, HSL, HSLA, Hexadecimal. || Default Value: #1f1d2e",
        ""
      );
      let inputBorder = prompt(
        "Input border color || Possible Types: Keywords, RGB, RBBA, HSL, HSLA, Hexadecimal. || Default Value: #eb6f92",
        ""
      );
      let inputBorderSize = prompt(
        "Input border size || Possible Types: ABSOLUTE: cm, mm, Q, in, pc, pt, px  RELATIVE: em, ex, ch, rem, lh, rlh, vw, vh, vb, vi || Default Value: 1.3px",
        ""
      );
      let navbarFont = prompt(
        'Navbar font || Enter a default font name, custom ones will likely not work. || Default Value: "Roboto"',
        ""
      );
      let navbarLink = prompt(
        "Navbar link color || Possible Types: Keywords, RGB, RBBA, HSL, HSLA, Hexadecimal. || Default Value: #e0def4",
        ""
      );
      let navbarLogoFilter = prompt(
        "Navbar logo filter || Adjust the NavBar-Logo-Filter. || Default Value: invert(0%)",
        ""
      );
      let textColorPrimary = prompt(
        "Text color primary || Possible Types: Keywords, RGB, RBBA, HSL, HSLA, Hexadecimal. || Default Value: #e0def4",
        ""
      );
      localStorage.setItem("theme", "custom");
      changeCSS("--background-primary", background, true);
      changeCSS("--navbar-color", navbar, true);
      changeCSS("--navbar-height", navbarHeight, true);
      changeCSS("--navbar-text-color", navbarText, true);
      changeCSS("--input-text-color", inputText, true);
      changeCSS("--input-placeholder-color", inputPlaceholder, true);
      changeCSS("--input-background-color", inputBackground, true);
      changeCSS("--input-border-color", inputBorder, true);
      changeCSS("--input-border-size", inputBorderSize, true);
      changeCSS("--navbar-link-color", navbarLink, true);
      changeCSS("--navbar-font", navbarFont, true);
      changeCSS("--navbar-logo-filter", navbarLogoFilter, true);
      changeCSS("--text-color-primary", textColorPrimary, true);
    } else {
      alert("Non-Interactive Setup Not supported yet.");
    }
  }
}

// onload event
window.onload = function () {
  let background = localStorage.getItem("--background-primary");
  let navbar = localStorage.getItem("--navbar-color");
  let navbarHeight = localStorage.getItem("--navbar-height");
  let navbarText = localStorage.getItem("--navbar-text-color");
  let inputText = localStorage.getItem("--input-text-color");
  let inputPlaceholder = localStorage.getItem("--input-placeholder-color");
  let inputBackground = localStorage.getItem("--input-background-color");
  let inputBorder = localStorage.getItem("--input-border-color");
  let inputBorderSize = localStorage.getItem("--input-border-size");
  let navbarFont = localStorage.getItem("--navbar-font");
  let navbarLink = localStorage.getItem("--navbar-link-color");
  let navbarLogoFilter = localStorage.getItem("--navbar-logo-filter");
  let textColorPrimary = localStorage.getItem("--text-color-primary");
  changeCSS("--background-primary", background);
  changeCSS("--navbar-color", navbar);
  changeCSS("--navbar-height", navbarHeight);
  changeCSS("--navbar-text-color", navbarText);
  changeCSS("--input-text-color", inputText);
  changeCSS("--input-placeholder-color", inputPlaceholder);
  changeCSS("--input-background-color", inputBackground);
  changeCSS("--input-border-color", inputBorder);
  changeCSS("--input-border-size", inputBorderSize);
  changeCSS("--navbar-link-color", navbarLink);
  changeCSS("--navbar-font", navbarFont);
  changeCSS("--navbar-logo-filter", navbarLogoFilter);
  changeCSS("--text-color-primary", textColorPrimary);
};

function changeCSS(variable, value, saveBool) {
  document.documentElement.style.setProperty(variable, value);

  if (saveBool === true) {
    saveCSS(variable, value);
  }
}

function saveCSS(variable, value) {
  localStorage.setItem(variable, value);
}

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
  console.log("Checked");
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
var option2 = localStorage.getItem("ADVcloak");
function toggleClickoff() {
  if (option2 === "on") {
    option2 = "off";
    localStorage.setItem("ADVcloak", "off");
  } else {
    option2 = "on";
    localStorage.setItem("ADVcloak", "on");
  }
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
