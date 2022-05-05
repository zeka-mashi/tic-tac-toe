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
    let next = null;
    const round = 0;
    const addRound = () => round++;
    const setNext = (player) => { next = player };
    return { addRound, setNext };
})

const Player = (name, mark) => {
    const playerMark = mark;
    const getName = () => { return name };
    const getPlayerMark = () => { return playerMark };
    return { getName, getPlayerMark };
}