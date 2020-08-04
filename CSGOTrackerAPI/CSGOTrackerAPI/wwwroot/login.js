const form = document.getElementById("form");
const usernameEl = document.getElementById("username");
const passwordEl = document.getElementById("password");
const loginUri = "api/authenticate/login";

async function login() {
  const username = usernameEl.value;
  const password = passwordEl.value;
  const loginQuery = { username: username, password: password };

  var loginResult = await fetch(loginUri, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(loginQuery),
  })
    .then((res) => res.json())
    .catch((error) => {
      console.error("Login failed.", error);
      showError();
    });

  if (loginResult.token !== undefined) {
    saveToken(loginResult.token);
  } else {
    showError();
  }
}

function saveToken(token) {
  // TODO: DON'T STORE TOKEN IN LOCALSTORAGE (XSS) !!!
  localStorage.setItem("token", token);
  location.replace("index.html");
}

function showError() {
  console.log("Login failed");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  login();
});
