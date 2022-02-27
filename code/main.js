// Tutorial: https://www.youtube.com/watch?v=enNnDvWDtxA&t=3s

import kaboom from "kaboom"

// initialize context
kaboom({
    width: 440,
    height: 560,
    font: "sinko",
    background: [0,0,0]
});

// initial variables
const blockSize = 20

const directions = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right",
}

let currentDirection = directions.DOWN;
let runAction = false;
let snakeLength = 3;
let snakeBody = [];

// add level to game
const map = addLevel([
    "                      ",
    "                      ",
    "                      ",
    "======================",
    "=                    =",
    "=                    =",
    "=                    =",
    "=                    =",
    "=                    =",
    "=                    =",
    "=                    =",
    "=                    =",
    "=                    =",
    "=                    =",
    "=                    =",
    "=                    =",
    "=                    =",
    "=                    =",
    "=                    =",
    "=                    =",
    "=                    =",
    "=                    =",
    "=                    =",
    "=                    =",
    "======================",
    ], {
        width: blockSize, 
        height: blockSize, 
        pos: vec2(0,0), 
        "=": () => [
            rect(blockSize, blockSize), 
            color(255,0,0), 
            area(), 
            "wall"], 
    });

let title = add([
    pos(width()/2, 30),
    origin("center"),
    text("KaboomJS Snake", {
        size: 32,
    }),
])

let score = add([
    pos(width()/2, 516),
    origin("center"),
    text("Score:  0", {
        size: 24,
    }), 
    {value: 0}
]);

let highScore = add([
    pos(width()/2, 544),
    origin("center"),
    text("High Score: 0", {
        size: 24,
    }),
    {value: 0}
]);

// respawn functions
function respawnSnake() {
    destroyAll("snake");

    snakeBody = [];
    snakeLength = 3;
    score.text = "Score: " + score.value;
    highScore.text = "High Score: " + highScore.value;

    for(let i = 1; i <= snakeLength; i++) {
        let segment = add([
            rect(blockSize, blockSize),
            pos(blockSize, blockSize * i + 60),
            color(0,0,255),
            area(),
            "snake"
        ])
        snakeBody.push(segment);
    }

    currentDirection = directions.DOWN;
}

function respawnAll() {
    runAction = false;
    wait(0.5, function(){
        respawnSnake();
        respawnFood();
        runAction = true;
    })
}

respawnAll();

// movement
keyPress("up", () => {
    if(currentDirection != directions.DOWN){
        currentDirection = directions.UP;
    }
});

keyPress("down", () => {
    if(currentDirection != directions.UP){
        currentDirection = directions.DOWN;
    }
});

keyPress("left", () => {
    if(currentDirection != directions.RIGHT){
        currentDirection = directions.LEFT;
    }
});

keyPress("right", () => {
    if(currentDirection != directions.LEFT){
        currentDirection = directions.RIGHT;
    }
});

let moveDelay = 0.2;
let timer = 0;

// tutorial uses the older action() method
onUpdate(() => {
    if(!runAction) return;

    timer += dt();
    if(timer < moveDelay) return
    timer = 0;

    let moveX = 0;
    let moveY = 0;

    switch(currentDirection){
        case directions.DOWN:
            moveX = 0;
            moveY = blockSize;
            break;
        case directions.UP:
            moveX = 0;
            moveY = -blockSize;
            break;
        case directions.LEFT:
            moveX = -blockSize;
            moveY = 0;
            break;
        case directions.RIGHT:
            moveX = blockSize;
            moveY = 0;
            break;
    }

    let snakeHead = snakeBody[snakeBody.length - 1];

    snakeBody.push(
        add([
            rect(blockSize, blockSize),
            pos(snakeHead.pos.x + moveX, snakeHead.pos.y + moveY),
            color(0,0,255),
            area(),
            "snake",
        ])
    )

    if(snakeBody.length > snakeLength) {
        let tail = snakeBody.shift();
        destroy(tail);
    }
});

// food spawns
let food = null;

function respawnFood(){
    let newPOS = rand(vec2(1,4), vec2(20,23));
    newPOS.x = Math.floor(newPOS.x);
    newPOS.y = Math.floor(newPOS.y);
    newPOS = newPOS.scale(blockSize);

    if(food){
        destroy(food);
    }

    food = add([
        rect(blockSize, blockSize),
        color(0,255,0),
        pos(newPOS),
        area(),
        "food"
    ])
}

// detection collisions
// tutorial uses the old collides() method

// snake eats food
onCollide("snake", "food", () =>{
    snakeLength++;
    respawnFood();
    score.value += 1;
    score.text = "Score: " + score.value;
});

// snake hits wall
onCollide("snake", "wall", () =>{
    if (score.value > highScore.value) {
        highScore.value = score.value;
    }
    runAction = false;
    shake(12);
    respawnAll();
    score.value = 0;
});

onCollide("snake", "snake", () =>{
    if (score.value > highScore.value) {
        highScore.value = score.value;
    }
    runAction = false;
    shake(12);
    respawnAll();

    score.value = 0;
});