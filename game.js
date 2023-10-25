
const body = document.querySelector("body");
const info = document.querySelector("#info");
const levelInfo = document.querySelector("#level");
const help = document.querySelector("#help");

class Game {
    constructor() {
        this.board = document.querySelector("#board");
        this.boardWidth = board.clientWidth;
        this.boardHeight = board.clientHeight;
        this.stopBox = false;
        this.gameStop = false;
        this.enemyArray = [];
        this.boxArray = [];
        this.floorBoxes = [];
        this.victoryDoor;
        this.totalLevels = 3;
        this.level = 1;
        this.player = new Player(this.boardWidth, this.boardHeight);
        this.kills = 0;
        this.isInFront = false;
    }
    movement(e) {
        if (!this.gameStop) {
            this.player.move(e);
            //intentava cridar aqui lo de cambiar les  classes, per si desde dins el objecte playey (funcio move()) no podia llegirho
            if (e.key === "ArrowRight") {
                this.player.playerElement.classList.remove("player-going-left")
                this.player.playerElement.classList.add("player-going-right")
            }
            else if (e.key === "ArrowLeft") {
                this.player.playerElement.classList.remove("player-going-right");
                this.player.playerElement.classList.add("player-going-left");
            }
        }
    }
    interaction(e) {
        if (!this.victoryDoor) {
            if (e.key === " ") {
                console.log("There is nothing to interact with in this level...")
                help.innerText = "There is nothing to interact with in this level..."
            }
            setTimeout(() => {
                help.innerText = "Good luck Kenny!";
            }, 2000)
        }
        else {
            if (this.player.verticalPosition >= this.victoryDoor.verticalPosition &&
                this.player.horizontalPosition < this.victoryDoor.horizontalPosition + this.victoryDoor.width &&
                this.player.horizontalPosition + this.player.width > this.victoryDoor.horizontalPosition &&
                this.player.verticalPosition < this.victoryDoor.verticalPosition + this.victoryDoor.height
            ) {
                

                help.innerText = "Press 'Space' to interact with the door"
                    

                setTimeout(() => {
                    help.innerText = "Good luck Kenny!";
                }, 1000)

                if (this.victoryDoor.open(e)) {
                    help.innerText = "WELCOME, YOU WON!";
                    this.gameStop = true;
                    this.board.className = "end";
                }


            }
        }
    }
    gravity() {
        this.player.fall();
        this.boxArray.forEach((e) => {
            e.fall(this.floorBoxes);
        })
    }
    addEnemy() {
        const newElement = document.createElement("div");
        newElement.className = "enemy";
        const enemy = new Block(this.boardWidth, this.boardHeight, newElement);
        this.enemyArray.push(enemy);
        this.board.appendChild(newElement);
    }
    moveEnemy() {
        this.enemyArray.forEach((e) => {
            e.move();
        })
    }
    addBox() {
        if (!this.stopBox) {
            const newBoxElement = document.createElement("div");
            newBoxElement.className = "box";
            const box = new Box(this.boardWidth, this.boardHeight, newBoxElement);
            this.boxArray.push(box);
            this.board.appendChild(newBoxElement)
        }
    }
    checkForCollissions() {
        this.enemyArray.forEach((e) => {
            //BLOCK LATERAL COLLISIONS WITH PLAYER
            if (this.player.verticalPosition < e.height) {//check if player its jumping over it

                if (this.player.horizontalPosition + this.player.width >= e.horizontalPosition
                    && this.player.horizontalPosition <= e.horizontalPosition + e.width) {

                    this.gameStop = true;
                    this.board.className = ("you-lose");
                }
            }
            //BlOCK VERTICAL COLLISIONS WITH PLAYER
            if (this.player.verticalPosition === e.height) {
                if (this.player.horizontalPosition + this.player.width >= e.horizontalPosition
                    && this.player.horizontalPosition <= e.horizontalPosition + e.width) {

                    console.log("enemy killed");
                    this.removeEnemy(this.enemyArray.indexOf(e));
                }
            }
            //BLOCKS LATERAL COLLISSIONS WITH BOX--it works , but it would be cool to add that if a box crush an enemy the enemy gets deleted.
            this.boxArray.forEach((b) => {
                if (b.verticalPosition <= e.height &&
                    b.horizontalPosition <= e.horizontalPosition + e.width &&
                    b.horizontalPosition + b.width >= e.horizontalPosition) {

                    if (e.direction === "left") {
                        e.direction = "right";
                        e.blockElement.classList.add("swap")
                    } else {
                        e.direction = "left";
                        e.blockElement.classList.remove("swap")
                    }
                }
            })
        })
    }
    checkForBoxPile() {
        this.boxArray.forEach((b) => {
            if (b.isFalling) {
                this.floorBoxes.forEach((f) => {
                    if (
                        b.horizontalPosition < f.horizontalPosition + f.width &&
                        b.horizontalPosition + b.width > f.horizontalPosition) {

                        if (b.verticalPosition < f.verticalPosition + f.height) {
                            b.isFalling = false;

                            b.boxElement.style.bottom = `${f.verticalPosition + f.height}px`;
                            this.floorBoxes.push(b)

                            //check when a box is almost touching the vertical limit to stop adding boxes for garanting an upper space to cross them

                            if (b.verticalPosition + b.height >= this.boardHeight - b.height * 2) {//this can be a modificable variable inside game 
                                this.stopBox = true;
                            }
                        }
                    }
                });
            }
        });
    }
    removeEnemy(e) {
        this.enemyArray[e].blockElement.remove();
        this.enemyArray.splice(e, 1);
        this.kills += 1;
        info.innerText = `KILLS ${this.kills}`;
        console.log("enemy removed");
    }
    addVictory() {
        const victoryElement = document.createElement("div");
        victoryElement.className = "victory";
        const victory = new InteractionBox(this.boardWidth, this.boardHeight, victoryElement);

        this.victoryDoor = victory;
        this.board.appendChild(victoryElement);
    }
    checkPlayerBoxCollisions() {
        this.boxArray.forEach((e) => {
            if (this.player.verticalPosition + this.player.height > e.verticalPosition) { //if i uncoment this, you can go under the boxes, but pilling is messed
                //we check that we are not under the box

                if (
                    this.player.horizontalPosition < e.horizontalPosition + e.width &&
                    this.player.horizontalPosition + this.player.width > e.horizontalPosition &&
                    this.player.verticalPosition < e.verticalPosition + e.height) {
                    //we check if there is a collission)
                          
                    if (this.player.horizontalPosition < e.horizontalPosition + e.width &&
                        this.player.horizontalPosition + this.player.width > e.horizontalPosition) {
                            console.log("lateral collision:");
                            
                        if (this.player.horizontalPosition <= e.horizontalPosition) {
                            console.log("we are on the left"),
                            this.player.horizontalPosition = e.horizontalPosition - this.player.width;
                        }
                        else if (this.player.horizontalPosition >= e.horizontalPosition) {
                            console.log("we are on the right");
                            this.player.horizontalPosition = e.horizontalPosition + e.width;
                        }
                    }
                  
                }
            }
            /*
            //if we are under it..
            if ( this.player.verticalPosition + this.player.height === e.verticalPosition &&

                this.player.horizontalPosition < e.horizontalPosition + e.width &&
                this.player.horizontalPosition + this.player.width > e.horizontalPosition 
                ) {
                    console.log("--------------------------------------------")

                    this.player.verticalPosition = e.verticalPosition - this.player.height;
                    console.log("we are on under")



                    if ( this.player.verticalPosition === e.verticalPosition +e.height){
                    console.log("we are on top")
                    this.player.verticalPosition = e.verticalPosition +e.height;
                }
            }

*/


        });
    }

    changeBackground() {
        if (this.player.horizontalPosition + this.player.width / 2 > this.boardWidth) {

            this.level += 1;
            this.player.horizontalPosition = 0;
            this.player.playerElement.style.left = `${this.horizontalPosition}px`;


            if (this.level === 2) {

                levelInfo.innerText = `LEVEL ${this.level}`;
                this.board.className = "background2";

                this.enemyArray.forEach((e) => {
                    e.speed += 2;
                })
                this.boxArray.forEach((e) => {
                    e.boxElement.remove();

                })
                this.boxArray = [];
                this.floorBoxes = [];
                this.addBox();

            } else if (this.level === 3) {
                levelInfo.innerText = `LEVEL ${this.level}`;
                this.board.className = "background3";

                this.enemyArray.forEach((e) => {
                    e.speed = 8;
                })

                this.boxArray.forEach((e) => {
                    e.boxElement.remove();
                })
                this.boxArray = [];
                this.floorBoxes = [];
                this.addBox();
                game.addVictory();
                this.addBox();

                //add right side limit?
            } else {
                //add epilectic background?
            }
        }
    }

}

let game = new Game;

document.addEventListener("keydown", (e) => {
    game.movement(e);
    game.interaction(e);

})
//we need to make arrowfunction in order to acces things inside objects!!!!

let frames = 0;

function animate() {
    frames++;
    game.checkForBoxPile();
    game.checkForCollissions();
    game.checkPlayerBoxCollisions();
    game.gravity();
    game.moveEnemy();
    game.changeBackground();
    if (frames === 1) {
        //game.addEnemy();
        game.addBox();
    }
    if (frames % 5000 === 0) {
        game.addEnemy();
    }
    if (frames % 100 === 0) {
        game.addBox();
    }


    if (!game.gameStop) {
        animationId = requestAnimationFrame(animate);
    }else{
        game.boxArray.forEach((e) => {
            e.boxElement.remove();
        })
        game.boxArray = [];
        game.enemyArray.forEach((e) => {
            e.blockElement.remove();
        })
        game.boxArray = [];
        game.player.playerElement.remove();
        game.victoryDoor.interactionBoxElement.remove();
        info.remove();
        levelInfo.remove();
    }


}
animate();