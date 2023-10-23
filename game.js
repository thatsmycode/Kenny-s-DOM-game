
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

}



let game = new Game;

document.addEventListener("keydown",(e) => game.movement(e))
//we need to make arrowfunction in order to acces things inside objects!!!!

let frames = 0;

function animate(){
    frames ++;
    console.log(frames);
    game.gravity();
    game.enemyArray.forEach((e)=>{
        e.move();
    })
    if (frames % 1000 === 0){
        game.addEnemy();
    }

    if(!game.gameStop){
        animationId = requestAnimationFrame(animate);
    }


}
animate();