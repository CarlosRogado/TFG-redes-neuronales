class rocket {
    constructor(x, y, id, brain) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 20;
        this.gravity = 0.6;
        this.velocity = 0;
        this.lift = 10;
        this.id = id;
        this.score = 0;   // Usaremos 'score' para mayor claridad
        this.fitness = 0;

        if (brain) {
            this.brain = brain; // CORREGIDO: antes decía this.brain = this.brain
        } else {
            this.brain = this.createBrain();
        }
    }

    createBrain() {
       return tf.tidy(() => {
            const model = tf.sequential({
                layers: [
                    tf.layers.dense({ inputShape: [4], units: 8, activation: 'relu' }),
                    tf.layers.dense({ units: 1, activation: 'sigmoid' })
                ]
            });
            return model;
        });
    }

    // --- NUEVO: MÉTODO PARA COPIAR EL CEREBRO ---
    copy() {
        return tf.tidy(() => {
            const modelCopy = this.createBrain();
            const weights = this.brain.getWeights();
            const weightCopies = [];
            for (let i = 0; i < weights.length; i++) {
                weightCopies[i] = weights[i].clone();
            }
            modelCopy.setWeights(weightCopies);
            return modelCopy;
        });
    }

    // --- NUEVO: MÉTODO PARA MUTAR LOS PESOS ---
    mutate(rate) {
        tf.tidy(() => {
            const weights = this.brain.getWeights();
            const mutatedWeights = [];
            for (let i = 0; i < weights.length; i++) {
                let tensor = weights[i];
                let shape = weights[i].shape;
                let values = tensor.dataSync().slice();
                for (let j = 0; j < values.length; j++) {
                    if (random(1) < rate) {
                        // randomGaussian() es mejor para evolucionar
                        values[j] += randomGaussian() * 0.1; 
                    }
                }
                let newTensor = tf.tensor(values, shape);
                mutatedWeights.push(newTensor);
            }
            // Aplicamos los nuevos pesos al cerebro de este cohete
            this.brain.setWeights(mutatedWeights);
        });
    }

    think(closest) { // Asegúrate de que recibe el objeto 'closest' directamente
        if (closest) {

            let oData = closest.getData(); // Coge los datos del obstaculo mas cercano
            tf.tidy(() => {
                // NORMALIZACIÓN CRÍTICA
                let inputs = [
                    this.y / height,                // Posición Y del cohete (0 a 1)
                    this.velocity / 10,             // Velocidad (normalizada aprox)
                    oData.x / width,   // Distancia horizontal relativa
                    oData.center / height            // Altura del hueco
                ];

                const xs = tf.tensor2d([inputs]);
                const ys = this.brain.predict(xs);
                const outputs = ys.dataSync();

                // LOG DE CONTROL: Descomenta esto para ver qué está pensando la IA 

                if (outputs[0] > 0.5) {
                    this.jump();
                }
            });
        }
    }
    show() {
        fill(255, 0, 0, 150); // Un poco de transparencia para ver si se solapan
        rect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.score++; // CORREGIDO: Incrementa el puntaje real
        this.velocity += this.gravity;
        this.y += this.velocity;

        // NOTA: He quitado los IF de rebote. 
        // Si quieres que mueran, el draw detectará si this.y > height.
    }

    jump() {
        this.velocity = -this.lift;
    }
}