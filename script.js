const gameBoard = (() => {
    let board = Array(9).fill(null);
    const getBoard = () => { return board };
    const clearBoard = () => { board = Array(9).fill(null) };
    const add = (mark, idx) => {
        if (board[idx] == null) {
            board.splice(idx, 0, mark)
            return true;
        } else {
            return false;
        }
    };
    return { add, getBoard, clearBoard };
})();

const gameController = (() => {
    let turn = null;
    const round = 0;
    const addRound = () => round++;
    const setNext = (player) => { turn = player };
    const getTurn = () => { return turn };
    return { addRound, setNext, getTurn };
})

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
    //username = prompt("WHAT YOUR NAME");
    player = Player(username, "X");
    opponent = Player("Opponent", "O");
}, false);