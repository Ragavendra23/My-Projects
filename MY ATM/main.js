// ------imports & configs ------

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey:  "AIzaSyAO7_BWKEUQLj_KGQPzCxpMCkIjCwAfRhI",
  authDomain: "my-atm-c3b78.firebaseapp.com",
  projectId:  "my-atm-c3b78",
  storageBucket: "my-atm-c3b78.appspot.com",
  messagingSenderId: "796490235474",
  appId: "1:796490235474:web:56333abfcb71b037fc298b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const dbref = ref(db);

window.onload = function () {
  document.getElementById('switchToReg').onclick = switchToReg;
  document.getElementById('switchToLogin').onclick = switchToLogin;
  document.getElementById('login-btn').onclick = loginValidation;
  document.getElementById('register-btn').onclick = registerValidation;

  // switch to register
  function switchToReg() {
    document.getElementById('register-portal').style.display = "inline-block";
    document.getElementById('login-portal').style.display = "none";
  }

  // switch to login
  function switchToLogin() {
    document.getElementById('register-portal').style.display = "none";
    document.getElementById('login-portal').style.display = "inline-block";
  }

                                                                                            //------- acc no and pin pattern------//
  var accNoPat = /^[0-9]{6}$/;
  var accPinPat = /^[0-9]{4}$/;

                                                                                            //----------login validation----------//
  function loginValidation() {
    var lAccNo = document.getElementById('lAccNo').value;
    var lAccPin = document.getElementById('lAccPin').value;
    if (lAccNo.match(accNoPat) && lAccPin.match(accPinPat)) {
      alert("Welcome");
      portal(lAccNo, lAccPin);
    } else {
      alert("Please Enter valid details");
    }
  }

                                                                                            //-----------register validation------------//
  function registerValidation() {
    var rAccName = document.getElementById('rAccName').value;
    var rAccNo = document.getElementById('rAccNo').value;
    var rAccPin = document.getElementById('rAccPin').value;
    var rConAccPin = document.getElementById('rConAccPin').value;
    if (rAccName !== null && rAccNo.match(accNoPat) && rAccPin.match(accPinPat) && rAccPin == rConAccPin) {

      set(ref(db, "accNo " + rAccNo + "/accPin " + rAccPin + "/accDetails"), {
        name: rAccName,
        avalBal: 0
      }).then(() => {
        alert("Registered");
      }).catch((error) => {
        alert("Registered Failed\n" + error);
      });

      set(ref(db, "accNo " + rAccNo + "/received"), {
        receivedAmt: 0
      }).then(() => {
        console.log("received amt updated");
      }).catch((error) => {
        alert("received amt updation Failed\n" + error);
      });
    } else {
      alert("Please enter a valid details");
    }
  }

                                                                                            //----------Portal----------//
  function portal(accNo, accPin) {
    document.getElementById('login-portal').style = "display:none";
    document.getElementById('register-portal').style = "display:none";
    document.getElementById('portal').style = "display:inline-block";

    var name, avalBal, totalBal, receivedAmt, msg;

                                                                                            //------- Getting data from Firebase-------//
    get(child(dbref, "accNo " + accNo + "/accPin " + accPin + "/accDetails")).then((snapshot) => {
      if (snapshot.exists()) {
        name = snapshot.val().name;
        avalBal = snapshot.val().avalBal;
        document.getElementById('userName').innerHTML = 'Hi ' + name;
      } else {
        alert("No data found in the database");
      }
    }).catch((error) => {
      alert("Error while getting data\n" + error);
    });

    get(child(dbref, "accNo " + accNo + "/received")).then((snapshot) => {
      if (snapshot.exists()) {
        receivedAmt = snapshot.val().receivedAmt;
        totalBal = avalBal + receivedAmt;
        msg = "Welcome, " + name;
        updateAvalBal(msg, totalBal);
        updateReceivedAmt();
      } else {
        alert("No received amount found in the database");
      }
    }).catch((error) => {
      alert("Error while getting data\n" + error);
    });

                                                                                            //-------- Update values in Firebase--------//
    function updateAvalBal(msg, totalBal) {
      update(ref(db, "accNo " + accNo + "/accPin " + accPin + "/accDetails"), {
        avalBal: totalBal
      }).then(() => {
        alert(msg);
        document.getElementById('totalBal').innerHTML = "TotalBal: " + totalBal;
      }).catch((error) => {
        alert("Error\n" + error);
      });
    }

    function updateReceivedAmt() {
      update(ref(db, "accNo " + accNo + "/received"), {
        receivedAmt: 0
      }).then(() => {
        console.log("Received amount updated");
      }).catch((error) => {
        alert("Error\n" + error);
      });
    }

                                                                                           //-----------------deposit------------------//

    document.getElementById('deposit-btn').addEventListener('click', deposit);


  function deposit(){
    document.getElementById('deposit-portal').style= "display:inline-block";
    document.getElementById('withdraw-portal').style= "display:none";
    document.getElementById('transfer-portal').style= "display:none";

    document.getElementById('dep-submit').addEventListener('click',function(){
      document.getElementById('deposit-btn').removeEventListener('click',deposit);
      var depositAmt = Number(document.getElementById('deposit-amt').value);
      if(depositAmt>=100){
        totalBal += depositAmt;
        document.getElementById('deposit-amt').value = '';
        msg = "Rs. "+depositAmt+" was successfully deposited";
        updateAvalBal(msg,totalBal);

      }else{
        alert('Minimum deposit amount Rs.100');
      }
    })
  }

                                                                                           //-----------------Withdraw------------------//

  document.getElementById('withdraw-btn').addEventListener('click', withdraw);
  function withdraw(){
    document.getElementById('deposit-portal').style= "display:none";
    document.getElementById('withdraw-portal').style= "display:inline-block";
    document.getElementById('transfer-portal').style= "display:none";

    document.getElementById('wit-submit').addEventListener('click',function(){
      document.getElementById('withdraw-btn').removeEventListener('click',withdraw);
      var withdrawAmt = Number(document.getElementById('withdraw-amt').value);
      if(withdrawAmt>=100){
        totalBal -= withdrawAmt;
        document.getElementById('withdraw-amt').value = '';
        msg = "Rs. "+withdrawAmt+" was successfully withdrawn";
        updateAvalBal(msg,totalBal);

      }else{
        alert('Minimum withdraw amount Rs.100');
      }
    });
  }


                                                                                            //-----------------transfer------------------//


document.getElementById('transfer-btn').addEventListener('click',transfer);
function transfer(){
  document.getElementById('deposit-portal').style= "display:none ";
  document.getElementById('withdraw-portal').style= "display:none";
  document.getElementById('transfer-portal').style= "display:inline-block";

  document.getElementById('trans-submit').addEventListener('click',function(){

    document.getElementById('transfer-btn').removeEventListener('click',transfer);

    var transAccNo = document.getElementById('transfer-acc-no').value;
    var transferAmt = Number(document.getElementById('transfer-amt').value);

    document.getElementById('transfer-acc-no').value = '';
    document.getElementById('transfer-amt').value = '';

    if(transAccNo.match(accNoPat) && transferAmt>=100){

      update(ref(db,"accNo "+transAccNo+"/received"),{
        receivedAmt: transferAmt
      }).then(()=>{
        totalBal -= transferAmt;
        document.getElementById('withdraw-amt').value = '';
        msg = "Rs. "+transferAmt+" was successfully transfer to "+transAccNo;
        updateAvalBal(msg,totalBal);
      }).catch((error)=>{
        alert('error\n'+error);
      });
    }else{
      alert('Minium withdraw amount Rs.100');
    }
  });
  }
}

}