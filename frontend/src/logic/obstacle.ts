import rocket from './rocket';
import { CANVAS_W } from './constants';
import { CANVAS_H } from './constants';
export default class obstacle{
    x: number;
    top: number;
    bottom: number;
    width: number;
    gap: number;
    speed: number;
    passed: boolean;

    constructor(){
        this.gap = 150;
        this.width = 60;
        this.top = Math.random()*(CANVAS_H - this.gap - 100) + 50;
        this.bottom = CANVAS_H - (this.top + this.gap);
        this.x = CANVAS_W;
        this.speed = 5;
        this.passed = false;
    }
    show(ctx: CanvasRenderingContext2D){
        ctx.fillStyle = '#47c7a5';
        ctx.fillRect(this.x, 0, this.width, this.top);
        ctx.fillRect(this.x, CANVAS_H - this.bottom, this.width, this.bottom);
    }
    update(){
        this.x -= this.speed;
    }
    offscreen(){
        return (this.x < -this.width);
    }

    hits(rocket: rocket){
        let rLeft = rocket.x;
        let rRight = rocket.x + rocket.width;
        let rTop = rocket.y;
        let rBottom = rocket.y + rocket.height;

        let tLeft = this.x;
        let tRight = this.x + this.width;
        let tTopY= this.top;
        let tBottomY = CANVAS_H - this.bottom;

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

    getData(){
        return{
            x: this.x,
            top: this.top,
            bottom: CANVAS_H - this.bottom,
            center: this.top + (this.gap / 2)
        };
    }
}