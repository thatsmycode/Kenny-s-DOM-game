
const body = document.querySelector("body");
const info = document.querySelector("#info");


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
            if(e.key === "ArrowRight"){
                this.player.playerElement.classList.remove("player-going-left")
                this.player.playerElement.classList.add("player-going-right")
            }
            else if (e.key === "ArrowLeft"){
                this.player.playerElement.classList.remove("player-going-right");
                this.player.playerElement.classList.add("player-going-left");
            }   
        }
    }
    interaction(e){
        if (this.player.verticalPosition >= this.victoryDoor.verticalPosition &&
            this.player.horizontalPosition < this.victoryDoor.horizontalPosition + this.victoryDoor.width &&
            this.player.horizontalPosition + this.player.width > this.victoryDoor.horizontalPosition&&
            this.player.verticalPosition < this.victoryDoor.verticalPosition + this.victoryDoor.height
            ){
            console.log("you can interact!");
                    this.victoryDoor.open(e)// this returns undefined
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
    addBox(){
        if(!this.stopBox){
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
                    /* console.log("player left: ", this.player.horizontalPosition,
                                 "player right: ", this.player.horizontalPosition + this.player.width,
                                 "block left: ", e.horizontalPosition,
                                 "block right: ", e.horizontalPosition + e.width);*/
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
                        b.horizontalPosition + b.width > f.horizontalPosition){

                        if (b.verticalPosition < f.verticalPosition + f.height) {
                            b.isFalling = false;

                            b.boxElement.style.bottom = `${f.verticalPosition + f.height}px`;
                            this.floorBoxes.push(b)
                            
                            //check when a box is almost touching the vertical limit to stop adding boxes for garanting an upper space to cross them

                            if (b.verticalPosition + b.height >= this.boardHeight - b.height * 2){//this can be a modificable variable inside game 
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
        const victory = new InteractionBox( this.boardWidth, this.boardHeight,victoryElement);
        
        this.victoryDoor = victory;
        this.board.appendChild(victoryElement);
    }
    checkPlayerBoxCollisions(){
        this.boxArray.forEach((e) => {
            if (
                this.player.horizontalPosition < e.horizontalPosition + e.width &&
                this.player.horizontalPosition + this.player.width > e.horizontalPosition&&
                this.player.verticalPosition < e.verticalPosition + e.height
                ){
                    //console.log("player-box-colie")
  
                    const playerCenterX = this.player.horizontalPosition + this.player.width / 2;
                    const boxCenterX = e.horizontalPosition + e.width / 2;
        
                    const playerTopY = this.player.verticalPosition;
                    const playerBottomY = this.player.verticalPosition + this.player.height;
                    const boxTopY = e.verticalPosition;
                    const boxBottomY = e.verticalPosition + e.height;
        
                    // Calculate the overlap on each side
                    const overlapLeft = playerCenterX - boxCenterX - e.width / 2;
                    const overlapRight = boxCenterX - playerCenterX - this.player.width / 2;
                    const overlapTop = playerBottomY - boxTopY;
                    const overlapBottom = boxBottomY - playerTopY;
        
                    if (Math.abs(overlapLeft) < Math.min(overlapRight, overlapTop, overlapBottom)) {
                        // Left side collision
                        console.log("Left side collision");
                        this.player.horizontalPosition -= overlapLeft;
                    } else if (Math.abs(overlapRight) < Math.min(overlapLeft, overlapTop, overlapBottom)) {
                        // Right side collision
                        console.log("Right side collision");
                        this.player.horizontalPosition += overlapRight;
                    } else if (overlapTop < overlapLeft && overlapTop < overlapRight && overlapTop < overlapBottom) {
                        // Top side collision
                        console.log("Top side collision");
                        this.player.verticalPosition -= overlapTop;
                    } else {
                        // Bottom side collision
                        console.log("Bottom side collision");
                        this.player.verticalPosition += overlapBottom;
                    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////777
                  /* if(this.player.verticalPosition === e.verticalPosition +e.height){
                        console.log("is this working? vertical collies?");

                    this.player.playerElement.style.bottom = `${e.verticalPosition + e.height - this.player.width}px`;
                   }

                    if(this.player.horizontalPosition +
                    this.player.width >= e.horizontalPosition){ //THIS ONE KIND OF WORKS ONLY ON THE LEFT
                        console.log("left-right collie");
                    this.player.playerElement.style.left = `${e.horizontalPosition - this.player.width}px`;
                   }*/


                }

        });
    }
    
    changeBackground(){//NOT WORKING
        if(this.player.horizontalPosition + this.player.width/2 > this.boardWidth ){
            
            this.level += 1;
            this.player.horizontalPosition = 0;
            this.player.playerElement.style.left=`${this.horizontalPosition}px`;
            console.log(this.level)
            if(this.level === 2){
                this.board.className="background2";
                this.enemyArray.forEach((e) =>{
                    e.speed += 2;
                })
                this.boxArray.forEach((e) =>{
                    e.boxElement.remove();
                })
                this.addBox();
            }else if(this.level ===3){
                this.board.className="background3";
                
                this.enemyArray.forEach((e) =>{
                    e.speed = 8;
                })
                this.boxArray.forEach((e) =>{
                    e.boxElement.remove();
                })
                this.addBox();
                this.addBox();
            }else{

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
        game.addEnemy();
        game.addVictory();
        game.addBox();
    }
    if (frames % 5000 === 0) {
        game.addEnemy();

    }
    if (frames % 4000 === 0) {

        game.addBox();
    }


    if (!game.gameStop) {
        animationId = requestAnimationFrame(animate);
    }


}
animate();