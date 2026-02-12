const boardElement = document.getElementById("board");
const statusText = document.getElementById("status");
const difficultySelect = document.getElementById("difficulty");

let board = Array(9).fill("");
let human = "X";
let ai = "O";
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

    board[index] = human;
    updateUI();

    if (checkGameState()) return;

    setTimeout(aiMove, 300);
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

    board[move] = ai;
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
            board[i] = ai;
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
                newBoard[i] = ai;
                best = Math.max(best, minimax(newBoard, depth + 1, false));
                newBoard[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === "") {
                newBoard[i] = human;
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
            return b[a] === ai ? 1 : -1;
        }
    }

    if (!b.includes("")) return 0;
    return null;
}

function checkGameState() {
    let result = evaluate(board);

    if (result === 1) {
        statusText.textContent = "AI Wins 🤖";
        gameOver = true;
        return true;
    } else if (result === -1) {
        statusText.textContent = "You Win 🎉";
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
}

createBoard();