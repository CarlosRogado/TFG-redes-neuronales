class Score {
    constructor(id_rocket) {
        this.score = 0;
        this.id = id_rocket;
    }

    setScore(score) {
        this.score = score;
    }
    
    getScore() {
        return this.score;
    }
    increment(){
        this.score++;
    }
    reset(){
        this.score = 0;
    }
}