import p5 from 'p5';
import obstacle from "../logic/obstacle";
import rocket from "../logic/rocket";

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
    p: p5;
    cohetesMuertos: rocket[];
    totalCohetes: number;
    tasaMutacion: number;
    tasaElitismo: number;
    frames: number;
    generacion: number;
}


export default function nextGeneration({ 
    p,
    cohetesMuertos,
    totalCohetes,
    tasaMutacion,
    tasaElitismo,
    frames,
    generacion
}: NextGenerationParams): EvolutionResult {
    const nuevaGeneracion = generacion + 1;

    const nuevosCohetes: rocket[] = [];

    const rankingCohetes = cohetesMuertos.slice().sort((a,b) => b.score - a.score);

    const numClones = Math.floor(totalCohetes * (tasaElitismo / 100));

    for (let i = 0; i < totalCohetes; i++){
        if(i < numClones) {
            const indiceElite = i%rankingCohetes.length;
            const cerebroParaCopiar = rankingCohetes[indiceElite].copy();
            
            const nuevoHijo = new rocket(200, p.height / 2, i, cerebroParaCopiar);
            nuevosCohetes.push(nuevoHijo);
        }
        else{
            const poolSize = numClones > 0 ? numClones : Math.min(5, rankingCohetes.length);
            const randomEliteindex = Math.floor(Math.random() * poolSize);
            const cerebroParaCopiar = rankingCohetes[randomEliteindex].copy();
            const nuevoHijo = new rocket(200, p.height / 2, i, cerebroParaCopiar);
            nuevoHijo.mutate(tasaMutacion, p);
            nuevosCohetes.push(nuevoHijo);
        }
    }

    const datosDispersion: DatosDispersion[] = nuevosCohetes.map((cohete, index) => {
        const pesos = cohete.brain.getWeights();
        const pesoCapa1= Array.from(pesos[0].dataSync()); 
        const sesgoCapa1 = Array.from(pesos[1].dataSync()); 
        const pesoCapa2 = Array.from(pesos[2].dataSync());
        const sesgoCapa2 = Array.from(pesos[3].dataSync()); 
        
        const todosLosPesos = [...pesoCapa1, ...pesoCapa2];
        const todosLosSesgos = [...sesgoCapa1, ...sesgoCapa2]; 

        const mediaPesos = todosLosPesos.reduce((a, b) => a + b, 0) / todosLosPesos.length;
        const mediaSesgos = todosLosSesgos.reduce((a, b) => a + b, 0) / todosLosSesgos.length; 

        return {
            id: `Cohete ${index + 1}`,
            pesoX: Number(mediaPesos.toFixed(3)), 
            pesoY: Number(mediaSesgos.toFixed(3)),
            isCloned: index < numClones
        };
    });

    for (let c of cohetesMuertos) {
        c.brain.dispose();
    }

    const segundos = Number((frames / 60).toFixed(2));
    const mediaSegundos = Number((cohetesMuertos.reduce((sum, c) => sum + c.score, 0) / cohetesMuertos.length / 60).toFixed(2));


    return {
        cohetes: nuevosCohetes,
        obstacles: [new obstacle(p)],
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
