
const body = document.querySelector("body");
const info = document.querySelector("#info");


class Game {
    constructor() {
        this.board = document.querySelector("#board");
        this.boardWidth = board.clientWidth;
        this.boardHeight = board.clientHeight;

        this.gameStop = false;
        this.enemyArray = [];
        this.boxArray = [];
        this.floorBoxes = [];
        this.totalLevels = 3;
        this.level = 1;
        this.player = new Player(this.boardWidth, this.boardHeight);
        this.kills = 0;

    }
    movement(e) {
        if (!this.gameStop) {
            this.player.move(e);
            /* //intentava cridar aqui lo de cambiar les  classes, per si desde dins el objecte playey (funcio move()) no podia llegirho
            if(e.key === "ArrowRight"){
                this.player.playerElement.classList.remove("player-going-left")
                this.player.playerElement.classList.add("player-going-right")
            }
            else if (e.key === "ArrowLeft"){
                this.playerElement.classList.remove("player-going-right");
                this.playerElement.classList.add("player-going-left");
            }   */
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
        const newBoxElement = document.createElement("div");
        newBoxElement.className = "box";

        const box = new Box(this.boardWidth, this.boardHeight, newBoxElement);
        this.boxArray.push(box);
        this.board.appendChild(newBoxElement)


    }



    checkForCollissions() {

        this.enemyArray.forEach((e) => {
            //BLOCK LATERAL COLLISIONS WITH PLAYER
            if (this.player.verticalPosition < e.height) {//check if player its jumping over it

                if (this.player.horizontalPosition + this.player.width >= e.horizontalPosition
                    && this.player.horizontalPosition <= e.horizontalPosition + e.width) {
                    /* console.log("player left: ", this.player.horizontalPosition,
                                 "player right: ", this.player.horizontalPosition + this.player.width,
                                 "block left: ", e.horizontalPosition,
                                 "block right: ", e.horizontalPosition + e.width);*/
                    this.gameStop = true;
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
                    } else {
                        e.direction = "left";
                    }
                }
            })
        })
    }
    checkForBoxPile() { // si la crides peta  


        
        this.boxArray.forEach((b) => {
            if (b.isFalling) {
                this.floorBoxes.forEach((f) => {
                    console.log(f,b);


                    // COLLISSION DETECTION STANDARD ALGORITHM (SQUARE VS SQUARE)
                 /*    if (
                        b.horizontalPosition < f.horizontalPosition + f.width &&
                        b.horizontalPosition + b.horizontalPosition.width > f.horizontalPosition &&
                        b.verticalPosition < f.verticalPosition + f.height &&
                        b.verticalPosition + b.height > f.verticalPosition
                    ) {
                        console.log('COLLISSION DETECTED');
                    } */


                       if (
                           b.horizontalPosition < f.horizontalPosition + f.width &&
                           b.horizontalPosition + b.width > f.horizontalPosition
                       ) {
                           if (b.verticalPosition < f.verticalPosition + f.height) {
                               b.isFalling = false;
                               b.boxElement.style.bottom = `${f.verticalPosition + f.height}px`;
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
        info.innerText = `${this.kills}KILLS`;
        console.log("enemy removed");
    }
    addVictoryPoint() {
        const victory = document.createElement("div");
        victory.className = "victory-point";
        victory.style.left = this.boardWidth - victory.width;
        this.board.appendChild(victory);
    }

}

let game = new Game;

document.addEventListener("keydown", (e) => game.movement(e))
//we need to make arrowfunction in order to acces things inside objects!!!!

let frames = 0;

function animate() {
    frames++;
    game.checkForBoxPile();//si la crides peta
    game.checkForCollissions();
    game.gravity();
    game.moveEnemy();
    if (frames === 1) {
        game.addEnemy();
        //game.addVictoryPoint();
    }
    if (frames % 100 === 0) {
        game.addEnemy();

    }
    if (frames % 100 === 0) {

        game.addBox();
    }


    if (!game.gameStop) {
        animationId = requestAnimationFrame(animate);
    }


}
animate();