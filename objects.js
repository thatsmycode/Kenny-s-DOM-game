class Player {
    constructor(BoardWidth, BoardHeight){
        this.horizontalPosition = 0;
        this.verticalPosition = 0;
        this.playerElement = document.querySelector("#player");
        this.speed = 5;
        this.isJumping =false;
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

            console.log(e);

            this.playerElement.classList.remove("player-going-left")
            this.playerElement.classList.add("player-going-right")

            this.horizontalPosition += this.speed;
            if(this.horizontalPosition >= this.boardWidth){
                this.horizontalPosition = 0;
            }
        }else if(e.key === "ArrowLeft"){

            this.playerElement.classList.remove("player-going-right")
            this.playerElement.classList.add("player-going-left")

            this.horizontalPosition -= this.speed;  
           
            if(this.horizontalPosition <= 0){
                this.horizontalPosition = 0;
            }           
        }
        
        if(e.key === "ArrowUp" && !this.isJumping){
            //this.isJumping = true;
            this.verticalPosition += 80;
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
        this.isJumping = false;
    }


}