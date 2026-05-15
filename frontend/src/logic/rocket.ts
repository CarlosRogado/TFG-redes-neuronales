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
    causaMuerte: string;
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
        this.causaMuerte = 'Vivo';
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
            return model as unknown as tf.Tensor; 
        }) as unknown as tf.Sequential;
    }

    copy(): tf.Sequential {
        return tf.tidy(() => {
            const modelCopy = this.createBrain();
            const weights = this.brain.getWeights();
            const weightCopies = [];
            for (let i = 0; i < weights.length; i++) {
                weightCopies[i] = weights[i].clone();
            }
            modelCopy.setWeights(weightCopies);
            return modelCopy as unknown as tf.Tensor;
        }) as unknown as tf.Sequential; 
    }

    mutate(rate: number, p: p5): void {
        tf.tidy(() => {
            const weights = this.brain.getWeights();
            const pesosMutados = [];

            for (let i = 0; i < weights.length; i++) {
                const shape = weights[i].shape;
                const size = shape.reduce((a: number, b: number) => a * b, 1);

                const mask = tf.tensor(
                    Array.from({ length: size }, () => p.random(1) < rate ? 1 : 0),
                    shape
                );
                const ruido = tf.randomNormal(shape, 0, 0.1);
                const mutacion = tf.mul(mask, ruido);
                const nuevoPeso = tf.add(weights[i], mutacion);

                pesosMutados.push(nuevoPeso);

                mask.dispose();
                ruido.dispose();
                mutacion.dispose();
            }
            this.brain.setWeights(pesosMutados);
        });
    }

    think(closest: obstacle, p: p5) { 
        if (!closest || this.pendingThink) {
            return;
        }

        let oData = closest.getData(p); 
        let inputs = [
            this.y / p.height,             
            this.velocity / 10,        
            oData.x / p.width,   
            oData.center / p.height         
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