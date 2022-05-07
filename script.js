const gameBoard = (() => {
    let board = Array(9).fill(null);
    const getBoard = () => { return board }
    const clearBoard = () => { board = Array(9).fill(null) }
    const add = (mark, idx) => {
        let grid = document.querySelectorAll(`[data-idx="${idx}"]`)[0];
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
        span.textContent = turn.getName();
    }
    const nextTurn = () => {
        turn = turn == player ? opponent : player;
        setName();
        round++;
    }
    const setTurn = (player) => {
        turn = player;
        setName();
        round++;
    };
    const getTurn = () => { return turn };
    const checkLine = (arr) => {
        let countX = 0;
        let countO = 0;
        arr.forEach(grid => { if (grid == "X") { countX++ } else if (grid == "O") { countO++ } });
        console.log(countX, countO)
        if (countX == 3 || countO == 3) {
            return true;
        }
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
                turn = null;
                const label = document.getElementsByClassName("turn-label")[0];
                label.classList.toggle("hide");
                return false;
            }
        }
        if (round == 9) {
            turn = null;
            const label = document.getElementsByClassName("turn-label")[0];
            label.classList.toggle("hide");
            return false;
        }
        return true;
    }
    return { nextTurn, setTurn, getTurn, shouldContinueGame };
})();

const Player = (name, mark) => {
    const playerMark = mark;
    const playerName = name;
    const getName = () => { return playerName };
    const getPlayerMark = () => { return playerMark };
    return { getName, getPlayerMark };
}

let username;
let player;
let opponent;

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("selectionForm");
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        console.log(data);
        player = Player(data["player.name"], data["player.mark"]);
        opponent = Player("Opponent", function() { return data["player.mark"] === "X" ? "O" : "X" }());
        const modal = document.getElementsByClassName("modal")[0];
        modal.classList.add("hidden");
        const turnLabel = document.getElementsByClassName("turn-label")[0];
        turnLabel.classList.toggle("hide");
        gameController.setTurn(player);
    })
    const grids = document.getElementsByClassName("grid-box");
    for (let i = 0; i < grids.length; i++) {
        grids[i].addEventListener("click", function(e) {
            if (!e.target.textContent) {
                gameBoard.add(gameController.getTurn().getPlayerMark(), e.target.dataset["idx"]);
            }
        })
    }
}, false);