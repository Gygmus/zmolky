let players = [];
let currentPlayerIndex = 0;
let winners = [];
let gameFinished = false;

function addPlayer() {
    const playerName = document.getElementById("playerName").value;
    if (playerName.trim() !== "") {
        players.push({ name: playerName, score: 0, zeroCount: 0, isEliminated: false });
        document.getElementById("playerName").value = "";
        updateScoreboard();
    }
}

function startGame() {
    if (players.length < 2) {
        alert("Přidejte alespoň dva hráče, abyste mohli začít hru.");
        return;
    }
    document.getElementById("playerName").style.display = "none";
    document.getElementById("addPlayerBtn").style.display = "none";
    document.getElementById("startGameBtn").style.display = "none";
    document.getElementById("scoreInput").style.display = "block";
}

function updateScoreboard() {
    const tbody = document.querySelector("#scoreTable tbody");
    tbody.innerHTML = "";
    players.forEach((player, index) => {
        const row = document.createElement("tr");
        if (index === currentPlayerIndex && !gameFinished) {
            row.classList.add("current-player");
        }
        if (player.isEliminated) {
            row.classList.add("eliminated-player");
        }
        if (winners.includes(player)) {
            row.classList.add("winner-player");
        }
        const nameCell = document.createElement("td");
        nameCell.textContent = getMedal(player) + player.name + " " + "✖️".repeat(player.zeroCount);
        const scoreCell = document.createElement("td");
        scoreCell.textContent = player.score;
        row.appendChild(nameCell);
        row.appendChild(scoreCell);
        tbody.appendChild(row);
    });
}

function getMedal(player) {
    const index = winners.indexOf(player);
    if (index === 0) return "🥇 ";
    if (index === 1) return "🥈 ";
    if (index === 2) return "🥉 ";
    return "";
}

function addScore(points) {
    if (gameFinished) return;
    if (players[currentPlayerIndex].isEliminated || winners.includes(players[currentPlayerIndex])) {
        nextPlayer();
        return;
    }
    if (points === 0) {
        players[currentPlayerIndex].zeroCount++;
        if (players[currentPlayerIndex].zeroCount === 3) {
            players[currentPlayerIndex].isEliminated = true;
        }
    } else {
        players[currentPlayerIndex].zeroCount = 0;
        players[currentPlayerIndex].score += points;
        if (players[currentPlayerIndex].score > 50) {
            players[currentPlayerIndex].score = 25;
        } else if (players[currentPlayerIndex].score === 50) {
            winners.push(players[currentPlayerIndex]);
            if (winners.length === 2) {
                const remainingPlayer = players.find(player => !winners.includes(player) && !player.isEliminated);
                if (remainingPlayer) {
                    winners.push(remainingPlayer);
                }
                gameFinished = true;
                document.getElementById("scoreInput").style.display = "none";
            } else if (winners.length === 3 || winners.length === players.length - 1) {
                gameFinished = true;
                document.getElementById("scoreInput").style.display = "none";
            }
        }
    }
    updateScoreboard();
    nextPlayer();
}

function nextPlayer() {
    if (gameFinished) return;
    do {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    } while (players[currentPlayerIndex].isEliminated || winners.includes(players[currentPlayerIndex]));
    updateScoreboard();
}
