import * as tf from '@tensorflow/tfjs';
import obstacle from './obstacle';
import { CANVAS_H, CANVAS_W } from './constants';

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
        const model = tf.sequential({
            layers: [
                tf.layers.dense({ inputShape: [6], units: 8, activation: 'relu' }),
                tf.layers.dense({ units: 1, activation: 'sigmoid' })
            ]
        });
        return model;
    }

    copy(): tf.Sequential {
        const modelCopy = this.createBrain();
        const weights = this.brain.getWeights();
        const weightCopies = [];
        for (let i = 0; i < weights.length; i++) {
            weightCopies[i] = weights[i].clone();
        }
        modelCopy.setWeights(weightCopies);
        return modelCopy;
    }

    mutate(rate: number): void {
        tf.tidy(() => {
            const weights = this.brain.getWeights();
            const pesosMutados = [];

            for (let i = 0; i < weights.length; i++) {
                const shape = weights[i].shape;
                const size = shape.reduce((a: number, b: number) => a * b, 1);

                const mask = tf.tensor(
                    Array.from({ length: size }, () => Math.random() < rate ? 1 : 0),
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

    think(closest: obstacle) { 
        if (!closest || this.pendingThink) {
            return;
        }

        let oData = closest.getData(); 
        let inputs = [
            this.y / CANVAS_H,             // Posición Y del cohete
            this.velocity / 10,             // Velocidad vertical
            oData.x / CANVAS_W,            // Posición X del obstáculo
            oData.center / CANVAS_H,        // Centro del hueco
            oData.top / CANVAS_H,          // Techo del hueco
            oData.bottom / CANVAS_H        // Suelo del hueco
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
    show(ctx: CanvasRenderingContext2D) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const w = this.width;
        const h = this.height;

        // Fuego
        ctx.fillStyle = '#ff8800';
        ctx.beginPath();
        ctx.moveTo(cx - 2, cy + h * 0.2);
        ctx.lineTo(cx, cy + h * 0.5);
        ctx.lineTo(cx + 2, cy + h * 0.2);
        ctx.fill();

        // Cuerpo
        ctx.fillStyle = '#e53935';
        ctx.strokeStyle = '#c62828';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy - h / 2);
        ctx.lineTo(cx - w / 2, cy + h * 0.3);
        ctx.lineTo(cx + w / 2, cy + h * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Ventanita
        ctx.fillStyle = '#81d4fa';
        ctx.beginPath();
        ctx.arc(cx, cy - h * 0.05, w * 0.18, 0, Math.PI * 2);
        ctx.fill();
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