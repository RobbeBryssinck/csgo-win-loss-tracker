const form = document.getElementById("form");
const usernameEl = document.getElementById("username");
const passwordEl = document.getElementById("password");
const loginUri = "api/authenticate/login";

async function login() {
  const username = usernameEl.value;
  const password = passwordEl.value;
  const loginQuery = { username: username, password: password };

  const loginResult = await fetch(loginUri, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(loginQuery),
  })
    .then((res) => res.json())
    .then((res) => saveToken(res))
    .catch((error) => console.error("Login failed.", error));
}

function saveToken(loginResult) {
  // TODO: DON'T STORE TOKEN IN LOCALSTORAGE (XSS) !!!
  localStorage.setItem("token", loginResult.token);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  login();
});
