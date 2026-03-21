let cohete; // Declaración de la variable global para el cohete
let obstacles = []; // Declaración de la variable para los obstaculos
let gameFrameCount = 0; // Contador de frames del juego
let puntuacion;

function setup () {
    createCanvas(window.innerWidth, window.innerHeight); // Creación de canvas implementando la librería p5.jse
    cohete = new rocket(200, height / 2, 1); // Incialización cohete
    // Se añade al array de obstáculos un nuevo obstaculo al cargar el juego
    puntuacion = new Score(1);
    obstacles.push(new obstacle());
    gameFrameCount = 0;
}

function draw () {
    background(0); // Negro
    gameFrameCount++; // Incrementamos el contador de frames
    cohete.show();
    cohete.update(height);
    // Cada 100 frames se añade un nuevo obstaculo
    if(gameFrameCount % 100 == 0){
        obstacles.push(new obstacle());
    }
    // Se recorre el array de obstáculos desde el final y se van mostrando y actualizando, si el obstaculo se sale de la pantalla se elimina del array
    for( i=obstacles.length-1; i>=0; i--){
        obstacles[i].show();
        obstacles[i].update();
        if(obstacles[i].hits(cohete)){
            resetGame();
            break;
        }
        if(!obstacles[i].passed && cohete.x > obstacles[i].x + obstacles[i].width){
            obstacles[i].passed = true;
            puntuacion.increment();
            console.log("Puntuación: " + puntuacion.getScore());
        }
        
        if(obstacles[i].offscreen()){
            obstacles.splice(i,1);
        }
    }

    //NO BORRAR PORFAVOR
    // if (cohete.y > height) {
    //     console.log("Game Over");
    //     resetGame();
    // }

    //NO BORRAR PORFAVOR
    // if (cohete.y > height) {
    //     console.log("Game Over");
    //     resetGame();
    // }
    
}

function resetGame(){
    cohete = new rocket(200, height/2, 1); // Reinicialización cohete
    obstacles = []; // Reinicialización array de obstáculos
    obstacles.push(new obstacle()); // Se añade un nuevo obstaculo al cargar el juego
    gameFrameCount = 0; // Reiniciamos el contador de frames
    puntuacion.reset(); // Reiniciamos la puntuación
}

window.onclick = function() {
    cohete.jump();
}