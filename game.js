
const body = document.querySelector("body");



class Game {
    constructor() {
        this.board = document.querySelector("#board");
        this.boardWidth = board.clientWidth;
        this.boardHeight = board.clientHeight;

        this.gameStop = false;
        this.enemyArray = [];
        this.level = 1;
        this.player = new Player(this.boardWidth,this.boardHeight);


        //console.log(    ); 
    }
    movement(e){
        if (!this.gameStop) {
           this.player.move(e);  
        }
    }

    gravity(){
        this.player.fall();
    }

    addEnemy(){
        const newElement = document.createElement("div")
        newElement.className = "enemy";

        const enemy = new Block(this.boardWidth, this.boardHeight, newElement);
        this.enemyArray.push(enemy);
        this.board.appendChild(newElement);
    }
    checkForCollissions(){
        this.enemyArray.forEach((e) =>{
                
            if (this.player.verticalPosition <= e.height){//check ifplayer its jumping over it
                
                if(this.player.horizontalPosition + this.player.width >= e.horizontalPosition 
                    && this.player.horizontalPosition <= e.horizontalPosition +e.width){

                console.log(
                    "colision",
                    "player left: ",this.player.horizontalPosition,
                    "player right: ",this.player.horizontalPosition +this.player.width,
                    "block left: ", e.horizontalPosition,
                    "block right: ", e.horizontalPosition + e.width);
                this.gameStop = true;
                }
            }
        })
        

    }

}

let game = new Game;

document.addEventListener("keydown",(e) => game.movement(e))
//we need to make arrowfunction in order to acces things inside objects!!!!

let frames = 0;

function animate(){
    frames ++;
   game.checkForCollissions();
    game.gravity();
    game.enemyArray.forEach((e)=>{
        e.move();
    })
    if (frames === 1){
        game.addEnemy();
    }
    if (frames % 1000 === 0){
        game.addEnemy();
    }


    if(!game.gameStop){
        animationId = requestAnimationFrame(animate);
    }


}
animate();