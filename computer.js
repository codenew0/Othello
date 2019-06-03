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
  console.log(piece_pos);
  showTransPieces();
}

function CPUAIPlay() {

}
