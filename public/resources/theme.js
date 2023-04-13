const THEME_OPTIONS = {
  dark: {
    "--background-primary": "#191724",
    "--navbar-color": "#26233a",
    "--navbar-height": "60px",
    "--navbar-text-color": "#7967dd",
    "--input-text-color": "#e0def4",
    "--input-placeholder-color": "#6e6a86",
    "--input-background-color": "#1f1d2e",
    "--input-placeholder-color": "white",
    "--input-border-color": "#eb6f92",
    "--input-border-size": "1.3px",
    "--navbar-link-color": "#e0def4",
    "--navbar-font": '"Roboto"',
    "--navbar-logo-filter": "invert(0%)",
    "--text-color-primary": "#e0def4"
  },
  light: {
    "--background-primary": "#d8d8d8",
    "--navbar-color": "#a2a2a2",
    "--navbar-height": "4em",
    "--navbar-text-color": "#000000",
    "--input-text-color": "#e0def4",
    "--input-placeholder-color": "white",
    "--input-background-color": "black",
    "--input-border-color": "#eb6f92",
    "--input-border-size": "1.3px",
    "--navbar-link-color": "#000000",
    "--navbar-font": '"Roboto"',
    "--navbar-logo-filter": "invert(30%)",
    "--text-color-primary": "#303030"
  },
  suit: {
    "--background-primary": "#0c0c0c",
    "--navbar-color": "#ff2e4e",
    "--navbar-height": "4em",
    "--navbar-text-color": "#000000",
    "--input-text-color": "#e0def4",
    "--input-placeholder-color": "white",
    "--input-background-color": "#00000000",
    "--input-border-color": "#ff346e",
    "--input-border-size": "1.3px",
    "--navbar-link-color": "#000000",
    "--navbar-font": '"Roboto"',
    "--navbar-logo-filter": "brightness(30)",
    "--text-color-primary": "#00000"
  },
  metallic: {
    "--background-primary": "#171717",
    "--navbar-color": "#004953",
    "--navbar-height": "4em",
    "--navbar-text-color": "#ffffff",
    "--input-text-color": "#e0def4",
    "--input-placeholder-color": "white",
    "--input-background-color": "#004953",
    "--input-border-color": "#000000",
    "--input-border-size": "1.3px",
    "--navbar-link-color": "#e0def4",
    "--navbar-font": '"Roboto"',
    "--navbar-logo-filter": "invert(50%)",
    "--text-color-primary": "#e0def4"
  },
  dante: {
    "--background-primary": "#131313",
    "--navbar-color": "#e4ff8b",
    "--navbar-height": "3.5em",
    "--navbar-text-color": "#000000",
    "--input-text-color": "#000000",
    "--input-placeholder-color": "000000",
    "--input-background-color": "#e4ff8b",
    "--input-border-color": "#00000000",
    "--input-border-size": "1.3px",
    "--navbar-link-color": "#000000",
    "--navbar-font": '"Roboto"',
    "--navbar-logo-filter": "brightness(0%)",
    "--text-color-primary": "#000"
  }
};

function changeCSS(property, value, isRoot = false) {
  const root = document.documentElement;
  isRoot
    ? root.style.setProperty(property, value)
    : root.style.setProperty(property, value, "important");
}

function saveCSS(variable, value) {
  localStorage.setItem(variable, value);
}
function applyTheme(theme) {
  Object.entries(theme).forEach(([property, value]) => {
    changeCSS(property, value);
    localStorage.setItem(property, value);
  });
}

function switchTheme() {
  const selecter = document.getElementById("themeSwitcher");
  const selectedOption = selecter.value;
  console.log(selectedOption);
  const theme = THEME_OPTIONS[selectedOption];

  if (!theme) {
    return;
  }

  applyTheme(theme);
  localStorage.setItem("theme", selectedOption);

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
