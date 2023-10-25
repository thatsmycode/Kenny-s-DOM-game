class Player {
    constructor(BoardWidth, BoardHeight){
        this.horizontalPosition = 0;
        this.verticalPosition = 0;
        this.playerElement = document.querySelector("#player");
        this.speed = 5;      
        this.playerElement.classList.add("player-going-right");
        this.height=30;
        this.width=22;
        this.playerElement.style.height = `${this.height}px`;
        this.playerElement.style.width = `${this.width}px`;
        this.boardWidth = BoardWidth;
        this.boardHeight = BoardHeight;

    }
    move(e){
        if(e.key === "ArrowRight"){

            this.horizontalPosition += this.speed;
            if(this.horizontalPosition >= this.boardWidth){
                this.horizontalPosition = 0;
            }
        }else if(e.key === "ArrowLeft"){
            this.horizontalPosition -= this.speed;  
           
            if(this.horizontalPosition <= 0){
                this.horizontalPosition = 0;
            }           
        }      
        if(e.key === "ArrowUp" ){
            
            this.verticalPosition += 70;
            if(this.verticalPosition + this.height >= this.boardHeight){ //until the roof ?
                this.verticalPosition = this.boardHeight - this.height;
            }
        }
        this.playerElement.style.left = `${this.horizontalPosition}px`;
        this.playerElement.style.bottom = `${this.verticalPosition}px`;


    }
    fall(){
        this.verticalPosition -= 2;
        if(this.verticalPosition <= 0){
            this.verticalPosition = 0;
        }  
        this.playerElement.style.bottom = `${this.verticalPosition}px`; 
        
    }


}

class Block {
    constructor(BoardWidth, BoardHeight, element){   
        this.width=32;
        this.height=30;
        this.verticalPosition = 0;
        this.horizontalPosition = BoardWidth - this.width;
        this.speed = 1;
        this.direction = "left";
        this.blockElement = element;
        this.boardWidth = BoardWidth;
        this.boardHeight = BoardHeight;
        this.blockElement.style.bottom=`${this.verticalPosition}px`;
        this.blockElement.style.left=`${this.horizontalPosition}px`;
        this.blockElement.style.width=`${this.width}px`;
        this.blockElement.style.height=`${this.height}px`;
        
        
    }
    move(){
        if(this.direction === "left"){                        
            this.horizontalPosition -= this.speed;
            if(this.horizontalPosition <= 0){
                this.direction= "right";
                this.blockElement.classList.add("swap");
            }

        }else{           
            this.horizontalPosition += this.speed;
            if (this.horizontalPosition >= this.boardWidth - this.width){
                this.direction ="left";
                this.blockElement.classList.remove("swap");
            }
        }
        this.blockElement.style.left=`${this.horizontalPosition}px`;


    }
}

class Box {
    constructor(BoardWidth,BoardHeight,element){
        this.boxElement = element;
        this.boardWidth = BoardWidth;
        this.boardHeight = BoardHeight;
        this.width = 60;
        this.height = 60;
        this.isFalling = true;
        this.verticalPosition = BoardHeight;
        this.horizontalPosition = Math.floor(Math.random() * (BoardWidth - this.width));
        this.boxElement.style.width=`${this.width}px`;
        this.boxElement.style.height=`${this.height}px`;
        
    }

    fall(floorBoxes){
        if (this.isFalling){
            
            this.verticalPosition -= 2;
                     
            if(this.verticalPosition <= 0){
                this.verticalPosition = 0;
                this.isFalling = false;
                floorBoxes.push(this);

            } 
    
        this.boxElement.style.bottom = `${this.verticalPosition}px`; 
        this.boxElement.style.left = `${this.horizontalPosition}px`; 
        }
    }
}


class InteractionBox  {
    constructor( boardWidth,  boardHeight,element){
        this.interactionBoxElement = element;
        this.width=60;
        this.height=60;
        this.verticalPosition=( Math.floor(Math.random() * (boardHeight -this.height+1.5)));
        this.horizontalPosition =  boardWidth -this.width * 1.5;
        this.interactionBoxElement.style.bottom = `${this.verticalPosition}px`; 
        this.interactionBoxElement.style.left = `${this.horizontalPosition}px`; 
        isOpened: false;
    }
    open(e){
        console.log(e.key)
        if (e.key === " "){
        console.log("interactionBox opened!");
        this.isOpened = true;
        confetti();
        }
        return this.isOpened;
    }
}