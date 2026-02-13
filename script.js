const boardElement = document.getElementById("board");
const statusText = document.getElementById("status");
const difficultySelect = document.getElementById("difficulty");

let twoPlayer = false; // Flag for two-player mode
let change = false; // false = human starts, true = AI starts
let board = Array(9).fill("");
let Player1 = "X";
let Player2 = "O";
let gameOver = false;

// Initialize board UI
function createBoard() {
    boardElement.innerHTML = "";
    board.forEach((_, index) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", () => makeMove(index));
        boardElement.appendChild(cell);
    });
}

function makeMove(index) {
    if (board[index] !== "" || gameOver) return;

    board[index] = Player1;
    updateUI();

    if (checkGameState()) return;


    if (twoPlayer) {
        [Player1, Player2] = [Player2, Player1]; // Swap players
        statusText.textContent = `${Player1}'s Turn`;
        makeMove(index); // Allow next player to move
    }
    else {
        setTimeout(aiMove, 300);
    }
    
}

function aiMove() {
    let difficulty = difficultySelect.value;
    let move;

    if (difficulty === "easy") {
        move = randomMove();
    } else if (difficulty === "medium") {
        move = Math.random() < 0.5 ? randomMove() : bestMove();
    } else {
        move = bestMove();
    }

    board[move] = Player2;
    updateUI();
    checkGameState();
}

function randomMove() {
    let empty = board
        .map((v, i) => v === "" ? i : null)
        .filter(v => v !== null);

    return empty[Math.floor(Math.random() * empty.length)];
}

function bestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = Player2;
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(newBoard, depth, isMaximizing) {
    let result = evaluate(newBoard);
    if (result !== null) return result;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === "") {
                newBoard[i] = Player2;
                best = Math.max(best, minimax(newBoard, depth + 1, false));
                newBoard[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === "") {
                newBoard[i] = Player1;
                best = Math.min(best, minimax(newBoard, depth + 1, true));
                newBoard[i] = "";
            }
        }
        return best;
    }
}

function evaluate(b) {
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    for (let pattern of winPatterns) {
        let [a,b1,c] = pattern;
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
            return b[a] === Player2 ? 1 : -1;
        }
    }

    if (!b.includes("")) return 0;
    return null;
}

function checkGameState() {
    let result = evaluate(board);

    if (result === 1) {
        if (twoPlayer) {
            statusText.textContent = "Player 2 Wins 🎉";
        }
        else {
            statusText.textContent = "AI Wins 🤖";
        }
        gameOver = true;
        return true;
    } else if (result === -1) {
        if (twoPlayer) {
            statusText.textContent = "Player 1 Wins 🎉";
        }
        else {
            statusText.textContent = "You Win 🎉";
        }
        gameOver = true;
        return true;
    } else if (result === 0) {
        statusText.textContent = "It's a Tie!";
        gameOver = true;
        return true;
    }

    return false;
}

function updateUI() {
    document.querySelectorAll(".cell").forEach((cell, index) => {
        cell.textContent = board[index];
        if (board[index] !== "") {
            cell.classList.add("taken");
        }
    });
}

function restartGame() {
    board = Array(9).fill("");
    gameOver = false;
    statusText.textContent = "";
    createBoard();

    if (change) {
        setTimeout(aiMove, 300); // AI starts
    }
}

function changePlayer() {
    Player1 = Player1 === "X" ? "O" : "X";
    Player2 = Player2 === "X" ? "O" : "X";

    if (!twoPlayer) {
        change = !change;
    }
    restartGame();
}

function twoPlayerMode() {
    Player1 = "X";
    Player2 = "O";
    twoPlayer = true;
    restartGame();
}

createBoard();
if (change){
    setTimeout(aiMove, 300); // AI starts when page loads
}