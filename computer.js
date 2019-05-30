function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function CPURandomPlay(trans_pieces) {
  let r = getRandomInt(trans_pieces.length);
  return trans_pieces[r].coord;
}
