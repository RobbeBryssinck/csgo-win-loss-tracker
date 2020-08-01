const form = document.getElementById("form");
const rankEl = document.getElementById("rank");
const winEl = document.getElementById("win");
const tieEL = document.getElementById("tie");
const lossEl = document.getElementById("loss");
const results = document.getElementById("results");
const resultsContainer = document.getElementById("results-container");
const resetForm = document.getElementById("reset-form");
const resultsTable = document.getElementById("results-table");
const rankSelect = document.getElementById("rank");

var rankList = {
  silver1: "Silver 1",
  silver2: "Silver 2",
  silver3: "Silver 3",
  silver4: "Silver 4",
  silverelite: "Silver Elite",
  silverelitemaster: "Silver Elite Master",
  goldnova1: "Gold Nova 1",
  goldnova2: "Gold Nova 2",
  goldnova3: "Gold Nova 3",
  goldnovamaster: "Gold Nova Master",
  masterguardian1: "Master Guardian 1",
  masterguardian2: "Master Guardian 2",
  masterguardianelite: "Master Guardian Elite",
  distinguishedmasterguardian: "Distinguished Master Guardian",
  legendaryeagle: "Legendary Eagle",
  legendaryeaglemaster: "Legendary Eagle Master",
  suprememasterfirstclass: "Supreme Master First Class",
  globalelite: "Global Elite",
};

populateUI();

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

  let games = JSON.parse(localStorage.getItem("Games"));

  if (games == null) {
    games = [];
  }

  const rank = rankEl.value;

  let winloss;
  if (winEl.checked) {
    winloss = winEl.value;
  } else if (lossEl.checked) {
    winloss = lossEl.value;
  } else if (tieEL.checked) {
    winloss = tieEL.value;
  }
  const game = [rankList[rank], winloss];
  games.push(game);

  localStorage.setItem("Games", JSON.stringify(games));
}

// Check whether either the win or the loss radio button is selected
function isWinLossSelected() {
  return winEl.checked || lossEl.checked || tieEL.checked;
}

// TODO: Throw this function away
function checkLocalStorage() {
  const games = JSON.parse(localStorage.getItem("Games"));

  games.forEach((element) => element.forEach((el) => console.log(el)));
}

// Get data and populate UI
function populateUI() {
  resultsTable.innerHTML = "<tr><th>Rank</th><th>Win/Loss?</th></tr>";

  const data = JSON.parse(localStorage.getItem("Games"));

  if (data == null) {
    return;
  }

  data.forEach((item) => {
    const element = document.createElement("tr");
    element.innerHTML = `<td>${item[0]}</td><td>${item[1]}</td>`;
    resultsTable.appendChild(element);
  });

  const rankIndex = localStorage.getItem("RankIndex");
  if (rankIndex !== null) {
    rankSelect.selectedIndex = rankIndex;
  }
}

// Reset the results table
function resetResultsTable() {
  resultsTable.innerHTML = "<tr><th>Rank</th><th>Win/Loss?</th></tr>";
  localStorage.removeItem("Games");
}

// Update rank so that the selection box remembers the user's rank
function updateRank(rankIndex) {
  localStorage.setItem("RankIndex", rankIndex);
}

// Event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();
  resetError(winEl);

  submitWinLoss();

  populateUI();
});

resetForm.addEventListener("submit", (e) => {
  e.preventDefault();

  resetResultsTable();
});

rankSelect.addEventListener("change", (e) => {
  updateRank(e.target.selectedIndex);
});
