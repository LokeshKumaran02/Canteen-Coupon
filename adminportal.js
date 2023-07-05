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
  var userdetails = firebase.database().ref('userdetails');
  var accessdetails = firebase.database().ref('accessdetails');
  var authoriser = localStorage.getItem('admin_data');
  document.getElementById('name-label').textContent =authoriser;
  function validateStringInput(input) {
    input.value = input.value.replace(/[^a-zA-Z. ]/g, '');
}
function validateNumericInput(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
  }
  function logout() {  
    // Redirect to the login page
    window.location.href = "index.html"; 
  }
  
  //----------------------------TOKEN VERIFICATION STARTS------------------------------------//
var currentDate = new Date();
var year = currentDate.getFullYear();
var month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
var day = currentDate.getDate();
var hours = currentDate.getHours();
var minutes = currentDate.getMinutes();
var seconds = currentDate.getSeconds();
var formattedDate = year + '-' + month + '-' + day;
var formattedTime = hours + ':' + minutes + ':' + seconds;

var formattedTime = '';

function TVaddTableRow(name, phone, otp, count, authority, verify,date, time,dept) {
  var tbody = document.getElementById('TVbody');
  var newRow = tbody.insertRow();
  newRow.innerHTML = `<td>${date|| '-'}</td><td>${dept}</td><td>${name}</td><td>${phone}</td><td>${otp}</td><td>${count}</td><td>${authority||'-'}</td><td>
    <label class="toggle-container">
      <input type="checkbox" data-name="${name}" data-phone="${phone}" data-otp="${otp}" data-count="${count}" ${verify === 'verified' ? 'checked' : ''}>
      <span class="toggle-switch"></span>
    </label>
  </td><td>${time|| '-'}</td>`;

  // Get the checkbox within the newly inserted row
  var checkbox = newRow.querySelector('input[type="checkbox"]');
  var timeColumn = newRow.querySelector('td:last-child');

  // Add event listener to the checkbox input
  checkbox.addEventListener('change', function () {
    var name = this.dataset.name;
    var phone = this.dataset.phone;
    var otp = this.dataset.otp;
    var count = this.dataset.count;

    // Check if all the necessary data is defined
    if (name && phone && otp && count) {
      var verify = this.checked ? 'verified' : 'not-verified';
      var time = this.checked ? getTime() : '';

      // Update the time column
      timeColumn.textContent = time;

      // Save the verification status and time in Firebase
      TVsaveVerificationStatus(name, phone, otp, count, verify,date, time);
    } else {
      console.error('Some data is missing for the verification status.');
    }
  });
}
function TVsaveVerificationStatus(name, phone, otp, count, verify, date,time) {
  var query = userdetails.orderByChild('name').equalTo(name);

  query.once('value')
    .then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var childKey = childSnapshot.key;
        // Update the "verify" and "time" fields
        userdetails.child(childKey).update({ verify: verify, time: time });
      });
    })
    .catch(function (error) {
      console.error(error);
    });
}
function getTime() {
  var currentDate = new Date();
  var hours = currentDate.getHours();
  var minutes = currentDate.getMinutes();
  var seconds = currentDate.getSeconds();
  return hours + ':' + minutes + ':' + seconds;
}

function TVgetAndDisplayData() {
  userdetails.once('value')
    .then(function (snapshot) {
      var data = [];
      var deptdata = [];
      var formattedData = [];
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        var name = childData.name;
        var dept = childData.unit;
        var phone = childData.phone;
        var otp = childData.otp;
        var count = childData.count;
        var authority = childData.authorised_by;
        var verify = childData.verify;
        var time = childData.time;
        var date = childData.date;
        console.log("date",date);
        var SplitParameter=[];
        SplitParameter=date.split("-");
        console.log("date.split",SplitParameter[0]+"," + SplitParameter[1]+","+ SplitParameter[2]);
        var sdate=new Date(SplitParameter[0]+"," + SplitParameter[1]+","+ SplitParameter[2]);
        console.log(sdate);
        const splitteddate = new Date(sdate);
        const day = splitteddate.getDate();
        const month = splitteddate.getMonth() + 1; // Months are zero-based, so we add 1
        const year = splitteddate.getFullYear().toString().slice(-2);
        const convertedFormat = `${day}-${month}-${year}`;
          data.push({
          authority: authority,
          count: count
        });
        deptdata.push({
         dept:convertedFormat, 
         indexLabel:count
        });
        TVaddTableRow(name, phone, otp, count, authority, verify,convertedFormat, time,dept);
      }); 

      $('#TVtable').DataTable({
        searching: true
      });
      plotGraph(data);
     deptplotGraph(deptdata);
    })
   
    .catch(function (error) {
      console.error(error);
    });

}



    // for (var date in dateWiseData) {
    //   if (dateWiseData.hasOwnProperty(date)) {
    //     dataPoints.push({ x: date, y: dateWiseData[date] });
    //   }
    // }
  

function groupDataByAuthority(data) {
  var groupedData = {};

  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    var authority = item.authority;

    if (!groupedData[authority]) {
      groupedData[authority] = 0;
    }

    groupedData[authority]++;
  }

  return groupedData;
}
function groupDataBydept(deptdata) {
  var groupeddeptData = {};

  for (var i = 0; i < deptdata.length; i++) {
    var item = deptdata[i];
    var dept = item.dept;

    if (!groupeddeptData[dept]) {
      groupeddeptData[dept] = 0;
    }

    groupeddeptData[dept]++;
  }

  return groupeddeptData;
}
function plotGraph(data) {
  var groupedData = groupDataByAuthority(data);
  var dataPoints = [];

  for (var authority in groupedData) {
    if (groupedData.hasOwnProperty(authority)) {
      if(authority!="undefined"){
        dataPoints.push({ label: authority, y: groupedData[authority] });
      }
    }
  }

  var chart = new CanvasJS.Chart("chartContainer", {
    theme: "light2",
    animationEnabled: true,
    title: {
      text: "Authority vs. Number of times token generated"
    },
    axisX: {
      interval: 1
    },
    data: [
      {
          indexLabelPlacement: "outside",
          type: "column",
          dataPoints: dataPoints.map(dataPoint => ({
              label: dataPoint.label,
              y: dataPoint.y,
              indexLabel: dataPoint.y.toString() // Display the count value as the index label
          }))
      }
  ]
});


  chart.render();
}
function deptplotGraph(deptdata) {
  var groupedData = groupDataBydept(deptdata);
  var dataPoints = [];

  for (var dept in groupedData) {
    if (groupedData.hasOwnProperty(dept)) {
      dataPoints.push({ label: dept, y: groupedData[dept] });
    }
  }
  var chart = new CanvasJS.Chart("deptchartContainer", {
    theme: "light2",
    animationEnabled: true,
    title: {
      text: "Date wise Token Count"
    },
    axisX: {
      interval: 1
    },
   data: [
        {
            indexLabelPlacement: "outside", 
            type: "line",
            dataPoints: dataPoints.map(dataPoint => ({
                label: dataPoint.label,
                y: dataPoint.y,
                indexLabel: dataPoint.y.toString()
            }))
        }
    ]
});

  chart.render();
}


// Call the function to retrieve and display data from Firebase
//TVgetAndDisplayData();

  function TVfilterTable() {
    var input = document.getElementById('TVinput');
    var filter = input.value.toLowerCase();
    var table = document.getElementById('TVtable');
    var rows = table.getElementsByTagName('tr');
  
    for (var i = 1; i < rows.length; i++) {
      var name = rows[i].getElementsByTagName('td')[0].textContent.toLowerCase();
      var phone = rows[i].getElementsByTagName('td')[1].textContent.toLowerCase();
      var otp = rows[i].getElementsByTagName('td')[2].textContent.toLowerCase();
      var count = rows[i].getElementsByTagName('td')[3].textContent.toLowerCase();
     // var charge = rows[i].getElementsByTagName('td')[4].textContent.toLowerCase();
  
      if (name.indexOf(filter) > -1 || phone.indexOf(filter) > -1 || otp.indexOf(filter) > -1 ||  count.indexOf(filter) > -1) {
        rows[i].style.display = '';
      } else {
        rows[i].style.display = 'none';
      }
    }
  }

  window.onload = TVgetAndDisplayData();

  //document.getElementById('TVinput').addEventListener('input', TVfilterTable);

  
  //----------------------------TOKEN VERIFICATION ENDS------------------------------------//


  //----------------------------GIVE ACCESS STARTS-----------------------------------------//


// Function to add data to the table
function GAaddTableRow(empid, ename, dept, verify) {
  var tbody = document.getElementById('GAbody');
  var newRow = tbody.insertRow();
  newRow.innerHTML = `<td>${empid}</td><td>${ename}</td><td>${dept}</td><td>
    <label class="toggle-container">
      <input type="checkbox" data-id="${empid}" data-name="${ename}" data-dept="${dept}"  ${verify === 'verified' ? 'checked' : ''}>
      <span class="toggle-switch"></span>
    </label>
  </td>`;

  // Get the checkbox within the newly inserted row
  var checkbox1 = newRow.querySelector('input[type="checkbox"]');

  // Add event listener to the checkbox input
  checkbox1.addEventListener('change', function() {
    var id = this.dataset.empid;
    var name = this.dataset.ename;
    var dept = this.dataset.dept;
    var pwd = empid;
    console.log(empid,ename,dept);
    console.log('chkpt0');
    // Check if all the necessary data is defined
    if (ename && empid && dept ) {
      var verify = this.checked ? 'verified' : 'not-verified';

      // Save the verification status in Firebase
      GAsaveVerificationStatus(empid, ename, dept,verify);
      console.log('chkpt1');
    } else {
      console.error('Some data is missing for the verification status.');
    }
  });
}

// Function to save the verification status in Firebase
function GAsaveVerificationStatus(empid, ename, dept, verify) {
  var GAquery = accessdetails.orderByChild('ename').equalTo(ename);

  GAquery.once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;

        // Update the "verify" and "access" fields
        accessdetails.child(childKey).update({ verify: verify });
      });
    })
    .catch(function(error) {
      console.error(error);
    });
    firebase.database().ref('credentials/' + empid).set({
      empid: empid,
      ename: ename,
      dept: dept,
      pwd: empid,
    })
    .then(function() {
      //alert("Access Granted");
     // checkbox.style.backgroundColor = 'green';
      //console.log("Data saved to 'credentials' collection:", empid, ename, dept);
    })
}

// Function to retrieve and display data
function GAgetAndDisplayData() {
  accessdetails.once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        var empid = childData.empid;
        var ename = childData.ename;
        var dept = childData.dept;
        var pwd = empid;
        var verify = childData.verify;

        GAaddTableRow(empid, ename, dept, verify);
      });
      $('#GAtable').DataTable({
        searching: true
      });
    })

    .catch(function(error) {
      console.error(error);
    });

}

// Function to filter and display rows based on search input
function GAfilterTable() {
  var input = document.getElementById('GAinput');
  var filter = input.value.toLowerCase();
  var table = document.getElementById('GAtable');
  var rows = table.getElementsByTagName('tr');

  for (var i = 1; i < rows.length; i++) {
    var empid = rows[i].getElementsByTagName('td')[0].textContent.toLowerCase();
    var ename = rows[i].getElementsByTagName('td')[1].textContent.toLowerCase();
    var dept = rows[i].getElementsByTagName('td')[2].textContent.toLowerCase();
    //var verify = rows[i].getElementsByTagName('td')[3].textContent.toLowerCase();

    if (empid.indexOf(filter) > -1 || ename.indexOf(filter) > -1 || dept.indexOf(filter) > -1) {
      rows[i].style.display = '';
    } else {
      rows[i].style.display = 'none';
    }
  }
}

// Call the function to retrieve and display data on window load
window.onload = GAgetAndDisplayData();

// Add event listener to search input for filtering
document.getElementById('GAinput').addEventListener('input', GAfilterTable);


  //----------------------------GIVE ACCESS ENDS-----------------------------------------//
 //--------------------------TOKEN GENERATION STARTS--------------------------------------------//
 // Get the current date and time
var currentDate = new Date();

// Get the individual components of the date and time
var year = currentDate.getFullYear();
var month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
var day = currentDate.getDate();
var hours = currentDate.getHours();
var minutes = currentDate.getMinutes();
var seconds = currentDate.getSeconds();
var formattedDate = year + '-' + month + '-' + day;
var formattedTime = hours + ':' + minutes + ':' + seconds;
 var otpGenerated = false; 
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


     //--------------------------TOKEN GENERATION ENDS--------------------------------------------//
  
     var data = localStorage.getItem('admin_data');
     //document.getElementById('name-label').textContent = data;
     console.log(data);
           












   