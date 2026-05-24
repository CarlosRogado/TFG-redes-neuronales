import obstacle from "../logic/obstacle";
import rocket from "../logic/rocket";
import { CANVAS_H } from "./constants";

export type DatosDispersion = {
    id: string;
    pesoX: number;
    pesoY: number;
    isCloned: boolean;
};

export interface EvolutionResult {
    cohetes: rocket[];
    obstacles: obstacle[];
    cohetesMuertos: rocket[];
    frames: number;
    generacion: number;
    datosDispersion: DatosDispersion[];
    historialEntry:{
        generacion: number;
        maxSegundos: number;
        mediaSegundos: number;
    };
}

interface NextGenerationParams { 
    cohetesMuertos: rocket[];
    totalCohetes: number;
    tasaMutacion: number;
    tasaElitismo: number;
    frames: number;
    generacion: number;
}


export default async function nextGeneration({ 
    cohetesMuertos,
    totalCohetes,
    tasaMutacion,
    tasaElitismo,
    frames,
    generacion
}: NextGenerationParams): Promise<EvolutionResult> {
    const nuevaGeneracion = generacion + 1;

    const nuevosCohetes: rocket[] = [];

    const rankingCohetes = cohetesMuertos.slice().sort((a,b) => b.fitness - a.fitness);

    const numClones = Math.floor(totalCohetes * (tasaElitismo / 100));

    for (let i = 0; i < totalCohetes; i++){
        if(i < numClones) {
            const indiceElite = i%rankingCohetes.length;
            const cerebroParaCopiar = rankingCohetes[indiceElite].copy();
            
            const nuevoHijo = new rocket(200, CANVAS_H / 2, i, cerebroParaCopiar);
            nuevosCohetes.push(nuevoHijo);
        }
        else{
            const poolSize = numClones > 0 ? numClones : Math.min(5, rankingCohetes.length);
            const randomEliteindex = Math.floor(Math.random() * poolSize);
            const cerebroParaCopiar = rankingCohetes[randomEliteindex].copy();
            const nuevoHijo = new rocket(200, CANVAS_H / 2, i, cerebroParaCopiar);
            nuevoHijo.mutate(tasaMutacion);
            nuevosCohetes.push(nuevoHijo);
        }
    }

    const datosDispersion: DatosDispersion[] = await Promise.all(
        nuevosCohetes.map(async (cohete, index) => {
            const pesos = cohete.brain.getWeights();
            const [pesoCapa1, sesgoCapa1, pesoCapa2, sesgoCapa2] = await Promise.all([
                pesos[0].data(),
                pesos[1].data(),
                pesos[2].data(),
                pesos[3].data(),
            ]);

            const todosLosPesos = [...Array.from(pesoCapa1), ...Array.from(pesoCapa2)];
            const todosLosSesgos = [...Array.from(sesgoCapa1), ...Array.from(sesgoCapa2)];

            const mediaPesos = todosLosPesos.reduce((a, b) => a + b, 0) / todosLosPesos.length;
            const mediaSesgos = todosLosSesgos.reduce((a, b) => a + b, 0) / todosLosSesgos.length;

            return {
                id: `Cohete ${index + 1}`,
                pesoX: Number(mediaPesos.toFixed(3)),
                pesoY: Number(mediaSesgos.toFixed(3)),
                isCloned: index < numClones
            };
        })
    );

    for (let c of cohetesMuertos) {
        c.brain.dispose();
    }

    const segundos = Number((frames / 60).toFixed(2));
    const mediaSegundos = Number((cohetesMuertos.reduce((sum, c) => sum + c.score, 0) / cohetesMuertos.length / 60).toFixed(2));

    return {
        cohetes: nuevosCohetes,
        obstacles: [new obstacle()],
        cohetesMuertos: [],
        frames: 0,
        generacion: nuevaGeneracion,
        historialEntry: {
            generacion: generacion,
            maxSegundos: segundos,
            mediaSegundos: mediaSegundos
        },
        datosDispersion
    }
}
