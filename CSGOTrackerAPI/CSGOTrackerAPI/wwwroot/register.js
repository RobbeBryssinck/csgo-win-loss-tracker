const form = document.getElementById("form-register");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");
const uri = "api/Authenticate";

// Show input error message
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = "form-control error";
  const small = formControl.querySelector("small");
  small.innerText = message;
}

// Show success outline
function showSucces(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}

// Check email is valid
function checkEmail(input) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(input.value.trim())) {
    showSucces(input);
    return true;
  } else {
    showError(input, "Email is not valid");
    return false;
  }
}

// Check passwords match
function checkPasswordsMatch(input1, input2) {
  if (input1.value !== input2.value) {
    showError(input2, "Passwords do not match");
    return false;
  } else {
    return true;
  }
}

// Get fieldname
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// Check required fields
function checkRequired(inputArray) {
  var requiredChecked = true;
  inputArray.forEach(function (input) {
    if (input.value.trim() === "") {
      showError(input, `${getFieldName(input)} is required`);
      requiredChecked = false;
    } else {
      showSucces(input);
    }
  });
  return requiredChecked;
}

// Check input length
function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} must be at least ${min} characters.`
    );
    return false;
  } else if (input.value.length > max) {
    showError(
      input,
      `${getFieldName(input)} must be less than ${max} characters.`
    );
    return false;
  } else {
    showSucces(input);
    return true;
  }
}

// Checks all fields
function areAllFieldsCorrect() {
  return (
    checkRequired([username, email, password, password2]) &
    checkLength(username, 3, 15) &
    checkLength(password, 6, 25) &
    checkLength(password2, 6, 25) &
    checkEmail(email) &
    checkPasswordsMatch(password, password2)
  );
}

// Submits the register data to the back end
async function submitForms() {
  const body = {
    Username: username.value,
    Email: email.value,
    Password: password.value,
  };

  const submitResults = await fetch(`${uri}/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  }).catch((error) => console.error("Submitting forms failed.", error));

  if (submitResults.status == 200) {
    console.log("Creation successful!");
    login();
  } else {
    console.log("Creation failed!");
  }
}

async function login() {
  const body = {
    Username: username.value,
    Password: password.value,
  };

  var loginResult = await fetch(`${uri}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((error) => {
      console.error("Login failed.", error);
    });

  if (loginResult.token !== undefined) {
    localStorage.setItem("token", loginResult.token);
    location.replace("index.html");
  }
}

// Event listeners
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (areAllFieldsCorrect()) {
    submitForms();
  }
});
