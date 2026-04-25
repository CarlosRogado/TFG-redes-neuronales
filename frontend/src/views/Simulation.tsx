import React from "react";
import GameCanvas from "../components/GameCanvas";
import LineChart from "../components/LineChart";
import Barchar from "../components/Barchar";
import CardGrafica from "../components/CardGrafica";
import "../style.css";

export type HistorialEntry = {
    generacion: number;
    maxSegundos: number;
    mediaSegundos: number;
};
export type BarcharData = {
    id: string;
    segundos: number;
};

export default function Simulation() {
  const [generacion, setGeneracion] = React.useState(1); // Estado para la generación actual
  const [vivos, setVivos] = React.useState(0); // Estado para el número de cohetes vivos
  const [historial, setHistorial] = React.useState<HistorialEntry[]>([]); // Estado para almacenar la puntuacion de cada generación.
  const [barcharData, setBarcharData] = React.useState<BarcharData[]>([]); // Estado para almacenar los datos del BarChart
  const [totalCohetes, setTotalCohetes] = React.useState(() => {
    const obtenerTotal = localStorage.getItem("totalCohetes");
    return obtenerTotal ? parseInt(obtenerTotal) : 50; // Si hay un total guardado, usarlo, sino usar 50 por defecto
  });

  const [tasaMutacion, setTasaMutacion] = React.useState(() => {
    const obtenerTasa = localStorage.getItem("tasaMutacion");
    return obtenerTasa ? parseFloat(obtenerTasa) : 0.1; // Si hay una tasa guardada, usarla, sino usar 0.1 por defecto
  });

  const handleMutationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTasaMutacion(value);
    localStorage.setItem("tasaMutacion", value.toString());
  };
  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setTotalCohetes(value);
    localStorage.setItem("totalCohetes", value.toString());
    window.location.reload(); // Recargar la página para reiniciar el juego con el nuevo total de cohetes
  };

  return (
    <div className="min-h-screen bg-gray-900 text-slate-200 font-sans p-6">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div className="mb-8 text-center">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-yellow-500">Red Neuronal en JS</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black rounded-xl overflow-hidden aspect-square relative flex items-center justify-center border border-slate-700 shadow-lg">
            <button className="absolute top-4 left-4 border-2 border-white text-white rounde-full w-8 h-8 flex items-center justify-center text-xs font-bold hover:bg-white hover:text-black transition">
              II
            </button>
            <GameCanvas
              totalCohetes={totalCohetes}
              tasaMutacion={tasaMutacion}
              onGeneracionChange={setGeneracion}
              onVivosChange={setVivos}
              onHistorialEntry={(entry) => {
                setHistorial([...historial, entry]);
              }}
              onBarcharDataChange={setBarcharData}
            />
          </div>
          <div className="bg-[#282f44] rounded-xl p-8 shadow-lg">
            <h2 className="text-lg font-bold text-white border-b border-slate-500 pb-3 mb-8">
              Configuración
            </h2>

            <div className="mb-10">
              <label className="block text-white font-semibold mb-4">
                Cohetes totales
              </label>
              <input
                type="range"
                min="10"
                max="200"
                value={totalCohetes}
                onChange={handleTotalChange}
                className="w-full cursor-pointer accent-white"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-4">
                Tasa de mutación aplicada
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={tasaMutacion}
                onChange={handleMutationChange}
                className="w-full cursor-pointer accent-white"
              />
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-3 gap-4 bg-[#282f44] rounded-xl p-4 shadow-lg text-center divide-x divide-slate-600 mb-8">
            <div className="flex flex-col justify-center">
              <p className="text-3xl font-bold text-white">{generacion}</p>
              <p className="text-sm font-semibold text-slate-300">Generación</p>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-3xl font-bold text-white">{tasaMutacion}</p>
              <p className="text-sm font-semibold text-slate-300">
                Tasa de mutación
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-3xl font-bold text-white">
                {vivos}/{totalCohetes}
              </p>
              <p className="text-sm font-semibold text-slate-300">
                Cohetes totales
              </p>
            </div>
          </div>
          <div className="bg-[#282f44] rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-white pb-3 mb-6">
              Estadísticas
            </h2>
              <span className="flex items-center mb-8">
                <span className="h-px flex-1 bg-linear-to-r from-transparent to-gray-300 dark:to-gray-600"></span>

                <span className="shrink-0 px-4 text-gray-900 dark:text-white">Gráfico lineal</span>

                <span className="h-px flex-1 bg-linear-to-l from-transparent to-gray-300 dark:to-gray-600"></span>
              </span>
            {/* Fila Gráfica 1 (Líneas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Gráfica Izquierda */}
              <div className="flex flex-col">
                <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-1.5 rounded-full w-fit text-sm shadow mb-8">
                  Guardar
                </button>
                <div className="h-70 bg-[#1c2135] rounded-lg  mb-3 flex items-center justify-center text-slate-500 border border-slate-600">
                  <LineChart data={historial} />
                </div>
              </div>
              {/* Caja de Texto Derecha */}
              <div className="bg-white text-black rounded-lg overflow-hidden flex flex-col shadow">
                <CardGrafica titulo="Gráfica de tiempo de supervivencia" infoTexto="Esta gráfica muestra el tiempo que han sobrevivido los cohetes en cada generación. El objetivo es observar cómo la red neuronal va mejorando su capacidad para esquivar los obstáculos a lo largo de las generaciones, lo que se refleja en un aumento del tiempo de supervivencia." >
                    <LineChart data={historial} />
                </CardGrafica>
              </div>
            </div>
            <span className="flex items-center mb-8">
                <span className="h-px flex-1 bg-linear-to-r from-transparent to-gray-300 dark:to-gray-600"></span>

                <span className="shrink-0 px-4 text-gray-900 dark:text-white">Gráfico Barras</span>

                <span className="h-px flex-1 bg-linear-to-l from-transparent to-gray-300 dark:to-gray-600"></span>
              </span>
            {/* Fila Gráfica 1 (Líneas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Gráfica Izquierda */}
              <div className="flex flex-col">
                <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-1.5 rounded-full w-fit text-sm shadow mb-8">
                  Guardar
                </button>
                <div className="h-70 bg-[#1c2135] rounded-lg  mb-3 flex items-center justify-center text-slate-500 border border-slate-600">
                  <Barchar data={barcharData} />
                </div>
              </div>
              {/* Caja de Texto Derecha */}
              <div className="bg-white text-black rounded-lg overflow-hidden flex flex-col shadow">
                <CardGrafica titulo="Gráfica de supervivencia" infoTexto="Esta gráfica muestra el tiempo que han sobrevivido los cohetes en cada generación. El objetivo es observar cómo la red neuronal va mejorando su capacidad para esquivar los obstáculos a lo largo de las generaciones, lo que se refleja en un aumento del tiempo de supervivencia." >
                    <Barchar data={barcharData} />
                </CardGrafica>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
