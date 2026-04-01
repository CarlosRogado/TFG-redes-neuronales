class obstacle{
    constructor(x,y,w,h){
        // Espacio por donde pasa el cohete
        this.gap = 150;
        // Ancho del tubo
        this.width = 60;
        // Top: Altura aleatoria dejando espacio para el gap
        // Bottom: Altura del tubo inferior
        this.top = random(50, height-this.gap-50);
        this.bottom = height - (this.top + this.gap);
        // Posicion del tubo en el eje x, empieza a la derecha de la pantalla
        this.x = width;
        // Velocidad a la que se mueve medida en pixeles
        this.speed = 5;
        this.passed = false;
    }
    show(){
        fill(255,255,0);
        // Tubo superior
        rect(this.x, 0, this.width, this.top);
        // Tubo inferior
        rect(this.x, height - this.bottom, this.width, this.bottom);

        fill(255, 0, 0);
        ellipse(this.x + this.width/2, this.top + this.gap/2, 10, 10);
    }
    update(){
        // Mueve el tubo hacia la izquierda segun la velocidad
        this.x -= this.speed;
    }
    offscreen(){
        // Si el tubo se ha movido completamente fuera de la pantalla, devuelve true
        return (this.x < -this.width);
    }

    hits(rocket){
        let rLeft = rocket.x;
        let rRight = rocket.x + rocket.width;
        let rTop = rocket.y;
        let rBottom = rocket.y + rocket.height;

        let tLeft = this.x;
        let tRight = this.x + this.width;
        let tTopY= this.top;
        let tBottomY = height - this.bottom;

        if(rRight > tLeft && rLeft < tRight){
            if(rTop < tTopY || rBottom > tBottomY){
                return true;
            }
        }
        return false;
    }

    // Esto devuelve los datos para la red neuronal
    getData(){
        return{
            x: this.x,
            top: this.top,
            bottom: height - this.bottom,
            center: this.top + (this.gap / 2)
        };
    }
}