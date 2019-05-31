let status = [
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, 0, 1, -1, -1, -1],
    [-1, -1, -1, 1, 0, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1]
];
const BLACK = 0, WHITE = 1;
const PLAYER = 0, CPURANDOM = 1, CPUAI = 2;
var turn = BLACK;
let white_pieces = [];
let black_pieces = [];
let trans_pieces = [];
let playable_pieces = [];
let mass_size = 100;
let cpumode = PLAYER;

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
    if (status[point.x][point.y] >= 0) {
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
        if (x >= 0 && x < 8 && y >= 0 && y < 8 &&
            status[x][y] + turn == 1) { //Enenmy mass
            x += MOVE[i][0], y += MOVE[i][1];
            while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                if (status[x][y] == -1) {
                    break;
                } else if (status[x][y] == turn) {
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
    for (let i = 0; i < status.length; i++) {
        for (let j = 0; j < status[i].length; j++) {
            let point = new Point(i, j);
            direction = judgePoint(point);
            // console.log("x: "+i+" y: "+j+"  ");
            // console.log(direction);
            if (direction.playable > 0) {
                playable_pieces.push(direction);
                if (direction.turn == BLACK) {
                    let image = "images/black_T.png";
                    let black_piece = showPiece(turn, new Point(i, j), image);
                    trans_pieces.push(black_piece);
                } else if (direction.turn == WHITE) {
                    let image = "images/white_T.png";
                    let white_piece = showPiece(turn, new Point(i, j), image);
                    trans_pieces.push(white_piece);
                }
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
            for (let i = 0; i < status.length; i++) {
                for (let j = 0; j < status[i].length; j++) {
                    if (status[i][j] == BLACK) {
                        black_n++;
                    } else if (status[i][j] == WHITE) {
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
    if (1 - turn == BLACK) {
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
                if (status[x][y] == 1 - turn) {
                    break;
                }
                showPiece(turn, new Point(x, y), image);
                status[x][y] = 1 - turn;
                x += MOVE[i][0], y += MOVE[i][1];
            }
        }
    }
}

function showPiece(turn, point, image) {
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
        black_pieces[black_pieces.length] = showPiece(BLACK, piece_pos, image);
        status[piece_pos.x][piece_pos.y] = turn;
        turn = WHITE;
    } else if (turn == WHITE) {
        image = "images/white.png";
        white_pieces[black_pieces.length] = showPiece(WHITE, piece_pos, image);
        status[piece_pos.x][piece_pos.y] = turn;
        turn = BLACK;
    }
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

    black_pieces[0] = showPiece(BLACK, new Point(3, 3), image_b);
    black_pieces[1] = showPiece(BLACK, new Point(4, 4), image_b);
    white_pieces[0] = showPiece(WHITE, new Point(4, 3), image_w);
    white_pieces[1] = showPiece(WHITE, new Point(3, 4), image_w);
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
