window.onload = function () {
  changeCSS(
    "--background-primary",
    localStorage.getItem("--background-primary")
  );
  changeCSS("--navbar-color", localStorage.getItem("--navbar-color"));
  changeCSS("--navbar-height", localStorage.getItem("--navbar-height"));
  changeCSS("--navbar-text-color", localStorage.getItem("--navbar-text-color"));
  changeCSS("--input-text-color", localStorage.getItem("--input-text-color"));
  changeCSS(
    "--input-placeholder-color",
    localStorage.getItem("--input-placeholder-color")
  );
  changeCSS(
    "--input-background-color",
    localStorage.getItem("--input-background-color")
  );
  changeCSS(
    "--input-border-color",
    localStorage.getItem("--input-border-color")
  );
  changeCSS("--input-border-size", localStorage.getItem("--input-border-size"));
  changeCSS("--navbar-link-color", localStorage.getItem("--navbar-link-color"));
  changeCSS("--navbar-font", localStorage.getItem("--navbar-font"));
  changeCSS(
    "--navbar-logo-filter",
    localStorage.getItem("--navbar-logo-filter")
  );
  changeCSS(
    "--text-color-primary",
    localStorage.getItem("--text-color-primary")
  );
};
