function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function CPURandomPlay(playable_pieces, cpu) {
  if (playable_pieces.length == 0) {
    turn = 1 - turn;
    return;
  }
  let r = getRandomInt(playable_pieces.length);
  let piece_pos = playable_pieces[r].coord;

  if (cpu == BLACK) {
    showPiece(BLACK, piece_pos, "images/black.png");
    reversePieces(piece_pos);
    removeTransPieces();
    status[piece_pos.x][piece_pos.y] = BLACK;
    turn = WHITE;
  } else if (cpu == WHITE) {
    showPiece(WHITE, piece_pos, "images/white.png");
    removeTransPieces();
    status[piece_pos.x][piece_pos.y] = WHITE;
    turn = BLACK;
  }
  console.log(piece_pos);
  showTransPieces();
}

function CPUAIPlay() {

}
