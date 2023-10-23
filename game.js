
const body = document.querySelector("body");



class Game {
    constructor() {
        this.board = document.querySelector("#board");
        this.boardWidth = board.clientWidth;
        this.boardHeight = board.clientHeight;

        this.gameStop = false;
        this.blocksArray = [];
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


}



let game = new Game;

document.addEventListener("keydown",(e) => game.movement(e))
//we need to make arrowfunction in order to acces things inside objects!!!!

function animate(){
    gravity();
    
    if(!gameStop){
        animationId = requestAnimationFrame(animate);
    }


}