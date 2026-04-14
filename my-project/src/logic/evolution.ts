import p5 from 'p5';
import obstacle from "../logic/obstacle";
import rocket from "../logic/rocket";
// Función para generar la siguiente generación de cohetes basada en la selección del mejor cohete de la generación anterior y aplicando mutaciones a su cerebro para crear nuevos cohetes.

export interface EvolutionResult { // Tipo de resultado que devuelve la función nextGeneration
    cohetes: rocket[];
    obstacles: obstacle[];
    cohetesMuertos: rocket[];
    frames: number;
    generacion: number;
    historialEntry:{
        segundos: number;
        generacion: number;
    };
}

// Parametros de entrada para la función nextGeneration
interface NextGenerationParams { // Tipo de parámetros que recibe la función nextGeneration
    p: p5;
    cohetesMuertos: rocket[];
    totalCohetes: number;
    tasaMutacion: number;
    frames: number;
    generacion: number;
}

// Función para generar la siguiente generación de cohetes
export default function nextGeneration({ // Desestructuramos los parámetros de entrada para facilitar su uso dentro de la función
    p,
    cohetesMuertos,
    totalCohetes,
    tasaMutacion,
    frames,
    generacion
}: NextGenerationParams): EvolutionResult { // La función recibe un objeto con los parámetros necesarios para generar la siguiente generación y devuelve un objeto con los resultados de la evolución, incluyendo los nuevos cohetes, obstáculos, cohetes muertos, frames, generación y una entrada para el historial.

    const nuevaGeneracion = generacion + 1;

    const elMejor = cohetesMuertos.reduce((prev, curr) =>
        curr.score > prev.score ? curr : prev,
    );

    const nuevosCohetes: rocket[] = [];

    for (let i = 0; i < totalCohetes; i++) {
        const cerebroCopiado = elMejor.copy();
        const nuevoHijo = new rocket(200, p.height / 2, i, cerebroCopiado);

        if (i > 0) {
            nuevoHijo.mutate(tasaMutacion, p);
        }

        nuevosCohetes.push(nuevoHijo);
    }

    for (let c of cohetesMuertos) {
        c.brain.dispose();
    }

    const segundos = Number((frames / 60).toFixed(2));

    return {
        cohetes: nuevosCohetes,
        obstacles: [new obstacle(p)],
        cohetesMuertos: [],
        frames: 0,
        generacion: nuevaGeneracion,
        historialEntry: {
            segundos,
            generacion: nuevaGeneracion
        }
    }
}
