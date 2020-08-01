const form = document.getElementById("form");
const rankEl = document.getElementById("rank");
const winEl = document.getElementById("win");
const lossEl = document.getElementById("loss");

// Show input error message
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = "form-control error";
  const small = formControl.querySelector("small");
  small.innerText = message;
}

// Reset error messages
function resetError(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control";
}

// Submit the win or the loss
function submitWinLoss() {
  if (!isWinLossSelected()) {
    showError(winEl, "You need to select either win or loss.");
    return;
  }

  resetError(winEl);

  let games = JSON.parse(localStorage.getItem("Games"));

  if (games == null) {
    games = [];
  }

  const rank = rankEl.value;
  const winloss = winEl.checked ? winEl.value : lossEl.value;
  const game = [rank, winloss];
  games.push(game);

  localStorage.setItem("Games", JSON.stringify(games));
}

// Check whether either the win or the loss radio button is selected
function isWinLossSelected() {
  return winEl.checked || lossEl.checked;
}

// TODO: Throw this function away
function checkLocalStorage() {
  const games = JSON.parse(localStorage.getItem("Games"));

  games.forEach((element) => element.forEach((el) => console.log(el)));
}

// Get data and populate UI
function populateUI() {}

// Event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();

  submitWinLoss();
});
