  window.onload = function(){
  document.getElementById('switchToReg').onclick=switchToReg;
  document.getElementById('switchToLogin').onclick=switchToLogin;


function switchToReg(){
    document.getElementById('register-Portal').style = "display:inline-block";
    document.getElementById('Login-Portal').style = "display:none";
}

function switchToLogin(){
    document.getElementById('register-Portal').style = "display:none";
    document.getElementById('Login-Portal').style = "display:inline-block";
  }
}
