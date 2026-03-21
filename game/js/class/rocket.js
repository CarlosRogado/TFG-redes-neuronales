class rocket {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 20;
        this.gravity = 0.6;
        this.velocity= 0;
        this.lift = 10;
        this.id = id; // ID único para cada cohete
    }

    // Funcíon que implementa la librería p5.js para mostrar el cohete
    show() {
        // Mostrar cohete
        fill(255, 0, 0); // Color del cohete (Rojo)
        rect(this.x, this.y, this.width, this.height); // Dibujar el cohete como un rectángulo
    }

    update(height) {
        // Actualizar posición del cohete

        this.velocity += this.gravity; // Aplicar gravedad
        this.y += this.velocity; // Actualizar posición vertical

         // BORRAR AL FINAL Controlar el error de que el cohete se caiga por debajo del suelo 
        if (this.y > height) {
            this.y = height - this.height; // Para evitar que el cohete se caiga por debajo del suelo
            this.velocity = 0; // Simular el rebote al tocar el suelo
        }

        // Controlar el error de que el cohete salga por encima del techo
        if (this.y < 0) {
            this.y = 0; // Para evitar que el cohete salga por encima del techo
            this.velocity = 0; // Simular el rebote al tocar el techo
        }
    }   

    jump() {
        // Aplicar impulso para saltar
        this.velocity = -this.lift; 
    }

    getData() {
        return {
            x: this.x,
            y: this.y,
            velocity: this.velocity
        };
    }
}