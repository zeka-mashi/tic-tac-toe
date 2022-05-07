const gameBoard = (() => {
    let board = Array(9).fill(null);
    const getBoard = () => { return board }
    const clearBoard = () => { board = Array(9).fill(null) }
    const add = (mark, idx) => {
        let grid = document.querySelectorAll(`[data-idx="${idx}"]`)[0];
        grid.textContent = mark;
        if (board[idx] == null) {
            board.splice(idx, 1, mark);
            gameController.nextTurn();
        } else {}
        console.log(gameBoard.getBoard())
    };
    return { add, getBoard, clearBoard };
})();

const gameController = (() => {
    let turn = null;
    const setName = () => {
        let span = document.getElementById("turn");
        span.textContent = turn.getName();
    }
    const nextTurn = () => {
        turn = turn == player ? opponent : player;
        setName();
    }
    const setTurn = (player) => {
        turn = player;
        setName();
    };
    const getTurn = () => { return turn };
    return { nextTurn, setTurn, getTurn };
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