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
  }).then((response) => {
    return response.json();
  }).then((data) => {
    if (data.success) {
      
    } else {
      alert("Invalid OTP.");
    }
  }).catch(() => {
    alert("An error occurred while validating your OTP.")
  });
};
