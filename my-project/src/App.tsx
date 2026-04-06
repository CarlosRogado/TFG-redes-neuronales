import React, { useEffect, useRef } from "react";
import p5 from "p5"; // Librería para gráficos
import rocket from "./logic/rocket"; // Clase cohete
import obstacle from "./logic/obstacle"; // Clase obstáculo

import "./style.css";

function App() {
  const canvasRef = useRef<HTMLDivElement>(null); // useRef crea una referencia para indicar a p5 dónde renderizar el canvas
  const [generacion, setGeneracion] = React.useState(1); // Estado para la generación actual
  const [vivos, setVivos] = React.useState(0); // Estado para el número de cohetes vivos

  const [TOTAL, setTotal] = React.useState(10); // Total de cohetes por generación
  const [MUTATION_RATE, setMutationRate] = React.useState(0.2); // Tasa de mutación para la generación de nuevos cohetes
  useEffect(() => {
    const canvasElement = canvasRef.current; // Obtener el elemento del DOM donde se renderizará el canvas

    if (!canvasElement) return; // Si no se encuentra el elemento, salir

    // Inicialización de variables y configuración del "juego" de p5
    const juego = (p: p5) => {
      let cohetes: rocket[] = [];
      let obstacles: obstacle[] = [];
      let cohetesMuertos: rocket[] = [];
      let frames = 0;
      let generacion = 1;

      p.setup = () => {
        p.createCanvas(768, 512).parent(canvasElement); // Creación del canvas
        // Inicialización de cohetes y obstáculos
        for (let i = 0; i < TOTAL; i++) {
          cohetes.push(new rocket(50, p.height / 2, i));
        }
        obstacles.push(new obstacle(p));
        setVivos(TOTAL);
      };
      // Función principal de dibujo y lógica del juego que se ejecuta en cada frame
      p.draw = () => {
        p.background(20); // Color de fondo
        frames++;

        // Cada 100 frames, se agrega un nuevo obstáculo
        if (frames % 150 === 0) {
          obstacles.push(new obstacle(p));
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
          obstacles[i].show(p); // Mostrar el obstáculo
          obstacles[i].update(); // Actualizar la posición del obstáculo hacia la izquierda

          // Si el obstáculo sale completamente del canvas, se elimina del array
          if (obstacles[i].offscreen()) {
            obstacles.splice(i, 1);
          }
        }

        let closest: obstacle | null = null; // Encontrar el obstáculo más cercano a la posición del cohete (x=200)
        let record = Infinity; // Distancia más corta encontrada hasta ahora

        for (let obs of obstacles) {
          let distance = obs.x + obs.width - 200; // Calcular la distancia horizontal desde el cohete hasta el obstáculo

          // Si la distancia es positiva (el obstáculo está adelante) y es menor que el récord actual, actualizar el récord y el obstáculo más cercano
          if (distance > 0 && distance < record) {
            record = distance;
            closest = obs;
          }
        }

        // Para cada cohete
        for (let i = cohetes.length - 1; i >= 0; i--) {
          let c = cohetes[i];

          // Recibe el obstáculo más cercano para que el cohete pueda tomar una decisión basada en su posición
          if (closest) {
            c.think(closest, p);
          }
          c.update(); // Actualiza la posición del cohete según la decisión tomada
          c.show(p); // Lo dibuja en la pantalla

          let hit = false;
          if (closest && closest.hits(c, p)) hit = true; // Si el cohete "choca" con el obstáculo, golpeado
          if (c.y > p.height || c.y < 0) hit = true; // Si el cohete sale por arriba o por abajo del canvas, golpeado

          // Si el cohete ha sido golpeado, se mueve del array de cohetes vivos al array de cohetes muertos, y se actualizan los vivos
          if (hit) {
            cohetesMuertos.push(cohetes.splice(i, 1)[0]);
            setVivos(cohetes.length);
          }
        }
        // Si no quedan cohetes vivos, se inicia la siguiente generación
        if (cohetes.length === 0) {
          nextGeneration();
        }
      };

      // Función para pasar a la siguiente generación
      const nextGeneration = () => {
        generacion++;
        setGeneracion(generacion);

        // Seleccionar el mejor cohete de la generación anterior
        let elMejor = cohetesMuertos.reduce((prev, curr) =>
          curr.score > prev.score ? curr : prev,
        );

        // Array de nuevos cohetes mutados del mejor cohete de la generación anterior
        const nuevosCohetes: rocket[] = [];
        for (let i = 0; i < TOTAL; i++) {
          let cerebroCopiado = elMejor.copy();
          let nuevoHijo = new rocket(200, p.height / 2, i, cerebroCopiado);
          if (i > 0) {
            nuevoHijo.mutate(MUTATION_RATE, p);
          }
          nuevosCohetes.push(nuevoHijo);
        }
        // Limpiar los recursos de los cohetes anteriores para evitar fugas de memoria
        for (let c of cohetes) {
          c.brain.dispose();
        }
        // Reset de las variables para la nueva generación
        cohetes = nuevosCohetes;
        cohetesMuertos = [];
        obstacles = [new obstacle(p)];
        frames = 0;
        setVivos(TOTAL);
      };
    };

    const myP5 = new p5(juego); // Inicialización de p5

    return () => {
      myP5.remove(); // Limpieza del canvas y recursos de p5
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-500 flex flex-col p-8 font-sans">
      <header>
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-black text-white">Red Neuronal en JS</h1>
        </div>
      </header>

      <main className="flex flex-row justify-around flex-wrap border-2 border-gray-700 p-5 rounded-lg">
        {/* div juego */}
        <div className="w-3xl h-lg bg-gray-800 rounded-lg">
          <h2 className="text-bold text-white p-4">Juego</h2>
          <div ref={canvasRef}></div>
        </div>
        {/* div canvas */}
        <div className="w-3xl h-lg bg-gray-800 rounded-lg">
          <h2 className="text-bold text-white p-4">Información</h2>
          <div className="text-lg text-gray-300 mb-2 grid grid-cols-1 p-5 ">
            <span>
              Generación:{" "}
              <span className="font-bold text-green">{generacion}</span>
            </span>
            <span>
              Cohetes Vivos:{" "}
              <span className="font-bold text-white">{vivos}</span>
            </span>
          </div>
          {/* div configuración */}
          <div className="w-3xl h-lg bg-gray-800 rounded-lg mt-15">
            <h2 className="text-bold text-white p-4">Configuracion</h2>
            <div className="text-lg text-gray-300 mb-2 grid grid-cols-1 p-5">
              <p>Tasa de Mutación: {MUTATION_RATE}</p>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={MUTATION_RATE}
                onChange={(e) => setMutationRate(parseFloat(e.target.value))}
              />
            </div>

            <div className="text-lg text-gray-300 mb-2 grid grid-cols-1 p-5">
              <p>Total de Cohetes: {TOTAL}</p>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={TOTAL}
                onChange={(e) => setTotal(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
        {/* div instrucciones */}
        <div className="w-3xl h-lg bg-gray-800 rounded-lg mt-15"></div>

        <div className="w-3xl h-lg bg-gray-800 rounded-lg mt-15">
          <h2 className="text-bold text-white p-4">Instrucciones</h2>
          <div className="text-lg text-gray-300 mb-2 grid grid-cols-1 p-5">
            <p>Instrucciones para el uso del juego:</p>
            <ul className="list-disc list-inside">
              <li>Utiliza las barras de desplazamiento para ajustar los parámetrosdel modelo.</li>
              <li>Observa cómo los cohetes evolucionan a lo largo de lasgeneraciones.</li>
              <li>El juego reinicia automáticamente al cambiar el número total de cohetes.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
