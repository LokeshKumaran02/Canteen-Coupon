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
var accessDB = firebase.database().ref('credentials');

function validateNumericInput(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
  }
  document.getElementById('employee-id').addEventListener('input', function() {
    if (this.value.length !== 6 && this.value.length !== 7) {
      this.style.borderColor = 'red';
      this.style.borderWidth = '2px';
    
    } else {
      this.style.borderColor = 'green';
      this.style.borderWidth = '2px';
    }
  });
  document.getElementById('password').addEventListener('input', function() {
    if (this.value.length < 5) {
      this.style.borderColor = 'red';
      this.style.borderWidth = '2px';
    
    } else {
      this.style.borderColor = 'green';
      this.style.borderWidth = '2px';
    }
  });

  function validate() {
    var empid = document.getElementById('employee-id').value;
    var pwd = document.getElementById('password').value;
    var input = document.getElementById('employee-id');
  
    if (empid === "" && pwd === "") {
      showModal("Enter Employee ID and Password");
    }else{
      if (empid == "") {
        showModal("Employee ID is empty");
      }
      else if (empid.length !== 6 && empid.length !== 7) {
        showModal("Employee ID should be 6 or 7 digits");
        input.value = "";
      }
      else if (pwd == "") {
        showModal("Password field is empty");
      }
      else if (pwd.length < 5) {
        showModal("Password length should be greater than 5");
      }
      else if (empid !== "" && pwd !== "" && empid.length === 6 && pwd.length >= 5) {
        submitform(empid, pwd);
      }

    }
  
    function showModal(message) {
      var modal = document.getElementById('errorModal');
      var modalContent = document.getElementById('errorMessages');
      modalContent.textContent = message;
      modal.style.display = "block";
    }
  }
  document.querySelector('.close').addEventListener('click', function() {
    var modal = document.getElementById('errorModal');
    modal.style.display = "none";
  });
    
  
  function submitform(empid, pwd) {
    accessDB.once('value', function(snapshot) {
      var dataExists = false;
      snapshot.forEach(function(childSnapshot) {
        var DBdata = childSnapshot.val();
        var getempid = DBdata.empid;
        var getpwd = DBdata.pwd;
        var dept = DBdata.dept;
        var name = DBdata.ename;
        console.log("DBaccess");
        if (getempid === empid && getpwd === pwd) {
          dataExists = true;
          localStorage.setItem('admin_data', name);
          localStorage.setItem('data', dept);
          window.location.href = "couponportal.html";
          // if (dept === "Canteen") {
          //   localStorage.setItem('admin_data', name);
          //   window.location.href = "adminportal.html";
          // } else {
          //   localStorage.setItem('user_data', name);
          //   window.location.href = "userportal.html";
          // }
        }
      });
  
      if (!dataExists) {
        alert("Wrong username/password");
      }
    });
    
  }
  
  
