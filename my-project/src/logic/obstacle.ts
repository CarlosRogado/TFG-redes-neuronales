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
        // Espacio por donde pasa el cohete
        this.gap = 150;
        // Ancho del tubo
        this.width = 60;
        // Top: Altura aleatoria dejando espacio para el gap
        // Bottom: Altura del tubo inferior
        this.top = p.random(50, p.height-this.gap-50);
        this.bottom = p.height - (this.top + this.gap);
        // Posicion del tubo en el eje x, empieza a la derecha de la pantalla
        this.x = p.width;
        // Velocidad a la que se mueve medida en pixeles
        this.speed = 5;
        this.passed = false;
    }
    show(p: p5){
        p.fill(255,255,0);
        // Tubo superior
        p.rect(this.x, 0, this.width, this.top);
        // Tubo inferior
        p.rect(this.x, p.height - this.bottom, this.width, this.bottom);
    }
    update(){
        // Mueve el tubo hacia la izquierda segun la velocidad
        this.x -= this.speed;
    }
    offscreen(){
        // Si el tubo se ha movido completamente fuera de la pantalla, devuelve true
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

        if(rRight > tLeft && rLeft < tRight){
            if(rTop < tTopY || rBottom > tBottomY){
                return true;
            }
        }
        return false;
    }

    // Esto devuelve los datos para la red neuronal
    getData(p: p5){
        return{
            x: this.x,
            top: this.top,
            bottom: p.height - this.bottom,
            center: this.top + (this.gap / 2)
        };
    }
}