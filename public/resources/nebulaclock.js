// Get's the current day using the Date function built in.
// A dependency for displaying time - displayTime(void)
function getDayName(dateStr, locale) {
  var date = new Date(dateStr);
  return date.toLocaleDateString(locale, { weekday: "long" });
}

// The main function to show the time on the main page
// needs to be initialized by a call (only one)
// Dependent on getDayName function
function displayTime() {
  var date = new Date();
  var h = date.getHours(); // 0 - 23
  var m = date.getMinutes(); // 0 - 59
  var s = date.getSeconds(); // 0 - 59
  var session = "AM";
  h = h == 12 ? 24 : h;

  if (h == 0) {
    h = 12;
  } else if (h >= 12) {
    h = h - 12;
    session = "PM";
  }
  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  // Repeat itself every second
  setTimeout(displayTime, 1000);
  // Get today's date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;
  var time = h + "<span style='opacity:100%;' class='clockColon'>:</span>" + m;
  try {
    document.getElementById("digitalClock").innerHTML =
      getDayName(today, "us-US") + ", " + time + " " + session + ".";
  } catch {}

  return time;
}
// initialize the time function

displayTime();
