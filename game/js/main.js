// let cohete; // Declaración de la variable global para el cohete
let obstacles = []; // Declaración de la variable para los obstaculos
let puntuacion;

// Variables red neuronal
const TOTAL = 25
let cohetes = [];
let cohetesMuertos = [];
let frames = 0;
let generacion = 1;

function setup () {
    createCanvas(750, 500); // Creación de canvas implementando la librería p5.jse
   
    for (let i = 0; i < TOTAL; i++) {
        cohetes.push(new rocket(200, height/2, i)); // Inicialización de los cohetes
    }

    // Se añade al array de obstáculos un nuevo obstaculo al cargar el juego
    puntuacion = new Score(1);
    obstacles.push(new obstacle());
}

function draw () {
    background(0); 
    frames++; 

    if(frames % 100 == 0){
        obstacles.push(new obstacle());
    }

    // Dibujar y actualizar obstáculos
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].show();
        obstacles[i].update();
        if(obstacles[i].offscreen()){
            obstacles.splice(i, 1);
        }
    }

    // Buscar el obstáculo más cercano
    let closest = null;
    let record = Infinity;
    for (let i = 0; i < obstacles.length; i++) {
        let distance = (obstacles[i].x + obstacles[i].width) - 200; 
        if (distance > 0 && distance < record) {
            record = distance;
            closest = obstacles[i];
        }
    }
    const candidates = [];
    if (closest) {
        const idx = obstacles.indexOf(closest);
        candidates.push(closest);
        if (idx + 1 < obstacles.length) candidates.push(obstacles[idx + 1]);
    }

    if (frames % 8 === 0 && closest) {
        const oData = closest.getData();

        for (let i = 0; i < cohetes.length; i++) {
            const c = cohetes[i];

            tf.tidy(() => {
                const xs = tf.tensor2d([[
                    c.y / height,
                    c.velocity / 10,
                    oData.x / width,
                    oData.center / height
                ]]);

                const ys = c.brain.predict(xs);
                const out = ys.dataSync()[0];

                if (out > 0.5) c.jump();
            });
        }
    }

    // Actualizar Cohetes
    for (let i = cohetes.length - 1; i >= 0; i--) {
        let c = cohetes[i];

        c.update(height);
        c.show();

        let hitObstacle = false;
        for (let obs of candidates) {
            if (obs.hits(c)) {
                hitObstacle = true;
                break;
            }
        }

        // Muere si: toca obstáculo O toca el suelo (y + alto > height) O toca el techo (y < 0)
        if (hitObstacle || (c.y + c.height) >= height || c.y <= 0) {
            cohetesMuertos.push(cohetes.splice(i, 1)[0]);
        }
    }

    if (cohetes.length === 0) {
        nextGeneration();
        generacion++;
        frames = 0;
        obstacles = [];
        obstacles.push(new obstacle());
    }
}

function nextGeneration() {
    
    // Encontrar el mejor cohete de la generación anterior (opcional, pero útil para seguimiento)
    let elMejor = cohetesMuertos.reduce((prev, current) =>{
        return (current.score > prev.score) ? current : prev;
    });

    cohetes = [];

    for (let i = 0; i < TOTAL; i++){
        let cerebroCopiado = tf.tidy(() => elMejor.copy());

        let nuevoHijo = new rocket(200, height/2, i, cerebroCopiado);
        
        if(i>0){
            nuevoHijo.mutate(0.2);
        }
        cohetes.push(nuevoHijo);
    }
    for (let c of cohetesMuertos){
        c.brain.dispose();
    }
    cohetesMuertos = [];
}