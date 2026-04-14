import React, { useEffect, useRef } from "react";
import p5 from "p5";
import rocket from "./logic/rocket"; 
import obstacle from "./logic/obstacle"; 
import GameCanvas from "./components/gameCanvas";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./style.css";

type HistorialEntry = {
  segundos: number;
  generacion: number;
};

function App() {
  const [generacion, setGeneracion] = React.useState(1); // Estado para la generación actual
  const [vivos, setVivos] = React.useState(0); // Estado para el número de cohetes vivos
  const [historial, setHistorial] = React.useState<HistorialEntry[]>([]); // Estado para almacenar la puntuacion de cada generación.
  const [totalCohetes, setTotalCohetes] = React.useState(() => {
    const obtenerTotal = localStorage.getItem("totalCohetes");
    return obtenerTotal ? parseInt(obtenerTotal) : 50; // Si hay un total guardado, usarlo, sino usar 50 por defecto
  });
  const handleMutationChange = (value: number) => {
    setTasaMutacion(value);
    localStorage.setItem("tasaMutacion", value.toString());
  };
  const handleTotalChange = (value: number) => {
    setTotalCohetes(value);
    localStorage.setItem("totalCohetes", value.toString());
    window.location.reload(); // Recargar la página para reiniciar el juego con el nuevo total de cohetes
  };
  const [tasaMutacion, setTasaMutacion] = React.useState(() => {
    const obtenerTasa = localStorage.getItem("tasaMutacion");
    return obtenerTasa ? parseFloat(obtenerTasa) : 0.1; // Si hay una tasa guardada, usarla, sino usar 0.1 por defecto
  });
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
          <GameCanvas
            totalCohetes={totalCohetes}
            tasaMutacion={tasaMutacion}
            onGeneracionChange={setGeneracion}
            onVivosChange={setVivos}
            onHistorialEntry={(entry) =>
              setHistorial((prev) => [...prev, entry]) // Agregar nueva entrada al historial cada vez que se recibe una nueva puntuación de generación
            }
          />
        </div>
        {/* div canvas */}
      </main>
    </div>
  );
}

export default App;
