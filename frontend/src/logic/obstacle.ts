import p5 from 'p5';
import rocket from './rocket';
export default class obstacle{
    x: number;
    top: number;
    bottom: number;
    width: number;
    gap: number;
    speed: number;
    passed: boolean;

    constructor(p: p5){
        this.gap = 150;
        this.width = 60;
        this.top = p.random(50, p.height-this.gap-50);
        this.bottom = p.height - (this.top + this.gap);
        this.x = p.width;
        this.speed = 5;
        this.passed = false;
    }
    show(p: p5){
        p.fill(255,255,0);
        p.rect(this.x, 0, this.width, this.top);
        p.rect(this.x, p.height - this.bottom, this.width, this.bottom);
    }
    update(){
        this.x -= this.speed;
    }
    offscreen(){
        return (this.x < -this.width);
    }

    hits(rocket: rocket, p: p5){
        let rLeft = rocket.x;
        let rRight = rocket.x + rocket.width;
        let rTop = rocket.y;
        let rBottom = rocket.y + rocket.height;

        let tLeft = this.x;
        let tRight = this.x + this.width;
        let tTopY= this.top;
        let tBottomY = p.height - this.bottom;

        if (rRight > tLeft && rLeft < tRight) {
            if(rTop < tTopY){
                rocket.causaMuerte = 'Tubo Superior';
                return true;
            }
            if(rBottom > tBottomY){
                rocket.causaMuerte = 'Tubo Inferior';
                return true;
            }
        }
        return false;
    }

    getData(p: p5){
        return{
            x: this.x,
            top: this.top,
            bottom: p.height - this.bottom,
            center: this.top + (this.gap / 2)
        };
    }
}