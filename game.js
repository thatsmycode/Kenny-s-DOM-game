
const body = document.querySelector("body");



class Game {
    constructor() {
        this.board = document.querySelector("#board");
        this.boardWidth = board.clientWidth;
        this.boardHeight = board.clientHeight;

        this.gameStop = false;
        this.enemyArray = [];
        this.boxArray = [];

        this.level = 1;
        this.player = new Player(this.boardWidth,this.boardHeight);
        this.kills = 0;

        //console.log(    ); 
    }
    movement(e){
        if (!this.gameStop) {
           this.player.move(e);  
        }
    }

    gravity(){
        this.player.fall();
        this.boxArray.forEach((e)=>{
            e.fall();
        })
    }

    addEnemy(){
        const newElement = document.createElement("div");
        newElement.className = "enemy";

        const enemy = new Block(this.boardWidth, this.boardHeight, newElement);
        this.enemyArray.push(enemy);
        this.board.appendChild(newElement);
    }
    addBox(){
        const newBoxElement = document.createElement("div");
        newBoxElement.className = "box";

        const box = new Box(this.boardWidth, this.boardHeight, newBoxElement);
        this.boxArray.push(box);
        this.board.appendChild(newBoxElement)
    }



    checkForCollissions(){
        this.enemyArray.forEach((e) =>{
            //BLOCK LATERAL COLLISIONS WITH PLAYER
            if (this.player.verticalPosition < e.height){//check if player its jumping over it
                
                if(this.player.horizontalPosition + this.player.width >= e.horizontalPosition 
                    && this.player.horizontalPosition <= e.horizontalPosition + e.width){

                    console.log(
                        "colision",
                        "player left: ",this.player.horizontalPosition,
                        "player right: ",this.player.horizontalPosition +this.player.width,
                        "block left: ", e.horizontalPosition,
                        "block right: ", e.horizontalPosition + e.width);
                    
                        this.gameStop = true;
                }
            }

            //BlOCK VERTICAL COLLISIONS WITH PLAYER
            if ( this.player.verticalPosition === e.height){

                if(this.player.horizontalPosition + this.player.width >= e.horizontalPosition 
                    && this.player.horizontalPosition <= e.horizontalPosition + e.width){
                    
                        console.log("enemy killed");
                        this.removeEnemy(this.enemyArray.indexOf(e));
                }
            }
            //BLOCKS LATERAL COLLISSIONS WITH BOX

            //if( )


        })
    }
    removeEnemy(e){
        this.enemyArray[e].blockElement.remove();
        this.enemyArray.splice(e,1);
        this.kills += 1;        
        console.log("enemy removed");
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
        game.addBox();
    }
    if (frames % 1000 === 0){
        game.addEnemy();
    }


    if(!game.gameStop){
        animationId = requestAnimationFrame(animate);
    }


}
animate();