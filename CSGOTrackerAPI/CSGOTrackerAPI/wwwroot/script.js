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
const uri = "api/Games";

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
async function submitWinLoss() {
  if (!isWinLossSelected()) {
    showError(winEl, "You need to select either win or loss.");
    return;
  }

  var games = await fetch(uri)
    .then((res) => res.json())
    .catch((error) => console.error("Unable to get items.", error));

  if (games === null) {
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
  const game = { id: generateID(), rank: rankList[rank], winloss: winloss };

  var response = await fetch(uri, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(game),
  })
    .then((res) => res.json())
    .then(() => populateUI())
    .catch((error) => console.error("Unable to add item.", error));

  console.log(response);

  winEl.checked = false;
  lossEl.checked = false;
  tieEL.checked = false;
}

// Check whether either the win or the loss radio button is selected
function isWinLossSelected() {
  return winEl.checked || lossEl.checked || tieEL.checked;
}

// Generate a unique ID for the match
function generateID() {
  return Math.floor(Math.random() * 1000000);
}

// Get data and populate UI
async function populateUI() {
  resultsTable.innerHTML =
    "<tr><th>Rank</th><th>Win/Loss?</th><th>Delete</th></tr>";

  var games = await fetch(uri)
    .then((res) => res.json())
    .catch((error) => console.error("Unable to get items.", error));

  if (games === null || games.length === 0) {
    localStorage.removeItem("RankIndex");
    return;
  }

  games.forEach((item) => {
    const element = document.createElement("tr");
    element.innerHTML = `<td>${item.rank}</td><td>${item.winLoss}</td><td><button class="delete-btn" onClick="deleteGame(${item.id})">X</button></td>`;
    resultsTable.appendChild(element);
  });

  const rankIndex = localStorage.getItem("RankIndex");
  if (rankIndex !== null) {
    rankSelect.selectedIndex = rankIndex;
  }
}

// Reset the results table
async function resetResultsTable() {
  var games = await fetch(uri)
    .then((res) => res.json())
    .catch((error) => console.error("Unable to get items.", error));

  games.forEach((game) => {
    deleteGame(game.id);
  });

  resultsTable.innerHTML =
    "<tr><th>Rank</th><th>Win/Loss?</th><th>Delete</th></tr>";

  localStorage.removeItem("RankIndex");
}

// Update rank so that the selection box remembers the user's rank
function updateRank(rankIndex) {
  localStorage.setItem("RankIndex", rankIndex);
}

// Deletes a game from storage
async function deleteGame(id) {
  await fetch(`${uri}/${id}`, {
    method: "DELETE",
  })
    .then(() => populateUI())
    .catch((error) => console.error("Unable to delete item.", error));
}

// Event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();

  resetError(winEl);
  submitWinLoss();
});

resetForm.addEventListener("submit", (e) => {
  e.preventDefault();

  resetResultsTable();
});

rankSelect.addEventListener("change", (e) => {
  updateRank(e.target.selectedIndex);
});
