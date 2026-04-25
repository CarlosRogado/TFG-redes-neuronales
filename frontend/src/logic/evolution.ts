import p5 from 'p5';
import obstacle from "../logic/obstacle";
import rocket from "../logic/rocket";
// Función para generar la siguiente generación de cohetes basada en la selección del mejor cohete de la generación anterior y aplicando mutaciones a su cerebro para crear nuevos cohetes.

export type DatosDispersion = {
    id: string;
    pesoX: number;
    pesoY: number;
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

    const datosDispersion: DatosDispersion[] = nuevosCohetes.map((cohete, index) => {
        const pesos = cohete.brain.getWeights();
        const peso1= Array.from(pesos[0].dataSync()); // Peso de la primera conexión de la primera capa
        const peso2 = Array.from(pesos[0].dataSync()); // Peso de la segunda conexión de la primera capa

        const mediaPeso1 = peso1.reduce((a,b) => a + b, 0) / peso1.length; // Media de los pesos de la primera conexión
        const mediaPeso2 = peso2.reduce((a,b) => a + b, 0) / peso2.length; // Media de los pesos de la segunda conexión

        return {
            id: `Cohete ${index + 1}`,
            pesoX: Number(mediaPeso1.toFixed(3)), // Redondeamos a 3 decimales para una mejor visualización
            pesoY: Number(mediaPeso2.toFixed(3))  // Redondeamos a 3 decimales para una mejor visualización
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
