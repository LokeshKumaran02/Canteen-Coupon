function validateStringInput(input) {
  input.value = input.value.replace(/[^a-zA-Z. ]/g, '');
}
function validateNumericInput(input) {
  input.value = input.value.replace(/[^0-9]/g, '');
}

const firebaseConfig = {

  apiKey: "AIzaSyAc0YySiBDrFxCErrGprMys3kGwIQxzz6A",

  authDomain: "foodtoken-97152.firebaseapp.com",

  databaseURL: "https://foodtoken-97152-default-rtdb.firebaseio.com",

  projectId: "foodtoken-97152",

  storageBucket: "foodtoken-97152.appspot.com",

  messagingSenderId: "579533869365",

  appId: "1:579533869365:web:d76b66e0e776745afdbc7c"

};
firebase.initializeApp(firebaseConfig);
var qrDB = firebase.database().ref('userdetails');




var otpGenerated = false; 
document.getElementById('unit').addEventListener('input', function() {
  if (this.value.length < 2 || this.value.length >25) {
    this.style.borderColor = 'red';
    this.style.borderWidth = '2px';
  
  } else {
    this.style.borderColor = 'green';
    this.style.borderWidth = '2px';
  }
});
document.getElementById('name').addEventListener('input', function() {
  if (this.value.length < 2 || this.value.length >25) {
    this.style.borderColor = 'red';
    this.style.borderWidth = '2px';
  
  } else {
    this.style.borderColor = 'green';
    this.style.borderWidth = '2px';
  }
});
document.getElementById('phone').addEventListener('input', function() {
  var phone = getElementVal('phone');
  if (this.value.length < 10 || this.value.length >11 || phone ==0) {
    this.style.borderColor = 'red';
    this.style.borderWidth = '2px';
  
  } else {
    this.style.borderColor = 'green';
    this.style.borderWidth = '2px';
  }
});
document.getElementById('count').addEventListener('input', function() {
  var count = parseInt(getElementVal('count'));
  if (this.value.length < 1 || this.value.length >2 || count == 0 || count>100) {
    this.style.borderColor = 'red';
    this.style.borderWidth = '2px';
  
  } else {
    this.style.borderColor = 'green';
    this.style.borderWidth = '2px';
  }
});
document.getElementById('given').addEventListener('input', function() {
  if (this.value.length < 2 || this.value.length >25) {
    this.style.borderColor = 'red';
    this.style.borderWidth = '2px';
  
  } else {
    this.style.borderColor = 'green';
    this.style.borderWidth = '2px';
  }
});
var modal = document.getElementById("errorModal");

// Get the close button element
var closeButton = document.querySelector(".close");

// Function to close the modal
function closeModal() {
modal.style.display = "none";
}

// Event listener for close button click
closeButton.addEventListener("click", closeModal);

// Event listener for outside click
window.addEventListener("click", function (event) {
if (event.target === modal) {
  closeModal();
}
});

function validate() {
var unit = document.getElementById('unit').value;
var name = document.getElementById('name').value;
var phone = document.getElementById('phone').value;
var count = document.getElementById('count').value;
var given = document.getElementById('given').value;
var selectedOption = document.querySelector('input[name="option"]:checked');
var selectedValue = null;
var errorMessages = [];

if (unit === "" && name === "" && phone === "" && count === "" && selectedOption === null) {
  errorMessages.push("Enter Unit name ");
  errorMessages.push("Enter Name");
  errorMessages.push("Enter phone number");
  errorMessages.push("Enter Food Count");
  errorMessages.push("Enter Given For");
  errorMessages.push("Select a meal option");
  
} else {
  if (unit === "" || unit.length < 2 || unit.length > 15) {
    errorMessages.push("Enter valid unit name");
  }
  if (name === "" || name.length < 2 || name.length > 25) {
    errorMessages.push("Enter valid name");
  }
  if (phone === "" || phone.length !== 10) {
    errorMessages.push("Enter valid phone number");
  }
  if (count === "" || count.length > 3 || count === 0) {
    errorMessages.push("Enter valid Food Count");
  } else if (count > 100) {
    errorMessages.push("Limit is 100");
  }
  if (given === "" || given.length < 2 || given.length > 25) {
    errorMessages.push("Enter Given For");
  }
  if (selectedOption) {
    selectedValue = selectedOption.value;
  } else {
    errorMessages.push("Select Meal Option");
  }

  if (unit !== "" && name !== "" && phone !== "" && count !== "" && phone.length === 10 && count < 101 && selectedOption) {
    saved(unit, name, phone, count, otp, given, selectedValue, given);
    submitForm(unit, name, phone, count);
  } else {
    errorMessages.push("");
  }
}

if (errorMessages.length > 0) {
  // Display the error messages in the modal
  var errorContainer = document.getElementById("errorMessages");
  errorContainer.innerHTML = "";
  for (var i = 0; i < errorMessages.length; i++) {
    var errorMessage = document.createElement("p");
    errorMessage.textContent = errorMessages[i];
    errorContainer.appendChild(errorMessage);
  }
  modal.style.display = "block";
}
document.getElementById("otp-label").style.display = "block"
}
function submitForm(unit, name, phone, count) {
// Submit the form data or perform any other desired action
console.log("Unit:", unit);
console.log("Name:", name);
console.log("Phone:", phone);
console.log("Count:", count);
}



document.getElementById('form').addEventListener('submit', submitForm);
function generateOTP() {
  // Assuming you have the OTP digits stored in an array
  const otpDigits = [1, 2, 3, 4];

  // Setting the value of each digit in the respective <label> elements
  document.getElementById("otp-digit1").textContent = otpDigits[0];
  document.getElementById("otp-digit2").textContent = otpDigits[1];
  document.getElementById("otp-digit3").textContent = otpDigits[2];
  document.getElementById("otp-digit4").textContent = otpDigits[3];
}
var otpGenerated = false;
var countdownInterval;

function submitForm(e) {
  e.preventDefault();

  var name = getElementVal('name');
  var phone = getElementVal('phone');
  var unit = getElementVal('unit');
  var count = parseInt(getElementVal('count'));
  var given = getElementVal('given');
  var selectedOption = document.querySelector('input[name="option"]:checked');
  if (selectedOption) {
    var selectedValue = selectedOption.value;
  }
  if (!selectedOption) {
    return;
  }

  if (unit && name && phone && given) {
    if (count > 0 && count < 100 && phone.length === 10) {
      resetForm(); // Reset the form values
      generateOTP(unit, name, phone, count, selectedValue, given); // Generate a new OTP and QR code
      document.getElementById("otp-label").style.display = "block";
    }
  }
}

function resetForm() {
  document.getElementById("form").reset();
}

function generateOTP(unit, name, phone, count, selectedValue, given) {
  var digits = '0123456789';
  var otpLength = 4;
  var otp = '';

  for (var i = 0; i < otpLength; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  document.getElementById("otp-digit1").textContent = otp[0];
  document.getElementById("otp-digit2").textContent = otp[1];
  document.getElementById("otp-digit3").textContent = otp[2];
  document.getElementById("otp-digit4").textContent = otp[3];
  otpGenerated = true;
  generateQRCode(unit, name, phone, count, otp, selectedValue, given);
  startCountdown();
}

function startCountdown() {
  var remainingSeconds = 60;
  var timerLabel = document.getElementById("timer-label");
  var otpLabel = document.getElementById("otp-label");

  timerLabel.textContent = "Disappear After " + remainingSeconds + " seconds";

  clearInterval(countdownInterval); // Clear any existing countdown interval

  countdownInterval = setInterval(function () {
    remainingSeconds--;
    timerLabel.textContent = "Disappear After " + remainingSeconds + " seconds";

    if (remainingSeconds <= 0) {
      clearInterval(countdownInterval);
      document.getElementById("qrimage").src = ""; // Clear the QR code
      document.getElementById("imgbox").classList.remove("show-img"); // Hide the QR code container
      resetOTP(); // Reset the OTP digits
      timerLabel.textContent = ""; // Clear the timer label
      otpLabel.style.display = "none"; // Hide the OTP label
    }
  }, 1000);

  document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Validation logic goes here

    // If validation is successful, display the OTP label
    otpLabel.style.display = "block";
  });
}


function resetOTP() {
  document.getElementById("otp-digit1").textContent = "";
  document.getElementById("otp-digit2").textContent = "";
  document.getElementById("otp-digit3").textContent = "";
  document.getElementById("otp-digit4").textContent = "";
  otpGenerated = false;
}

// Rest of the code...





const saved = (unit, name, phone, count, otp, selectedValue, given) => {
  var userform = qrDB.push();
  userform.set({
    unit: unit,
    name: name,
    phone: phone,
    count: count,
    otp: otp,
    food: selectedValue,
    given: given,
  });
};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};

function generateQRCode(unit, name, phone, count, otp, selectedValue, given) {
  console.log(unit, name, phone, count, otp, selectedValue, given);
  var food_data = [unit, name, phone, count, otp, selectedValue, given];
  var qrCodeData = food_data.join("\t");
  var link =
    "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" +
    encodeURIComponent(qrCodeData);
  var qrimage = document.getElementById("qrimage");
  var imgbox = document.getElementById("imgbox");
  imgbox.classList.add("show-img");
  qrimage.src = link;
  console.log(qrimage.src);
  console.log(link);
  document.getElementById("form").reset();
  var remainingSeconds = 60;
  var timerLabel = document.getElementById("timer-label");
  timerLabel.textContent = "Disappear After " + remainingSeconds + " seconds";

  var countdownInterval = setInterval(function() {
    remainingSeconds--;
    timerLabel.textContent = "Disappear After " + remainingSeconds + " seconds";

    if (remainingSeconds <= 0) {
      clearInterval(countdownInterval);
      qrimage.src = ""; // Clear the QR code
      imgbox.classList.remove("show-img"); // Hide the QR code container
      resetOTP(); // Reset the OTP digits
      timerLabel.textContent = ""; // Clear the timer label
    }
  }, 1000);

  // Clear all elements after 25 seconds
  setTimeout(function() {
    qrimage.src = ""; // Clear the QR code
    imgbox.classList.remove("show-img"); // Hide the QR code container
    resetOTP(); // Reset the OTP digits
    timerLabel.textContent = ""; // Clear the timer label
  }, remainingSeconds * 1000);
}



 // whatsapp(name, phone, count, otp, selectedValue, given, link);

   /* function whatsapp(name, phone, count, otp, selectedValue, given, link) {
      var message =
        "Name: " +
        name +
        "\n" +
        "Phone: " +
        phone +
        "\n" +
        "Food Count: " +
        count +
        "\n" +
        "OTP: " +
        otp +
        "\n" +
        "Meal Type: " +
        selectedValue +
        "\n" +
        "Given: " +
        given;
    
      var url =
        "https://wa.me/+91" +
        phone +
        "?text=" +
        encodeURIComponent(message) +
        "%0aLink: " +
        encodeURIComponent(link);
    
      window.open(url, "_blank").focus();
    }*/
    