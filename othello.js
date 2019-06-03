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
let clicked = 0;
let trans_pieces = [];
let playable_pieces = [];
let welcome_scene, game_scene, mode_scene;
let mass_size = 100;
let player = new Array(2);
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
        "images/white_T.png",
        "images/background.png",
        "images/start.png",
        "images/mode.png",
        "images/ranking.png",
        "images/player.png",
        "images/cpurandom.png",
        "images/cpuai.png",
        "images/chose.png"
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
        game_scene.removeChild(trans_pieces.pop());
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
    game_scene.addChild(message);
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

    //Search the movement of the point
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
    game_scene.addChild(piece);
    piece.position.set(point.x * mass_size, point.y * mass_size);

    return piece;
}
/*
Click Event
*/
function Click(event) {
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

    let winner = checkWinner();
    if (winner >= 0) {
        gameOver(winner);
    }

    // event.currentTarget.off('click');
    // printArray(status);
}

function gameStart() {
    app.stage.removeChild(welcome_scene);

    player[0] = PLAYER, player[1] = CPURANDOM;

    let board = new Sprite(resources["images/board.png"].texture);
    game_scene.addChild(board);


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

    showTransPieces();
}

let choice = new Array(2);
function modeChoose(event) {
    let chose = event.currentTarget;
    let img = "images/chose.png";
    let i = -1;
    if (chose.x == 150) {   //Player1
        i = 0;
    } else if (chose.x == 450) { //Player2
        i = 1;
    }
    if (choice[i] != null) {
        mode_scene.removeChild(choice[i]);
    }
    choice[i] = new Sprite(resources[img].texture);
    mode_scene.addChild(choice[i]);
    choice[i].position.set(chose.x - 25, chose.y - 25);
    if (chose.y == 230) {
        player[i] = PLAYER;
    } else if (chose.y == 350) {
        player[i] = CPURANDOM;
    } else if (chose.y == 470) {
        player[i] = CPUAI;
    }
}

function modeStart(event) {

}

function gameMode() {
    //UI
    app.stage.removeChild(welcome_scene);

    mode_scene = new Container();
    app.stage.addChild(mode_scene);

    let background = new Sprite(resources["images/background.png"].texture);
    mode_scene.addChild(background);

    let player1 = new Text("PLAYER1", style);
    player1.x = 170;
    player1.y = 150;
    mode_scene.addChild(player1);
    let player2 = new Text("PLAYER2", style);
    player2.x = 470;
    player2.y = 150;
    mode_scene.addChild(player2);

    let mode = new Array(6);
    let img = ["images/player.png", "images/cpurandom.png", "images/cpuai.png"];
    //150,230 400,230 150,350 400,350 150,470 400,470
    for (let i = 0; i < mode.length; i++) {
        mode[i] = new Sprite(resources[img[Math.floor(i / 2)]].texture);
        mode_scene.addChild(mode[i]);
        mode[i].interactive = true;
        mode[i].buttonMode = true;
        if (i % 2 == 0) {
            mode[i].position.set(150, 230 + 120 * Math.floor(i / 2));
        } else {
            mode[i].position.set(450, 230 + 120 * Math.floor(i / 2));
        }
        mode[i].on('click', modeChoose);
    }

    let start = new Sprite(resources["images/start.png"].texture);
    mode_scene.addChild(start);
    start.interactive = true;
    start.buttonMode = true;
    start.position.set(250, 600);
    start.on('click', modeStart);
}

function gameRanking() {

}

function initStatus() {
    game_scene = new Container();
    app.stage.addChild(game_scene);

    welcome_scene = new Container();
    app.stage.addChild(welcome_scene);

    let background = new Sprite(resources["images/background.png"].texture);
    welcome_scene.addChild(background);

    let start_button = new Sprite(resources["images/start.png"].texture);
    welcome_scene.addChild(start_button);
    start_button.interactive = true;
    start_button.buttonMode = true;
    start_button.position.set(250, 150);
    start_button.on('click', gameStart);

    let mode_button = new Sprite(resources["images/mode.png"].texture);
    welcome_scene.addChild(mode_button);
    mode_button.interactive = true;
    mode_button.buttonMode = true;
    mode_button.position.set(250, 350);
    mode_button.on('click', gameMode);

    let ranking_button = new Sprite(resources["images/ranking.png"].texture);
    welcome_scene.addChild(ranking_button);
    ranking_button.interactive = true;
    ranking_button.buttonMode = true;
    ranking_button.position.set(250, 550);
    ranking_button.on('click', gameRanking);

    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop() {
    if (turn == BLACK) {
        if (player[0] == PLAYER) {
            game_scene.interactive = true;
            game_scene.on('click', Click);
        } else if (player[0] == CPURANDOM) {
            CPURandomPlay(playable_pieces, BLACK);
        } else if (player[0] == CPUAI) {
            CPUAIPlay();
        }
    } else {
        if (player[1] == PLAYER) {
            game_scene.interactive = true;
            game_scene.on('click', Click);
        } else if (player[1] == CPURANDOM) {
            CPURandomPlay(playable_pieces, WHITE);
        } else if (player[1] == CPUAI) {
            CPUAIPlay();
        }
    }
}

function setup() {
    initStatus();
}
