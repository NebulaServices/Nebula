const generateOTP = document.getElementById("generate-otp");

generateOTP.onclick = () => {
  fetch("/generate-otp", { method: "PATCH" });
};

const validateOTP = document.getElementById("validate-otp");

validateOTP.onclick = () => {
  fetch("/validate-otp", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      otp: document.getElementById("otp").value
    })
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        setCookie("validation", data.validation, 30);
        location.href = "/";
      } else {
        alert("Invalid OTP.");
      }
    })
    .catch(() => {
      alert("An error occurred while validating your OTP.");
    });
};

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
