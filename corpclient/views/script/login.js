// LOGIN (index.html)///////////////////////////////////////////////////////////
function login(loginUser) {
  fetch('http://localhost:3000', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loginusername: loginUser.loginusername.value, loginpassword: loginUser.loginpassword.value })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message === "Valid") {
        window.open('http://localhost:5000/main.html');
      }
      else {
        window.alert("Invalid credentials.")
      }
    });
  document.getElementById('login-form').reset();
  event.preventDefault();
};
///////////////////////////////////////////////////////////////////////////////
