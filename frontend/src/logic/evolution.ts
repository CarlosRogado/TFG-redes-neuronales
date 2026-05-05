import p5 from 'p5';
import obstacle from "../logic/obstacle";
import rocket from "../logic/rocket";
// Función para generar la siguiente generación de cohetes basada en la selección del mejor cohete de la generación anterior y aplicando mutaciones a su cerebro para crear nuevos cohetes.

export type DatosDispersion = {
    id: string;
    pesoX: number;
    pesoY: number;
    isCloned: boolean;
};

export interface EvolutionResult { // Tipo de resultado que devuelve la función nextGeneration
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

// Parametros de entrada para la función nextGeneration
interface NextGenerationParams { // Tipo de parámetros que recibe la función nextGeneration
    p: p5;
    cohetesMuertos: rocket[];
    totalCohetes: number;
    tasaMutacion: number;
    tasaElitismo: number;
    frames: number;
    generacion: number;
}

// Función para generar la siguiente generación de cohetes
export default function nextGeneration({ // Desestructuramos los parámetros de entrada para facilitar su uso dentro de la función
    p,
    cohetesMuertos,
    totalCohetes,
    tasaMutacion,
    tasaElitismo,
    frames,
    generacion
}: NextGenerationParams): EvolutionResult { // La función recibe un objeto con los parámetros necesarios para generar la siguiente generación y devuelve un objeto con los resultados de la evolución, incluyendo los nuevos cohetes, obstáculos, cohetes muertos, frames, generación y una entrada para el historial.

    const nuevaGeneracion = generacion + 1;

    const nuevosCohetes: rocket[] = [];

    // Ordenar cohetes muertos del mejor al peor
    const rankingCohetes = cohetesMuertos.slice().sort((a,b) => b.score - a.score);

    // Calcular cuantos clones puros se van a pasar
    const numClones = Math.floor(totalCohetes * (tasaElitismo / 100));

    for (let i = 0; i < totalCohetes; i++){
        // Clonacion pura
        if(i < numClones) {
            const indiceElite = i%rankingCohetes.length;
            const cerebroParaCopiar = rankingCohetes[indiceElite].copy();
            
            const nuevoHijo = new rocket(200, p.height / 2, i, cerebroParaCopiar);
            nuevosCohetes.push(nuevoHijo);
        }
        // Mutantes
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
        const pesoCapa1= Array.from(pesos[0].dataSync()); // Pesos capa 1 (conexiones de entrada a la primera capa oculta)
        const sesgoCapa1 = Array.from(pesos[1].dataSync()); // Sesgo capa 1 (sesgos de la primera capa oculta)
        const pesoCapa2 = Array.from(pesos[2].dataSync()); // Pesos capa 2 (conexiones de la primera capa oculta a la capa de salida)
        const sesgoCapa2 = Array.from(pesos[3].dataSync()); // Sesgo capa 2 (sesgos de la capa de salida)
        
        const todosLosPesos = [...pesoCapa1, ...pesoCapa2]; // Unimos todos los pesos en un solo array para calcular la media
        const todosLosSesgos = [...sesgoCapa1, ...sesgoCapa2]; // Unimos todos los sesgos en un solo array para calcular la media

        const mediaPesos = todosLosPesos.reduce((a, b) => a + b, 0) / todosLosPesos.length; // Calculamos la media de los pesos
        const mediaSesgos = todosLosSesgos.reduce((a, b) => a + b, 0) / todosLosSesgos.length; // Calculamos la media de los sesgos

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
            generacion: nuevaGeneracion,
            maxSegundos: segundos,
            mediaSegundos: mediaSegundos
        },
        datosDispersion
    }
}
