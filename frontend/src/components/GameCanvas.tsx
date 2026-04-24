// Todo lo relacionado con p5 y el lienzo
import { useRef, useEffect } from 'react';
import p5 from 'p5';
import rocket from '../logic/rocket';
import obstacle from '../logic/obstacle';
import nextGeneration from '../logic/evolution';
import type { BarcharData } from '../views/Simulation';

type HistorialEntry = {
    generacion: number;
    maxSegundos: number;
    mediaSegundos: number;
};

type GameCanvasProps = { // Props que recibe el componente GameCanvas, incluyendo dimensiones del canvas, número total de cohetes, tasa de mutación y funciones para manejar cambios en la generación, cohetes vivos y entradas para el historial.
  totalCohetes:number;
  tasaMutacion:number;
  onGeneracionChange: (generacion: number) => void; 
  onVivosChange: (vivos: number) => void;
  onHistorialEntry: (entry:HistorialEntry) => void;
  onBarcharDataChange?: (data: BarcharData[]) => void;
};

export default function GameCanvas({
    totalCohetes,
    tasaMutacion,
    onGeneracionChange,
    onVivosChange,
    onHistorialEntry,
    onBarcharDataChange
}: GameCanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null); // Referencia para el contenedor del canvas de p5
    const tasaMutacionRef = useRef(tasaMutacion); // Referencia para la tasa de mutación, permitiendo que la lógica de mutación acceda al valor actualizado
    const onGeneracionChangeRef = useRef(onGeneracionChange); // Referencia para la función de cambio de generación, permitiendo que la lógica de evolución actualice la generación en el estado del componente
    const onVivosChangeRef = useRef(onVivosChange); // Referencia para la función de cambio de cohetes vivos, permitiendo que la lógica del juego actualice el número de cohetes vivos en el estado del componente
    const onHistorialEntryRef = useRef(onHistorialEntry); // Referencia para la función de entrada de historial, permitiendo que la lógica del juego agregue entradas al historial en el estado del componente
    useEffect(() => {
        tasaMutacionRef.current = tasaMutacion; // Actualiza la referencia de la tasa de mutación cada vez que cambia el estado
    }, [tasaMutacion]);

    useEffect(() => {
        onGeneracionChangeRef.current = onGeneracionChange; // Actualiza la referencia de la función de cambio de generación cada vez que cambia el estado
    }, [onGeneracionChange]);

    useEffect(() => {
        onVivosChangeRef.current = onVivosChange; // Actualiza la referencia de la función de cambio de cohetes vivos cada vez que cambia el estado
    }, [onVivosChange]);

    useEffect(() => {
        onHistorialEntryRef.current = onHistorialEntry; // Actualiza la referencia de la función de entrada de historial cada vez que cambia el estado
    }, [onHistorialEntry]);

    useEffect(() => {
        const canvasElement = canvasRef.current; // Obtener el elemento del DOM donde se renderizará el canvas
        if (!canvasElement) return; // Si no se encuentra el elemento, salir

        const juego = (p: p5) => {
            let cohetes: rocket[] = [];
            let obstacles: obstacle[] = [];
            let cohetesMuertos: rocket[] = [];
            let frames = 0;
            let generacion = 1;
            p.setup = () => {
                p.createCanvas(768, 512).parent(canvasElement); // Crear el canvas y asignarlo al contenedor

                for (let i = 0; i < totalCohetes; i++) {
                    cohetes.push(new rocket(200, p.height / 2, i)); // Inicializar los cohetes en la posición inicial
                }

                obstacles.push(new obstacle(p)); // Agregar el primer obstáculo
                onVivosChangeRef.current(totalCohetes); // Actualizar el número de cohetes vivos en el estado del componente
                onGeneracionChangeRef.current(generacion); // Actualizar la generación en el estado del componente
            };
            p.draw = () => {
                p.background(20); // Establecer el fondo del canvas
                frames++;

                if (frames % 150 === 0) {
                    obstacles.push(new obstacle(p)); // Agregar un nuevo obstáculo cada 150 frames
                }

                for (let i = obstacles.length - 1; i >= 0; i--) {
                    obstacles[i].show(p);
                    obstacles[i].update();

                    if (obstacles[i].offscreen()) {
                        obstacles.splice(i, 1); // Eliminar obstáculos que han salido de la pantalla
                    }
                }

                let closest: obstacle | null = null;
                let record = Infinity;

                for (const obs of obstacles) {
                    const distance = obs.x + obs.width - 200; // Calcular la distancia horizontal desde el cohete hasta el obstáculo

                    if (distance > 0 && distance < record) {
                        record = distance;
                        closest = obs; // Encontrar el obstáculo más cercano al cohete
                    }
                }

                for (let i = cohetes.length - 1; i >= 0; i--) {
                    const cohete = cohetes[i];

                    if(closest && frames % 8 === 0){
                        cohete.think(closest, p); // Hacer que el cohete piense y tome decisiones basadas en el obstáculo más cercano
                    }

                    cohete.update();
                    cohete.show(p);

                    let hit = false;

                    if(closest && closest.hits(cohete, p)){
                        hit = true; // Verificar si el cohete ha chocado con el obstáculo
                    }
                    if(cohete.y > p.height || cohete.y < 0){
                        hit = true; // Verificar si el cohete ha salido de la pantalla
                    }
                    if(hit){
                        cohetesMuertos.push(cohete); // Mover el cohete al array de cohetes muertos
                        cohetes.splice(i, 1); // Eliminar el cohete del array de cohetes vivos
                        const currentBarcharData = [...cohetesMuertos, ...cohetes]
                            .map((currentRocket) => ({
                                id: `Cohete ${currentRocket.id + 1}`,
                                segundos: Number((currentRocket.score / 60).toFixed(2)) // Convertir el score del cohete a segundos y formatearlo a 2 decimales
                            }));
                        if(onBarcharDataChange){
                            onBarcharDataChange(currentBarcharData);
                        }
                    }
                }
                if(frames % 8 === 0){
                    onVivosChangeRef.current(cohetes.length); // Actualizar el número de cohetes vivos en el estado del componente
                }
                if(cohetes.length === 0 && cohetesMuertos.length > 0){
                    const result = nextGeneration({
                        p,
                        cohetesMuertos,
                        totalCohetes,
                        tasaMutacion: tasaMutacionRef.current,
                        frames,
                        generacion
                    });

                    cohetes = result.cohetes; // Actualizar el array de cohetes vivos con la nueva generación
                    obstacles = result.obstacles; // Actualizar el array de obstáculos con los nuevos obstáculos generados
                    cohetesMuertos = result.cohetesMuertos; // Actualizar el array de cohetes muertos con los cohetes muertos de la nueva generación
                    frames = result.frames; // Reiniciar el contador de frames para la nueva generación
                    generacion = Number(result.generacion); // Actualizar la generación actual con la nueva generación

                    onGeneracionChangeRef.current(generacion); // Actualizar la generación en el estado del componente
                    onVivosChangeRef.current(totalCohetes); // Reiniciar el número de cohetes vivos en el estado del componente
                    onHistorialEntryRef.current({
                        maxSegundos: Number(result.historialEntry.maxSegundos),
                        mediaSegundos: Number(result.historialEntry.mediaSegundos),
                        generacion: Number(result.historialEntry.generacion)
                     }); // Agregar una entrada al historial con el tiempo que duró la generación y el número de generación
                }
            };
        };
        const p5Instance = new p5(juego); // Crear una nueva instancia de p5 con la función del juego

        return () => {
            p5Instance.remove(); // Limpiar la instancia de p5 cuando el componente se desmonte para evitar fugas de memoria
        };

    }, [totalCohetes]);
    return(
        <div className="w-3xl h-lg bg-gray-800 rounde-lg">
            <h2 className="text-bold text-wite p-4">Juego</h2>
            <div ref={canvasRef} />
        </div>
    );
};