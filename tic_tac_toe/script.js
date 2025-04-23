/* Algoritmo para encontrar la mejor jugada */
function minimax(board, depth, isMaximizingPlayer) {
  const winner = checkWinner(board);
  if (winner === userSymbol) return -10 + depth;
  if (winner === computerSymbol) return 10 - depth;

  if (isBoardFull(board)) return 0;

  if (isMaximizingPlayer){
    let best = -Infinity;

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === '') {
          board[row][col] = computerSymbol;
          best = Math.max(best, minimax(board, depth + 1, false));
          board[row][col] = '';
        }
      }
    }

    return best;
  } else {
    let best = Infinity;

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === '') {
          board[row][col] = userSymbol;
          best = Math.min(best, minimax(board, depth + 1, true));
          board[row][col] = '';
        }
      }
    }

    return best;
  }
}

/* Hace una jugada por parte de la máquina */
function makeComputerPlay(board){
  let bestVal = -Infinity;
  let bestMove  = { row: -1, col: -1 };
  const preferredMoves = [
    { row: 1, col: 1 },
    { row: 0, col: 0 }, { row: 0, col: 2 },
    { row: 2, col: 0 }, { row: 2, col: 2 },
    { row: 0, col: 1 }, { row: 1, col: 0 },
    { row: 1, col: 2 }, { row: 2, col: 1 }
  ];

  for (let move of preferredMoves) {
    const { row, col } = move;
    if (board[row][col] === '') {
      board[row][col] = computerSymbol;
      const moveVal = minimax(board, 0, computerSymbol === 'O');
      board[row][col] = '';

      if (moveVal > bestVal) {
        bestVal = moveVal;
        bestMove = move;
      }
    }
  }

  for (let square of physicalBoard){
    if (square.row === bestMove.row && square.col === bestMove.col){
      handlePlay(square, computerSymbol);
    }
  }
}

/* Comprueba si el tablero esta lleno */
function isBoardFull(board) {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === '') return false;
    }
  }
  return true;
}

/* Comprueba si hay un ganador */
function checkWinner(board) {
  /* Todas las posibles combinaciones ganadoras */
  const lines = [
    [board[0][0], board[0][1], board[0][2]],
    [board[1][0], board[1][1], board[1][2]],
    [board[2][0], board[2][1], board[2][2]],
    [board[0][0], board[1][0], board[2][0]],
    [board[0][1], board[1][1], board[2][1]],
    [board[0][2], board[1][2], board[2][2]],
    [board[0][0], board[1][1], board[2][2]],
    [board[0][2], board[1][1], board[2][0]]
  ];

  /* Comprueba si hay una línea ganadora */
  for (const line of lines) {
    if (line[0] !== '' && line[0] === line[1] && line[1] === line[2]) {
      return line[0];
    }
  }

  return null;
}

/* Comprueba si la celda clicada esta disponible para hacer la jugada, si lo esta, añade la forma a la celda y apunta el número en el tablero */
function handlePlay(square, symbol) {
  let row = square.row;
  let col = square.col;

  if (logicBoard[row][col] !== '') return false;

  logicBoard[row][col] = symbol;

  const div = document.createElement("div");
  div.classList.add(symbol === 'X' ? 'cross' : 'circle');
  square.container.appendChild(div);
  
  const winner = checkWinner(logicBoard);

  if (winner){
    playing = false;
    alert(`Gana el jugador ${winner}!`);
  
  } else if (isBoardFull(logicBoard)){
    playing = false;
    alert("Es un empate!");
  }

  return true;
}

/* Vacía el tablero para reiniciar el juego */
function restartGame(){
  for (let row = 0; row < 3; row++){
    for (let col = 0; col < 3; col++){
      logicBoard[row][col] = '';
    }
  }

  for (let square of physicalBoard){
    square.container.innerHTML = '';
  }

  playing = true;
  randomizeFirstUser();
}

/* Pone los simbolos del jugador y la máquina y elige jugador inicial. Hay 50% de posibilidades de que empiece el jugador */
function randomizeFirstUser(){
  if (Math.random() <= 0.5){
    userSymbol = 'X';
    computerSymbol = 'O';

  } else {
    userSymbol = 'O';
    computerSymbol = 'X';
    if (!gameMode.checked) makeComputerPlay(logicBoard)
  }
}

/* Crea los eventos para reiniciar el juego */
function createRestartGameEvent(){
  document.addEventListener("keyup", function(event) {
    if (event.key === "r"){
      restartGame();
    }
  });

  gameMode.addEventListener('click', function(event) {
    restartGame();
  });
}

/* Captura las celdas del DOM para añadirles los eventos de click */
function createSquareEvents(){
  let squareContainers = document.getElementsByClassName('square');

  for (let i = 0; i < squareContainers.length; i++){
    const container = squareContainers[i];
    const row = Math.floor(i / 3);
    const col = i % 3;
    const square = {container: container, row: row, col: col};
    physicalBoard.push(square);

    container.addEventListener('click', function (event) {
      /* Comprueba si el juego continua */
      if (playing){
        let userHasPlayed = handlePlay(square, userSymbol);

        /* Comprueba si el jugador ha hecho su movimiento y el juego continua */
        if (userHasPlayed && playing){
          /* Si el juego es contra la máquina, hace su jugada la CPU */
          if (!gameMode.checked){
            makeComputerPlay(logicBoard);

          /* Si el juego es de dos jugadores, se cambia el simbolo del usuario */
          } else {
            userSymbol = userSymbol === 'O' ? 'X' : 'O';
          }
        }
      }
    });
  }
}

const gameMode = document.getElementById('game-mode-switch');
let physicalBoard = [];
let logicBoard = [['', '', ''], ['', '', ''], ['', '', '']];
let userSymbol;
let computerSymbol;
let playing = true;

document.addEventListener('DOMContentLoaded', () => {
  createSquareEvents();
  createRestartGameEvent();
  randomizeFirstUser();
});