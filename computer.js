function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function CPURandomPlay(playable_pieces, cpu) {
  if (started == 1) {
    if (playable_pieces.length == 0) {　さ
      turn = 1 - turn;
      return;
    }
  } else {
    return;
  }
  let r = getRandomInt(playable_pieces.length);
  let piece_pos = playable_pieces[r].coord;

  if (cpu == BLACK) {
    pieces[piece_pos.x][piece_pos.y].sprite = showPiece(piece_pos, "images/black.png");
    turn = 1 - turn;
    reversePieces(piece_pos);
    removeTransPieces();
    pieces[piece_pos.x][piece_pos.y].status = BLACK;
  } else if (cpu == WHITE) {
    pieces[piece_pos.x][piece_pos.y].sprite = showPiece(piece_pos, "images/white.png");
    turn = 1 - turn;
    reversePieces(piece_pos);
    removeTransPieces();
    pieces[piece_pos.x][piece_pos.y].status = WHITE;
  }
  // console.log(piece_pos);
  window.setTimeout(CPUAIPlay, 10000);
  showTransPieces();
  let winner = checkWinner();
  if (winner >= 0) {
    gameOver(winner);
  }
 
}

function CPUAIPlay() {
  // min-max

  // evaluation

  // heuristic function

  // transpostion table
}
