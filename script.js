const gameBoard = (() => {
    let board = Array(9).fill(null);
    const getBoard = () => { return board }
    const clearBoard = () => { board = Array(9).fill(null) }
    const add = (mark, idx) => {
        let grid = document.querySelectorAll(`[data-idx="${idx}"]`)[0];
        grid.classList.add("taken");
        grid.textContent = mark;
        if (!board[idx]) {
            board.splice(idx, 1, mark);
            if (gameController.shouldContinueGame()) {
                gameController.nextTurn();
            }
        }
    };
    return { add, getBoard, clearBoard };
})();

const gameController = (() => {
    let turn = null;
    let round = 0;
    const setName = () => {
        const span = document.getElementById("turn");
        span.textContent = turn.getPlayerName();
    }
    const processTurn = () => {
        setName();
        round++;
        if (turn.getPlayerIsAi()) {
            playForAi();
        }
    }
    const nextTurn = () => {
        turn = turn == player1 ? player2 : player1;
        processTurn();
    }
    const playForAi = () => {
        const grid = document.getElementsByClassName("grid")[0];
        grid.classList.toggle("ai-is-playing");
        const dim = document.getElementsByClassName("ai-playing-modal")[0];
        dim.classList.toggle("hide");
        let idx = [],
            board = gameBoard.getBoard();
        for (let i = 0; i < board.length; i++)
            if (board[i] === null)
                idx.push(i);
        setTimeout(() => {
            const random = idx[Math.floor(Math.random() * idx.length)];
            gameBoard.add(getTurn().getPlayerMark(), random);
            grid.classList.toggle("ai-is-playing");
            dim.classList.toggle("hide");
        }, 1500);
    }
    const setTurn = (player) => {
        turn = player;
        processTurn();
    };
    const getTurn = () => { return turn };
    const checkLine = (arr) => {
        let countX = 0;
        let countO = 0;
        arr.forEach(grid => { if (grid == "X") { countX++ } else if (grid == "O") { countO++ } });
        if (countX == 3 || countO == 3) {
            return true;
        }
        return false;
    }
    const stopGame = () => {
        turn = null;
        const label = document.getElementsByClassName("turn-label")[0];
        label.classList.toggle("hide");
        return false;
    }
    const shouldContinueGame = () => {
        let board = gameBoard.getBoard();
        if (round > 4) {
            if (checkLine([board[0], board[1], board[2]]) ||
                checkLine([board[3], board[4], board[5]]) ||
                checkLine([board[6], board[7], board[8]]) ||
                checkLine([board[0], board[4], board[8]]) ||
                checkLine([board[2], board[4], board[6]]) ||
                checkLine([board[0], board[3], board[6]]) ||
                checkLine([board[1], board[4], board[7]]) ||
                checkLine([board[2], board[5], board[8]])) {
                const result = document.getElementById("result");
                const resultSubtext = document.getElementById("result-subtext");
                result.textContent = `${turn.getPlayerName()} wins!`;
                if (turn.getPlayerIsAi()) {
                    resultSubtext.textContent = "Beat by an AI? Better luck next time.";
                } else {
                    resultSubtext.textContent = "You've got some great moves.";
                }
                const modal = document.getElementsByClassName("end-modal")[0];
                modal.classList.toggle("hide");
                return stopGame();
            }
            if (round == 9) {
                const result = document.getElementById("result");
                const resultSubtext = document.getElementById("result-subtext");
                result.textContent = `Draw!`;
                resultSubtext.textContent = "Not making it easy. Respect.";
                const modal = document.getElementsByClassName("end-modal")[0];
                modal.classList.toggle("hide");
                return stopGame();
            }
        }
        return true;
    }
    const resetGame = () => {
        gameBoard.clearBoard();
        turn = null;
        round = 0;
        const grids = document.getElementsByClassName("grid-box");
        for (let i = 0; i < grids.length; i++) {
            grids[i].classList.remove("taken");
            grids[i].textContent = null;
        }
    }
    return { nextTurn, setTurn, getTurn, shouldContinueGame, resetGame };
})();

const Player = (name, mark, isAi) => {
    const playerMark = mark;
    const playerName = name;
    const playerIsAi = isAi ? isAi : false;
    const getPlayerName = () => { return playerName };
    const getPlayerMark = () => { return playerMark };
    const getPlayerIsAi = () => { return playerIsAi };
    return { getPlayerName, getPlayerMark, getPlayerIsAi };
}

let username;
let player1;
let player2;

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("selectionForm");
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        player1 = Player(data["player1.name"], data["player1.mark"]);
        player2 = Player(
            function() { return data["player2.name"] ? data["player2.name"] : "Opponent" }(),
            function() { return data["player1.mark"] === "X" ? "O" : "X" }(),
            function() { return data["player2.ai"] === "on" ? true : false }());
        const modal = document.getElementsByClassName("modal")[0];
        modal.classList.toggle("hidden");
        const turnLabel = document.getElementsByClassName("turn-label")[0];
        turnLabel.classList.toggle("hide");
        gameController.setTurn(player1);
    })
    const grids = document.getElementsByClassName("grid-box");
    for (let i = 0; i < grids.length; i++) {
        grids[i].addEventListener("click", function(e) {
            if (!e.target.textContent) {
                gameBoard.add(gameController.getTurn().getPlayerMark(), e.target.dataset["idx"]);
            }
        })
    }
    const resetBtn = document.getElementById("reset");
    resetBtn.addEventListener("click", function() {
        gameController.resetGame();
        const modal = document.getElementsByClassName("modal")[0];
        modal.classList.toggle("hidden");
        const endModal = document.getElementsByClassName("end-modal")[0];
        endModal.classList.toggle("hide");
    })
}, false);