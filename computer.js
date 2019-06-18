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



// function getCurrentStatus() {
//   let cur_status = [];
//   for (let i = 0; i < MASSNUM; i++) {
//     cur_status[i] = [];
//     for (let j = 0; j < MASSNUM; j++) {
//       cur_status[i][j] = status[i][j];
//     }
//   }
//   return cur_status;
// }

// function printTree(head) {
//   while (head.snode != null) {
//     for (let i  = 0; i < head.snode.length; i++){
//       console.log(head.snode[i].coord);
//     }
//     head = head.snode;
//   }
// }
// // min-max
// function create_tree(depth) {
//   let tmp_turn = turn;
//   let status = getCurrentStatus();  
//   /*  piece's property
//       coord     //  Coordinate of itself
//       playable  //  If this coordinate piece can be put
//       move      //  Which direction's pieces will be reversed
//     }; */ 
//   let head = {};
//   let p = head;
//   for (let i = 0; i < depth; i++) {
//     let playable_pieces = getCurrentPlayablePieces(status, tmp_turn);
//     if (playable_pieces.length == 0) {
//       p.snode = null;
//       break;
//     }
//     if (p == null) {
//       head.snode = playable_pieces;
//     }
//     for (let j = 0; j < playable_pieces.length; j++) { // Playable pieces
//       let pieces = reversePieces(playable_pieces[j].coord);
//       tmp_turn = 1 - tmp_turn;
//       pieces.forEach(point => {
//         status[point.x][point.y] = tmp_turn;
//       });
//       playable_pieces.snode = getCurrentPlayablePieces(status, tmp_turn);
//     }
//   }
// }
// // evaluation

// // heuristic function

// // transpostion table

function CPUAIPlay(playable_pieces, cpu) {
  console.log(playable_pieces);
  if (started == 1) {
    if (playable_pieces.length == 0) {
      turn = 1 - turn;
      return;
    }
  } else {
    return;
  }

  let p = new Point(0, 0);
  p.x = playable_pieces[0].coord.x;
  p.y = playable_pieces[0].coord.y;
  for (let i = 1; i < playable_pieces.length; i++){
    let x = playable_pieces[i].coord.x;
    let y = playable_pieces[i].coord.y;
    if (value_table[x][y] > value_table[p.x][p.y]){
      p.x = x, p.y = y;
    }
  }

  if (cpu == BLACK) {
    pieces_sprite[p.x][p.y] = showPiece(p, "images/black.png");
    turn = 1 - turn;
    reversePieces(p);
    removeTransPieces();
    status[p.x][p.y] = BLACK;
  } else if (cpu == WHITE) {
    pieces_sprite[p.x][p.y] = showPiece(p, "images/white.png");
    turn = 1 - turn;
    reversePieces(p);
    removeTransPieces();
    status[p.x][p.y] = WHITE;
  }
  // window.setTimeout(CPUAIPlay, 10000);
  showTransPieces();
  let winner = checkWinner();
  if (winner >= 0) {
    gameOver(winner);
  }
}
