// class Attr {
//     constructor(sprite, status) {
//         this.sprite = sprite;
//         this.status = status;
//     }
// };

// const BLACK = 0, WHITE = 1, EMPTY = -1;
// const PLAYER = 0, CPURANDOM = 1, CPUAI = 2;
// const MASSNUM = 8, MASSSIZE = 100;
// var turn = BLACK;
// let playable_pieces = [];
// let trans_pieces_sprite = [];
// let cpumode = PLAYER;

// let Application = PIXI.Application,
//     Container = PIXI.Container,
//     loader = PIXI.Loader.shared,
//     resources = PIXI.Loader.shared.resources,
//     TextureCache = PIXI.utils.TextureCache,
//     Sprite = PIXI.Sprite,
//     Rectangle = PIXI.Rectangle,
//     Point = PIXI.Point,
//     TextStyle = PIXI.TextStyle,
//     Text = PIXI.Text;

// let pieces = new Array(MASSNUM);
// for (let i = 0; i < MASSNUM; i++) {
//     pieces[i] = new Array(MASSNUM);
//     for (let j = 0; j < MASSNUM; j++) {
//         pieces[i][j] = new Attr(null, EMPTY);
//     }
// }

// let app = new Application({
//     width: 800,
//     height: 800,
//     antialiasing: true,
//     transparent: false,
//     resolution: 1
// });

// let style = new TextStyle({
//     fontFamily: "Arial",
//     fontSize: 36,
//     fill: "white",
//     stroke: '#ff3300',
//     strokeThickness: 4,
//     dropShadow: true,
//     dropShadowColor: "#000000",
//     dropShadowBlur: 4,
//     dropShadowAngle: Math.PI / 6,
//     dropShadowDistance: 6,
// });

// document.body.appendChild(app.view);

// loader
//     .add([
//         "images/board.png",
//         "images/white.png",
//         "images/black.png",
//         "images/black_T.png",
//         "images/white_T.png"
//     ])
//     .load(setup);

// const MOVE = [
//     [0, -1],   //Left
//     [-1, -1],   //Left-up
//     [-1, 0],   //Up
//     [-1, 1],   //Right-up
//     [0, 1],   //Right
//     [1, 1],   //Right-down
//     [1, 0],   //Down
//     [1, -1]    //Left-down
// ];

// /*
// Judege if mass can be put
// */
// function judgePoint(point) {
//     if (pieces[point.x][point.y].status >= 0) {
//         return -1;
//     }
//     let direction = {
//         coord: new Point(-1, -1),
//         turn: turn,
//         playable: 0,
//         move: []
//     };

//     for (let i = 0; i < MOVE.length; i++) {
//         let x = point.x + MOVE[i][0], y = point.y + MOVE[i][1];
//         if (x >= 0 && x < 8 && y >= 0 && y < 8 &&
//             pieces[x][y].status + turn == 1) { //Enenmy mass
//             x += MOVE[i][0], y += MOVE[i][1];
//             while (x >= 0 && x < 8 && y >= 0 && y < 8) {
//                 if (pieces[x][y].status == -1) {
//                     break;
//                 } else if (pieces[x][y].status == turn) {
//                     direction.playable++;
//                     direction.move[i] = turn;
//                     break;
//                 }
//                 x += MOVE[i][0], y += MOVE[i][1];
//             }
//         }
//     }
//     if (direction.playable > 0) {
//         direction.coord = new Point(point.x, point.y);
//     }

//     return direction;
// }

// function printArray(arr) {
//     for (var i = 0; i < arr.length; i++) {
//         for (let j = 0; j < arr.length; j++) {
//             console.log("i: "+i+" j: "+j+"   "+arr[i][j].status);
//         }
//     }
// }

// function removeTransPieces() {
//     let length = trans_pieces_sprite.length;
//     for (let i = 0; i < length; i++) {
//         app.stage.removeChild(trans_pieces_sprite.pop());
//         playable_pieces.pop();
//     }
// }

// function showTransPieces() {
//     let direction;

//     removeTransPieces();
//     for (let i = 0; i < MASSNUM; i++) {
//         for (let j = 0; j < MASSNUM; j++) {
//             let point = new Point(i, j);
//             let image;
//             direction = judgePoint(point);
//             // console.log("x: "+i+" y: "+j+"  ");
//             // console.log(direction);
//             if (direction.playable > 0) {
//                 playable_pieces.push(direction);
//                 if (direction.turn == BLACK) {
//                     image = "images/black_T.png";
//                 } else if (direction.turn == WHITE) {
//                     image = "images/white_T.png";
//                 }
//                 let piece = showPiece(new Point(i, j), image);
//                 trans_pieces_sprite.push(piece);
//             }
//         }
//     }
// }

// function checkPalyable(point) {
//     for (let i = 0; i < playable_pieces.length; i++) {
//         if (playable_pieces[i].coord.x == point.x && playable_pieces[i].coord.y == point.y) {
//             return true;
//         }
//     }
//     return false;
// }

// /*
// Who is WINNER
// */
// function checkWinner() {
//     let white_n = 0, black_n = 0;
//     if (trans_pieces_sprite.length == 0) {
//         // Check if can continue to play
//         turn = 1 - turn;
//         showTransPieces();
//         // trans_pieces_sprite has changed, check once again
//         if (trans_pieces_sprite.length == 0) {
//             for (let i = 0; i < status.length; i++) {
//                 for (let j = 0; j < status[i].length; j++) {
//                     if (pieces[i][j].status == BLACK) {
//                         black_n++;
//                     } else if (pieces[i][j].status == WHITE) {
//                         white_n++;
//                     }
//                 }
//             }
//             return black_n > white_n ? BLACK : WHITE;
//         }
//         return -1;
//     }
//     return -1;
// }

// /*
// Game Over
// */
// function gameOver(winner) {
//     let text;
//     if (winner == BLACK) {
//         text = "Black";
//     } else {
//         text = "White";
//     }
//     let message = new Text("Winner: " + text, style);
//     message.x = app.stage.width / 2 - 100;
//     message.y = app.stage.height / 2 - 50;
//     app.stage.addChild(message);
// }

// /*
// REVERSE
// */
// function reversePieces(point) {
//     let image;
//     let direction;
//     if (turn == WHITE) {
//         image = "images/black.png";
//     } else {
//         image = "images/white.png";
//     }

//     for (var i = 0; i < playable_pieces.length; i++) {
//         if (point.x == playable_pieces[i].coord.x && point.y == playable_pieces[i].coord.y) {
//             direction = playable_pieces[i];
//             break;
//         }
//     }
//     let x = 0, y = 0;

//     for (let i = 0; i < MOVE.length; i++) {
//         if (direction.move[i] == 1 - turn) {
//             x = point.x + MOVE[i][0], y = point.y + MOVE[i][1];
//             for (let j = 0; j < 8; j++) {
//                 if (pieces[x][y].status == 1 - turn) {
//                     break;
//                 }
//                 pieces[x][y].sprite = showPiece(new Point(x, y), image);
//                 pieces[x][y].status = 1 - turn;
//                 x += MOVE[i][0], y += MOVE[i][1];
//             }
//         }
//     }
// }

// function showPiece(point, image) {
//     let piece = new Sprite(resources[image].texture);
//     app.stage.addChild(piece);
//     piece.position.set(point.x * MASSSIZE, point.y * MASSSIZE);

//     return piece;
// }
// /*
// Click Event
// */
// function Clicked(event) {
//     const point = event.data.getLocalPosition(this.parent);
//     let piece_pos = new PIXI.Point(Math.floor(point.x / 100), Math.floor(point.y / 100));
//     // console.log(piece_pos);
//     if (!checkPalyable(piece_pos)) {
//         return;
//     }

//     if (turn == BLACK) {
//         image = "images/black.png";
//         turn = WHITE;
//     } else if (turn == WHITE) {
//         image = "images/white.png";
//         turn = BLACK;
//     }
//     pieces[piece_pos.x][piece_pos.y] = showPiece(piece_pos, image);
//     pieces[piece_pos.x][piece_pos.y].status = turn;
//     reversePieces(piece_pos);
//     showTransPieces();

//     if (cpumode == CPURANDOM) {
//         CPURandomPlay(playable_pieces, turn);
//     } else if (cpumode == CPUAI) {
//         CPUAIPlay();
//     }

//     let winner = checkWinner();
//     if (winner >= 0) {
//         gameOver(winner);
//     }
//     // printArray(status);
// }

// function initStatus() {
//     let board = new Sprite(resources["images/board.png"].texture);
//     app.stage.addChild(board);
//     board.interactive = true;
//     board.on('click', Clicked);

//     let image_b = "images/black.png",
//         image_w = "images/white.png";

//     pieces[3][3].sprite = showPiece(new Point(3, 3), image_b);
//     pieces[3][3].status = BLACK;
//     pieces[4][4].sprite = showPiece(new Point(4, 4), image_b);
//     pieces[4][4].status = BLACK;
//     pieces[4][3].sprite = showPiece(new Point(4, 3), image_w);
//     pieces[4][3].status = WHITE;
//     pieces[3][4].sprite = showPiece(new Point(3, 4), image_w);
//     pieces[3][4].status = WHITE;

//     printArray(pieces);

//     // black_pieces[0] = showPiece(new Point(3, 3), image_b);
//     // black_pieces[1] = showPiece(new Point(4, 4), image_b);
//     // white_pieces[0] = showPiece(new Point(4, 3), image_w);
//     // white_pieces[1] = showPiece(new Point(3, 4), image_w);
// }

// function setup() {
//     initStatus();
//     showTransPieces();
//     if (cpumode == CPURANDOM) {
//         CPURandomPlay(playable_pieces, BLACK);
//     } else if (cpumode == CPUAI) {
//         CPUAIPlay();
//     }
// }

class Attr {
    constructor(sprite, status) {
        this.sprite = sprite;
        this.status = status;
    }
};

const BLACK = 0, WHITE = 1, EMPTY = -1;
const PLAYER = 0, CPURANDOM = 1, CPUAI = 2;
const MASSNUM = 8;
var turn = BLACK;
let trans_pieces = [];
let playable_pieces = [];
let mass_size = 100;
let cpumode = PLAYER;
let pieces = new Array(MASSNUM);
for (let i = 0; i < MASSNUM; i++) {
    pieces[i] = new Array(MASSNUM);
    for (let j = 0; j < MASSNUM; j++) {
        pieces[i][j] = new Attr(null, EMPTY);
    }
}

let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    Point = PIXI.Point,
    TextStyle = PIXI.TextStyle,
    Text = PIXI.Text;

let app = new Application({
    width: 800,
    height: 800,
    antialiasing: true,
    transparent: false,
    resolution: 1
});

let style = new TextStyle({
    fontFamily: "Arial",
    fontSize: 36,
    fill: "white",
    stroke: '#ff3300',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
});

document.body.appendChild(app.view);

loader
    .add([
        "images/board.png",
        "images/white.png",
        "images/black.png",
        "images/black_T.png",
        "images/white_T.png"
    ])
    .load(setup);

const MOVE = [
    [0, -1],   //Left
    [-1, -1],   //Left-up
    [-1, 0],   //Up
    [-1, 1],   //Right-up
    [0, 1],   //Right
    [1, 1],   //Right-down
    [1, 0],   //Down
    [1, -1]    //Left-down
];
/*
Judege if point can be put
*/
function judgePoint(point) {
    if (pieces[point.x][point.y].status >= 0) {
        return -1;
    }
    let direction = {
        coord: new Point(-1, -1),
        turn: turn,
        playable: 0,
        move: []
    };

    for (let i = 0; i < MOVE.length; i++) {
        let x = point.x + MOVE[i][0], y = point.y + MOVE[i][1];
        if (x >= 0 && x < MASSNUM && y >= 0 && y < MASSNUM &&
            pieces[x][y].status + turn == 1) { //Enenmy mass
            x += MOVE[i][0], y += MOVE[i][1];
            while (x >= 0 && x < MASSNUM && y >= 0 && y < MASSNUM) {
                if (pieces[x][y].status == -1) {
                    break;
                } else if (pieces[x][y].status == turn) {
                    direction.playable++;
                    direction.move[i] = turn;
                    break;
                }
                x += MOVE[i][0], y += MOVE[i][1];
            }
        }
    }
    if (direction.playable > 0) {
        direction.coord = new Point(point.x, point.y);
    }

    return direction;
}

function printArray(arr) {
    for (var i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
}

function removeTransPieces() {
    let length = trans_pieces.length;
    for (let i = 0; i < length; i++) {
        app.stage.removeChild(trans_pieces.pop());
        playable_pieces.pop();
    }
}

function showTransPieces() {
    let direction;

    removeTransPieces();
    for (let i = 0; i < MASSNUM; i++) {
        for (let j = 0; j < MASSNUM; j++) {
            let point = new Point(i, j);
            direction = judgePoint(point);
            // console.log("x: "+i+" y: "+j+"  ");
            // console.log(direction);
            if (direction.playable > 0) {
                playable_pieces.push(direction);
                let image, piece;
                if (direction.turn == BLACK) {
                    image = "images/black_T.png";
                } else if (direction.turn == WHITE) {
                    image = "images/white_T.png";
                }
                piece = showPiece(new Point(i, j), image);
                trans_pieces.push(piece);
            }
        }
    }
}

function checkPalyable(point) {
    for (let i = 0; i < playable_pieces.length; i++) {
        if (playable_pieces[i].coord.x == point.x && playable_pieces[i].coord.y == point.y) {
            return true;
        }
    }
    return false;
}

/*
Who is WINNER
*/
function checkWinner() {
    let white_n = 0, black_n = 0;
    if (trans_pieces.length == 0) {
        // Check if can continue to play
        turn = 1 - turn;
        showTransPieces();
        // trans_pieces has changed, check once again
        if (trans_pieces.length == 0) {
            for (let i = 0; i < MASSNUM; i++) {
                for (let j = 0; j < MASSNUM; j++) {
                    if (pieces[i][j].status == BLACK) {
                        black_n++;
                    } else if (pieces[i][j].status == WHITE) {
                        white_n++;
                    }
                }
            }
            return black_n > white_n ? BLACK : WHITE;
        }
        return -1;
    }
    return -1;
}

/*
Game Over
*/
function gameOver(winner) {
    let text;
    if (winner == BLACK) {
        text = "Black";
    } else {
        text = "White";
    }
    let message = new Text("Winner: " + text, style);
    message.x = app.stage.width / 2 - 100;
    message.y = app.stage.height / 2 - 100;
    app.stage.addChild(message);
}

/*
REVERSE
*/
function reversePieces(point) {
    let image;
    let direction;
    if (turn == WHITE) {
        image = "images/black.png";
    } else {
        image = "images/white.png";
    }

    for (var i = 0; i < playable_pieces.length; i++) {
        if (point.x == playable_pieces[i].coord.x && point.y == playable_pieces[i].coord.y) {
            direction = playable_pieces[i];
            break;
        }
    }
    let x = 0, y = 0;

    for (let i = 0; i < MOVE.length; i++) {
        if (direction.move[i] == 1 - turn) {
            x = point.x + MOVE[i][0], y = point.y + MOVE[i][1];
            for (let j = 0; j < 8; j++) {
                if (pieces[x][y].status == 1 - turn) {
                    break;
                }
                pieces[x][y].sprite = showPiece(new Point(x, y), image);
                pieces[x][y].status = 1 - turn;
                x += MOVE[i][0], y += MOVE[i][1];
            }
        }
    }
}

function showPiece(point, image) {
    let piece = new Sprite(resources[image].texture);
    app.stage.addChild(piece);
    piece.position.set(point.x * mass_size, point.y * mass_size);

    return piece;
}
/*
Click Event
*/
function Clicked(event) {
    const point = event.data.getLocalPosition(this.parent);
    let piece_pos = new PIXI.Point(Math.floor(point.x / 100), Math.floor(point.y / 100));
    // console.log(piece_pos);
    if (!checkPalyable(piece_pos)) {
        return;
    }

    if (turn == BLACK) {
        image = "images/black.png";
    } else if (turn == WHITE) {
        image = "images/white.png";
    }
    pieces[piece_pos.x][piece_pos.y].sprite = showPiece(piece_pos, image);
    pieces[piece_pos.x][piece_pos.y].status = turn;
    turn = 1 - turn;
    reversePieces(piece_pos);
    showTransPieces();

    if (cpumode == CPURANDOM) {
        CPURandomPlay(playable_pieces, turn);
    } else if (cpumode == CPUAI) {
        CPUAIPlay();
    }

    let winner = checkWinner();
    if (winner >= 0) {
        gameOver(winner);
    }
    // printArray(status);
}

function initStatus() {
    let board = new Sprite(resources["images/board.png"].texture);
    app.stage.addChild(board);
    board.interactive = true;
    board.on('click', Clicked);

    let image_b = "images/black.png",
        image_w = "images/white.png";

    pieces[3][3].sprite = showPiece(new Point(3, 3), image_b);
    pieces[4][4].sprite = showPiece(new Point(4, 4), image_b);
    pieces[4][3].sprite = showPiece(new Point(4, 3), image_w);
    pieces[3][4].sprite = showPiece(new Point(3, 4), image_w);
    pieces[3][3].status = BLACK;
    pieces[4][4].status = BLACK;
    pieces[4][3].status = WHITE;
    pieces[3][4].status = WHITE;
}

function setup() {
    initStatus();
    showTransPieces();
    if (cpumode == CPURANDOM) {
        CPURandomPlay(playable_pieces, BLACK);
    } else if (cpumode == CPUAI) {
        CPUAIPlay();
    }
}
