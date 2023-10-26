
const body = document.querySelector("body");
const info = document.querySelector("#info");
const levelInfo = document.querySelector("#level");
const help = document.querySelector("#help");
const restart = document.querySelector("#restart");
const exit = document.querySelector("#exit");
const killSound = document.querySelector("#effect");
const music = document.querySelector("#music");
const trumpets = document.querySelector("#trumpets");

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
            /*
//this feature is not being used now, we display the same picture when caracter goes left or right, BUT IT WORKS and have the css classes done.

            if (e.key === "ArrowRight") {
                this.player.playerElement.classList.remove("player-going-left")
                this.player.playerElement.classList.add("player-going-right")
            }
            else if (e.key === "ArrowLeft") {
                this.player.playerElement.classList.remove("player-going-right");
                this.player.playerElement.classList.add("player-going-left");
            }*/
        }
    }
    interaction(e) {
        if (!this.victoryDoor) {
            if (e.key === " ") {
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


                help.innerText = "Press 'Space' to open the door"


                setTimeout(() => {
                    help.innerText = "Good luck Kenny!";
                }, 500)

                if (this.victoryDoor.open(e)) {
                    music.pause();
                    trumpets.play();
                    this.boxArray.forEach((e) => {
                        e.boxElement.remove();
                    })
                    this.enemyArray.forEach((e)=>{
                        e.blockElement.remove();
                    })
                    this.player.playerElement.remove();
                    this.boxArray = [];
                    this.floorBoxes = [];
                    this.enemyArray = [];
                    setTimeout(() => {
                        help.innerText = "WELCOME, YOU WON!";
                    }, 900)
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
        let enemy;
        if (this.level === 1) {
            enemy = new Block(this.boardWidth, this.boardHeight, newElement, 1);
        }
        else if (this.level === 2) {
            enemy = new Block(this.boardWidth, this.boardHeight, newElement, 3);
        }
        else if (this.level === 3) {
            enemy = new Block(this.boardWidth, this.boardHeight, newElement, 5);
        }
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
        if (this.enemyArray.length > 0) {
            this.enemyArray.forEach((e) => {

                //BLOCK LATERAL COLLISIONS WITH PLAYER
                if (this.player.verticalPosition < e.height) {//check if player its jumping over it

                    if (this.player.horizontalPosition + this.player.width >= e.horizontalPosition
                        && this.player.horizontalPosition <= e.horizontalPosition + e.width) {

                        music.src = "./sound/Cursed Forest Soundscape.wav";
                        this.gameStop = true;
                        this.board.className = ("you-lose");
                    }
                }
                //BlOCK VERTICAL COLLISIONS WITH PLAYER
                if (this.player.verticalPosition === e.height) {
                    if (this.player.horizontalPosition + this.player.width >= e.horizontalPosition
                        && this.player.horizontalPosition <= e.horizontalPosition + e.width) {
                        killSound.play();
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

            if (this.player.verticalPosition >= e.verticalPosition + e.height &&
                this.player.verticalPosition <= e.verticalPosition + e.height + 3) {

                console.log(this.player.verticalPosition, "posicio inicial")
                console.log(e.horizontalPosition, "box-left")
                console.log( e.horizontalPosition + e.width, "box-right")
                if (
                    this.player.horizontalPosition < e.horizontalPosition + e.width &&
                    this.player.horizontalPosition + this.player.width > e.horizontalPosition) {

                    this.player.verticalPosition = e.verticalPosition + e.height;
                    this.player.isGrounded = true;

                    console.log(this.player.verticalPosition, "posicio modificada")

                }else{
                    console.log("where am I?");
                    this.player.isGrounded=false;
                }
                
                
            }
            
            /* else if(this.player.verticalPosition === e.verticalPosition + e.height){
                
                if (this.player.horizontalPosition > e.horizontalPosition + e.width ||
                    this.player.horizontalPosition + this.player.width < e.horizontalPosition) {

                        console.log(this.player.horizontalPosition, "player left")
                        console.log(this.player.horizontalPosition + this.player.width, "player right")
                        
                        this.player.isGrounded=false;
                    }
            } */


            if (this.player.verticalPosition + this.player.height > e.verticalPosition) {
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
                            //console.log("we are on the left"),
                            this.player.horizontalPosition = e.horizontalPosition - this.player.width;
                        }
                        else if (this.player.horizontalPosition >= e.horizontalPosition) {
                            //console.log("we are on the right");
                            this.player.horizontalPosition = e.horizontalPosition + e.width;
                        }
                    }

                }

            }
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


                this.boxArray.forEach((e) => {
                    e.boxElement.remove();

                })
                this.boxArray = [];
                this.floorBoxes = [];
                this.addBox();

            } else if (this.level === 3) {
                levelInfo.innerText = `LEVEL ${this.level}`;
                this.board.className = "background3";

                this.boxArray.forEach((e) => {
                    e.boxElement.remove();
                })
                this.boxArray = [];
                this.floorBoxes = [];
                this.addBox();
                game.addVictory();
                this.addBox();


            }
        }
    }

}

let game = new Game;

setTimeout(() => {
    help.innerText = "4";
}, 1000)
setTimeout(() => {
    help.innerText = "3";
}, 2000)
setTimeout(() => {
    help.innerText = "2";
}, 3000)
setTimeout(() => {
    help.innerText = "1";
}, 3900)
setTimeout(() => {
    help.innerText = "Good luck Kenny!";
}, 4400)

const activateEventListener = () => {
    document.addEventListener("keydown", (e) => {
        game.movement(e);
        game.interaction(e);
    })
    //we need to make arrowfunction in order to acces things inside objects!!!!

}
setTimeout(activateEventListener, 4500)

restart.addEventListener("click", () => {
    location.reload()
})

exit.addEventListener("click", () => {
    close();
});


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
       // game.addEnemy();
        game.addBox();
       
        
    }
    if (frames % 400 === 0) {
        game.addEnemy();
        
    }
    else if (frames % 1100 === 0) {
        game.addBox();
    }
    if (game.level === 2) {

        if (frames % 500 === 0) {
            game.addEnemy();
        }
        else if (frames % 700 === 0) {

            game.addBox();
        }
    }
    else if (game.level === 3) {
        if (frames % 500 === 0) {
            game.addEnemy();
        }
        else if (frames % 100 === 0) {
            game.addBox();
        }
    }
    if (!game.gameStop) {
        animationId = requestAnimationFrame(animate);
    } 
}
animate();


