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
const logoutBtn = document.getElementById("logout-btn");
const uriGames = "api/Games";
const uriRanks = "api/Ranks";

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

var loginToken = "Bearer " + localStorage.getItem("token");

startup();

function startup() {
  // TODO: make this an actual authorization check
  const token = localStorage.getItem("token");

  populateUI();
}

function logout() {
  localStorage.removeItem("token");
  redirectToLogin();
}

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

  const rank = rankEl.value;

  let winloss;
  if (winEl.checked) {
    winloss = winEl.value;
  } else if (lossEl.checked) {
    winloss = lossEl.value;
  } else if (tieEL.checked) {
    winloss = tieEL.value;
  }
  const game = { rank: rankList[rank], winloss: winloss };

  await fetch(uriGames, {
    method: "POST",
    headers: {
      Authorization: loginToken,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(game),
  })
    .then(() => populateUI())
    .catch((error) => {
      console.error("Unable to add item.", error);
      redirectToLogin();
    });

  winEl.checked = false;
  lossEl.checked = false;
  tieEL.checked = false;
}

// Check whether either the win or the loss radio button is selected
function isWinLossSelected() {
  return winEl.checked || lossEl.checked || tieEL.checked;
}

// Get data and populate UI
async function populateUI() {
  resultsTable.innerHTML =
    "<tr><th>Rank</th><th>Win/Loss?</th><th>Delete</th></tr>";

  var games = await fetch(uriGames, {
    headers: {
      Authorization: loginToken,
    },
  })
    .then((res) => res.json())
    .catch((error) => {
      console.error("Unable to get items.", error);
      redirectToLogin();
    });

  if (games === null || games.length === 0) {
    updateRank(0);
    return;
  }

  games.forEach((item) => {
    const element = document.createElement("tr");
    element.innerHTML = `<td>${item.rank}</td><td>${item.winLoss}</td><td><button class="delete-btn" onClick="deleteGame(${item.id})">X</button></td>`;
    resultsTable.appendChild(element);
  });

  const rankIndex = await fetch(`${uriRanks}/1`, {
    headers: {
      Authorization: loginToken,
    },
  })
    .then((res) => res.json())
    .catch((error) => {
      console.error("Unable to get rank.", error);
      redirectToLogin();
    });

  if (rankIndex !== null) {
    rankSelect.selectedIndex = rankIndex.rankIndex;
  }
}

// Reset the results table
async function resetResultsTable() {
  var games = await fetch(uriGames, {
    headers: {
      Authorization: loginToken,
    },
  })
    .then((res) => res.json())
    .catch((error) => {
      console.error("Unable to get items.", error);
      redirectToLogin();
    });

  games.forEach((game) => {
    deleteGame(game.id);
  });

  // TODO: could be unnecessary since you called populateUI() already
  resultsTable.innerHTML =
    "<tr><th>Rank</th><th>Win/Loss?</th><th>Delete</th></tr>";

  updateRank(0);
}

// Update rank so that the selection box remembers the user's rank
async function updateRank(rankIndex) {
  const newRank = { id: 1, rankIndex: rankIndex };
  await fetch(`${uriRanks}/1`, {
    method: "PUT",
    headers: {
      Authorization: loginToken,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newRank),
  }).catch((error) => {
    console.error("Unable to update rank.", error);
    redirectToLogin();
  });
}

// Deletes a game from storage
async function deleteGame(id) {
  await fetch(`${uriGames}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: loginToken,
    },
  })
    .then(() => populateUI())
    .catch((error) => {
      console.error("Unable to delete item.", error);
      redirectToLogin();
    });
}

// Redirect to login
function redirectToLogin() {
  location.replace("login.html");
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

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  logout();
});
