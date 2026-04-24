import p5 from 'p5';
import * as tf from '@tensorflow/tfjs';
import obstacle from './obstacle';

export default class rocket {
    x: number;
    y: number;
    width: number;
    height: number;
    gravity: number;
    velocity: number;
    lift: number;
    id: number;
    score: number;
    fitness: number;
    brain: tf.Sequential;
    pendingThink: boolean;
    constructor(x: number, y: number, id: number, brain?: tf.Sequential) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 20;
        this.gravity = 0.6;
        this.velocity = 0;
        this.lift = 10;
        this.id = id;
        this.score = 0;  
        this.fitness = 0;
        this.pendingThink = false;

        this.brain = brain ? brain : this.createBrain();
    }

    createBrain(): tf.Sequential {
       return tf.tidy(() => {
            const model = tf.sequential({
                layers: [
                    tf.layers.dense({ inputShape: [4], units: 8, activation: 'relu' }),
                    tf.layers.dense({ units: 1, activation: 'sigmoid' })
                ]
            });
            return model as unknown as tf.Tensor; // Aseguramos el tipo correcto
        }) as unknown as tf.Sequential; // Aseguramos el tipo correcto
    }

    // --- NUEVO: MÉTODO PARA COPIAR EL CEREBRO ---
    copy(): tf.Sequential {
        return tf.tidy(() => {
            const modelCopy = this.createBrain();
            const weights = this.brain.getWeights();
            const weightCopies = [];
            for (let i = 0; i < weights.length; i++) {
                weightCopies[i] = weights[i].clone();
            }
            modelCopy.setWeights(weightCopies);
            return modelCopy as unknown as tf.Tensor; // Aseguramos el tipo correcto
        }) as unknown as tf.Sequential; // Aseguramos el tipo correcto
    }

    // --- NUEVO: MÉTODO PARA MUTAR LOS PESOS ---
    mutate(rate: number, p: p5): void {
        tf.tidy(() => {
            const weights = this.brain.getWeights();
            const mutatedWeights = [];
            for (let i = 0; i < weights.length; i++) {
                let tensor = weights[i];
                let shape = weights[i].shape;
                let values = tensor.dataSync().slice();
                for (let j = 0; j < values.length; j++) {
                    if (p.random(1) < rate) {
                        // randomGaussian() es mejor para evolucionar
                        values[j] += p.randomGaussian() * 0.1; 
                    }
                }
                let newTensor = tf.tensor(values, shape);
                mutatedWeights.push(newTensor);
            }
            // Aplicamos los nuevos pesos al cerebro de este cohete
            this.brain.setWeights(mutatedWeights);
        });
    }

    think(closest: obstacle, p: p5) { // Asegúrate de que recibe el objeto 'closest' directamente
        if (!closest || this.pendingThink) {
            return;
        }

        let oData = closest.getData(p); // Coge los datos del obstaculo mas cercano
        // NORMALIZACIÓN CRÍTICA
        let inputs = [
            this.y / p.height,                // Posición Y del cohete (0 a 1)
            this.velocity / 10,             // Velocidad (normalizada aprox)
            oData.x / p.width,   // Distancia horizontal relativa
            oData.center / p.height            // Altura del hueco
        ];

        this.pendingThink = true;

        const xs = tf.tensor2d([inputs]);
        const pred = this.brain.predict(xs);
        const y = Array.isArray(pred) ? pred[0] : pred;

        y.data()
            .then((outputs) => {
                if (outputs[0] > 0.5) {
                    this.jump();
                }
            })
            .finally(() => {
                xs.dispose();
                y.dispose();
                this.pendingThink = false;
            });
    }
    show(p: p5) {
        p.fill(255, 0, 0, 150); 
        p.rect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.score++;
        this.velocity += this.gravity;
        this.y += this.velocity;

    }

    jump() {
        this.velocity = -this.lift;
    }
}