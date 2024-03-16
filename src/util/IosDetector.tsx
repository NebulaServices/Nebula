export function isIOS() {
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
}
