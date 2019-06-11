function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function CPURandomPlay(playable_pieces, cpu) {
  if (started == 1) {
    if (playable_pieces.length == 0) {
      turn = 1 - turn;
      return;
    }
  } else {
    return;
  }
  let r = getRandomInt(playable_pieces.length);
  let piece_pos = playable_pieces[r].coord;

  if (cpu == BLACK) {
    pieces_sprite[piece_pos.x][piece_pos.y] = showPiece(piece_pos, "images/black.png");
    turn = 1 - turn;
    reversePieces(piece_pos);
    removeTransPieces();
    status[piece_pos.x][piece_pos.y] = BLACK;
  } else if (cpu == WHITE) {
    pieces_sprite[piece_pos.x][piece_pos.y] = showPiece(piece_pos, "images/white.png");
    turn = 1 - turn;
    reversePieces(piece_pos);
    removeTransPieces();
    status[piece_pos.x][piece_pos.y] = WHITE;
  }
  // window.setTimeout(CPUAIPlay, 10000);
  showTransPieces();
  let winner = checkWinner();
  if (winner >= 0) {
    gameOver(winner);
  }

}
// AI
let value_table = [
  [120, -20, 20, 5, 5, 20, -20, 120],
  [-20, -40, -5, -5, -5, -5, -40, -40],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [-20, -40, -5, -5, -5, -5, -40, -40],
  [120, -20, 20, 5, 5, 20, -20, 120]
];

let head = {};
head.coord = new Point(-1, -1);
head.arr = [];

class Tree {
  constructor(coord, arr) {
    this.coord = coord;
    this.arr = arr;
  }
  
}

function getCurrentStatus() {
  let cur_status = [];
  for (let i = 0; i < MASSNUM; i++) {
    cur_status[i] = [];
    for (let j = 0; j < MASSNUM; j++) {
      cur_status[i][j] = status[i][j];
    }
  }
  return cur_status;
}

// min-max
function create_tree(depth) {
  let tmp_turn = turn;
  let status = getCurrentStatus();
  let playable_pieces = getCurrentPlayablePieces(status);
  let tree = new Tree(null, playable_pieces);
  for (let i = 0; i < depth; i++) {
    if (playable_pieces.lenth == 0) {
      break;
    }
    /* direction = {
      coord     //  Coordinate of itself
      playable  //  If this coordinate piece can be put
      move      //  Which direction's pieces will be reversed
    }; */ 
    for (let j = 0; j < tree.arr.length; j++) { // Playable pieces
      let pieces = reversePieces(tree.arr[j].coord);
      tmp_turn = 1 - tmp_turn;
      pieces.forEach(point => {
        status[point.x][point.y] = tmp_turn;
      });
      let playable_pieces = getCurrentPlayablePieces(status, tmp_turn);
    }
  }
}
// evaluation

// heuristic function

// transpostion table

function CPUAIPlay() {

}
