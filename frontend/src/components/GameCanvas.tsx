// Todo lo relacionado con p5 y el lienzo
import { useRef, useEffect } from "react";
import { useLatestRef } from "../hooks/useLatestRef";
import p5 from "p5";
import rocket from "../logic/rocket";
import obstacle from "../logic/obstacle";
import nextGeneration from "../logic/evolution";
import type { HistorialEntry, BarcharData } from "../logic/types";

export type CausaMuerte = {
  name: string;
  value: number;
};
export type DatosDispersion = {
  id: string;
  pesoX: number;
  pesoY: number;
};

type GameCanvasProps = {
  // Props que recibe el componente GameCanvas, incluyendo dimensiones del canvas, número total de cohetes, tasa de mutación y funciones para manejar cambios en la generación, cohetes vivos y entradas para el historial.
  totalCohetes: number;
  tasaMutacion: number;
  tasaElitismo: number;
  isPausa: boolean;
  onGeneracionChange: (generacion: number) => void;
  onVivosChange: (vivos: number) => void;
  onHistorialEntry: (entry: HistorialEntry) => void;
  onBarcharDataChange?: (data: BarcharData[]) => void;
  onCausaMuerteChange?: (causas: CausaMuerte[]) => void;
  onDatosDispersionChange?: (data: DatosDispersion[]) => void;
  onSegundosChange?: (segundos: number) => void;
};

export default function GameCanvas({
  totalCohetes,
  tasaMutacion,
  tasaElitismo,
  isPausa,
  onGeneracionChange,
  onVivosChange,
  onHistorialEntry,
  onBarcharDataChange,
  onCausaMuerteChange,
  onDatosDispersionChange,
  onSegundosChange,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null); // Referencia para el contenedor del canvas de p5
  const p5InstanceRef = useRef<p5 | null>(null); // Referencia para la instancia de p5, permitiendo acceder a la instancia de p5 en diferentes partes del componente

  const tasaMutacionRef = useLatestRef(tasaMutacion); // Referencia para la tasa de mutación, permitiendo que la lógica de mutación acceda al valor actualizado
  const tasaElitismoRef = useLatestRef(tasaElitismo); // Referencia para la tasa de elitismo, permitiendo que la lógica de evolución acceda al valor actualizado
  const onGeneracionChangeRef = useLatestRef(onGeneracionChange); // Referencia para la función de cambio de generación, permitiendo que la lógica de evolución actualice la generación en el estado del componente
  const onVivosChangeRef = useLatestRef(onVivosChange); // Referencia para la función de cambio de cohetes vivos, permitiendo que la lógica del juego actualice el número de cohetes vivos en el estado del componente
  const onHistorialEntryRef = useLatestRef(onHistorialEntry); // Referencia para la función de entrada de historial, permitiendo que la lógica del juego agregue entradas al historial en el estado del componente
  const onCausaMuerteChangeRef = useLatestRef(onCausaMuerteChange); // Referencia para la función de cambio de causas de muerte, permitiendo que la lógica del juego actualice las causas de muerte en el estado del componente
  const onDatosDispersionChangeRef = useLatestRef(onDatosDispersionChange); // Referencia para la función de cambio de datos de dispersión, permitiendo que la lógica del juego actualice los datos de dispersión en el estado del componente
  const onSegundosChangeRef = useLatestRef(onSegundosChange); // Referencia para la función de cambio de segundos, permitiendo que la lógica del juego actualice los segundos en el estado del componente

  useEffect(() => {
    if (p5InstanceRef.current) {
      if (isPausa) {
        p5InstanceRef.current.noLoop(); // Detiene el bucle de dibujo de p5 para pausar el juego
      } else {
        p5InstanceRef.current.loop(); // Reanuda el bucle de dibujo de p5 para continuar el juego
      }
    }
  }, [isPausa]);

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

        if (frames % 60 === 0) {
          if (cohetes.length > 0) {
            const currentFrames = cohetes[cohetes.length - 1].score; // Obtener el número de frames que duró el último cohete muerto
            const currentSegundos = (currentFrames / 60).toFixed(0); // Convertir los frames a segundos y formatearlo a 2 decimales
            onSegundosChangeRef.current?.(Number(currentSegundos)); // Actualizar los segundos en el estado del componente
          } else {
            onSegundosChangeRef.current?.(0); // Si no hay cohetes vivos, establecer los segundos en 0
          }

          const currentBarcharData = [...cohetesMuertos, ...cohetes].map((currentRocket) => ({
              id: `Cohete ${currentRocket.id + 1}`,
              segundos: Number((currentRocket.score / 60).toFixed(2)), // Convertir el score del cohete a segundos y formatearlo a 2 decimales
            }),
          );
          if (onBarcharDataChange) {
            onBarcharDataChange(currentBarcharData);
          }
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

          if (closest && frames % 8 === 0) {
            cohete.think(closest, p); // Hacer que el cohete piense y tome decisiones basadas en el obstáculo más cercano
          }

          cohete.update();
          cohete.show(p);

          //Lógica de colisiones
          let hit = false;
          if (closest && closest.hits(cohete, p)) {
            hit = true; // Verificar si el cohete ha chocado con el obstáculo
          } else if (cohete.y + cohete.height > p.height) {
            cohete.causaMuerte = "Suelo";
            hit = true; // Verificar si el cohete ha salido de la pantalla
          } else if (cohete.y < 0) {
            cohete.causaMuerte = "Techo";
            hit = true; // Verificar si el cohete ha salido de la pantalla
          }
          if (hit) {
            cohetesMuertos.push(cohete); // Mover el cohete al array de cohetes muertos
            cohetes.splice(i, 1); // Eliminar el cohete del array de cohetes vivos
          }
        }

        if (frames % 8 === 0) {
          onVivosChangeRef.current(cohetes.length); // Actualizar el número de cohetes vivos en el estado del componente
        }

        // Cambio de generación
        if (cohetes.length === 0 && cohetesMuertos.length > 0) {
          const causasCount: Record<string, number> = {
            "Tubo Superior": 0,
            "Tubo Inferior": 0,
            Suelo: 0,
            Techo: 0,
          };
          cohetesMuertos.forEach((cohete) => {
            if (causasCount[cohete.causaMuerte] !== undefined) {
              causasCount[cohete.causaMuerte]++;
            }
          });
          const causas = Object.keys(causasCount).map((key) => ({
            name: key,
            value: causasCount[key],
          }));
          const result = nextGeneration({
            p,
            cohetesMuertos,
            totalCohetes,
            tasaMutacion: tasaMutacionRef.current,
            tasaElitismo: tasaElitismoRef.current,
            frames,
            generacion,
          });
          onCausaMuerteChangeRef.current?.(causas);
          onDatosDispersionChangeRef.current?.(result.datosDispersion);
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
            generacion: Number(result.historialEntry.generacion),
          }); // Agregar una entrada al historial con el tiempo que duró la generación y el número de generación
          onSegundosChangeRef.current?.(0); // Reiniciar los segundos en el estado del componente para la nueva generación
        }
      };
    };
    const p5Instance = new p5(juego); // Crear una nueva instancia de p5 con la función del juego
    p5InstanceRef.current = p5Instance; // Guardar la instancia de p5 en la referencia para poder acceder a ella en otros efectos

    return () => {
      p5Instance.remove(); // Limpiar la instancia de p5 cuando el componente se desmonte para evitar fugas de memoria
    };
  }, [totalCohetes]);
  return (
    <div className="w-3xl h-lg bg-gray-800 rounde-lg">
      <div ref={canvasRef} />
    </div>
  );
}
