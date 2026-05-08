import React from "react";
import { usePersistentState } from "../hooks/usePersistentState";
import GameCanvas from "../components/GameCanvas";
import SettingsPanel from "../components/SettingsPanel";
import LineChart from "../components/LineChart";
import Barchar from "../components/Barchar";
import CardGrafica from "../components/CardGrafica";
import PieChart from "../components/PieChart";
import DispersionChart from "../components/DispersionChart";
import type { DatosDispersion } from "../components/GameCanvas";
import "../style.css";
import { toast } from "sonner";
import { DatabaseService } from "../services/DatabaseService";

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
  // Estados para controlar la simulación y almacenar datos para las gráficas
  const [esPausa, setEsPausa] = React.useState(false); // Estado para controlar si el juego está en pausa o no
  const [generacion, setGeneracion] = React.useState(1); // Estado para la generación actual
  const [vivos, setVivos] = React.useState(0); // Estado para el número de cohetes vivos
  const [segundos, setSegundosActuales] = React.useState(0); // Estado para los segundos transcurridos en la generación actual

  // Estados para las gráficas
  const [historial, setHistorial] = React.useState<HistorialEntry[]>([]); // Estado para almacenar la puntuacion de cada generación.
  const [barcharData, setBarcharData] = React.useState<BarcharData[]>([]); // Estado para almacenar los datos del BarChart
  const [causaMuerteData, setCausaMuerteData] = React.useState<
    { name: string; value: number }[]
  >([]); // Estado para almacenar los datos del PieChart
  const [datosDispersion, setDatosDispersion] = React.useState<
    DatosDispersion[]
  >([]); // Estado para almacenar los datos del DispersionChart

  // Referencia de la generacion para el p5
  const generacionref = React.useRef(generacion);
  React.useEffect(()=>{
    generacionref.current = generacion;
  }, [generacion]);
  // Diccionarios historicos para guardar todas las generaciones
  const [historicoBarchar, setHistoricoBarchar] = React.useState<Record<number, BarcharData[]>>({});
  const [historicoCausaMuerte, setHistoricoCausaMuerte] = React.useState<Record<number, { name: string; value: number }[]>>({});
  const [historicoDispersion, setHistoricoDispersion] = React.useState<Record<number, DatosDispersion[]>>({});

  // Estados persistentes
  const [totalCohetes, setTotalCohetes] = usePersistentState("totalCohetes",100,); // Estado para el total de cohetes, con persistencia en localStorage
  const [tasaMutacion, setTasaMutacion] = usePersistentState(
    "tasaMutacion",
    0.3,
  ); // Estado para la tasa de mutación, con persistencia en localStorage
  const [tasaElitismo, setTasaElitismo] = usePersistentState(
    "tasaElitismo",
    10,
  ); // Estado para la tasa de elitismo, con persistencia en localStorage

  const [guardando, setGuardando] = React.useState(false);

  // Funciones de cambio
  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setTotalCohetes(value);
    localStorage.setItem("totalCohetes", value.toString());
    window.location.reload(); // Recargar la página para reiniciar el juego con el nuevo total de cohetes
  };

  const guardarGraficaIndividual = async (tipoGrafica: string, datos: any) => {
    try{
      const datosSim = {
        tipo: tipoGrafica,
        contenido: datos
      };

      await DatabaseService.saveSimulation(`Simulación - ${tipoGrafica} - Generación ${generacion}`, datosSim);
      toast.success(`Datos de ${tipoGrafica} guardados en la base de datos`);
    } catch (error) {
      toast.error(`Error al guardar datos de ${tipoGrafica}: ${(error as Error).message}`);
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 text-slate-200 font-sans p-6">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div className="mb-8 text-center">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-green-300 to-blue-300">
            Redes Neuronales en JS
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#282f44] rounded-xl flex flex-col border border-slate-600 shadow-lg overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-600 bg-[#1c2135]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <h2 className="text-white font-bold tracking-wider">
                  ENTORNO DE SIMULACIÓN
                </h2>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                MOTOR: P5.JS | IA: TENSORFLOW.JS
              </div>
            </div>
            <div className="flex-1 bg-black flex items-center justify-center relative">
              <GameCanvas
                totalCohetes={totalCohetes}
                tasaMutacion={tasaMutacion}
                tasaElitismo={tasaElitismo}
                isPausa={esPausa}
                onGeneracionChange={setGeneracion}
                onVivosChange={setVivos}
                onSegundosChange={setSegundosActuales}
                onHistorialEntry={(entry) => {
                  setHistorial(prev=> [...prev, entry]);;
                }}
                onBarcharDataChange={(data) => {
                  setBarcharData(data);
                  setHistoricoBarchar(prev => ({...prev, [generacionref.current]: data}));
                }}
                onCausaMuerteChange={(data) => {
                  setCausaMuerteData(data);
                  setHistoricoCausaMuerte(prev => ({...prev, [generacionref.current]: data}));
                }}
                onDatosDispersionChange={(data) => {
                  setDatosDispersion(data);
                  setHistoricoDispersion(prev => ({...prev, [generacionref.current]: data}));
                }}
              />
            </div>
          </div>
          <div className="flex flex-col h-full">
            <SettingsPanel
              totalCohetes={totalCohetes}
              tasaMutacion={tasaMutacion}
              tasaElitismo={tasaElitismo}
              isPausa={esPausa}
              onTotalChange={handleTotalChange}
              onMutacionChange={(e) =>
                setTasaMutacion(parseFloat(e.target.value))
              }
              onElitismoChange={(e) =>
                setTasaElitismo(parseInt(e.target.value))
              }
              onPausaToggle={() => setEsPausa(!esPausa)}
            />
          </div>
        </div>
        <div>
          <div className="grid grid-cols-3 gap-4 bg-[#282f44] rounded-xl p-4 shadow-lg text-center divide-x divide-slate-600 mb-8">
            <div className="flex flex-col justify-center">
              <p className="text-3xl font-bold text-white">{generacion}</p>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                Generación
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-3xl font-bold text-white">{segundos}</p>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                Segundos
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-3xl font-bold text-white">
                {vivos}/{totalCohetes}
              </p>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                Cohetes totales
              </p>
            </div>
          </div>
          <div className="bg-[#282f44] rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white pb-3 mb-6">
                Estadísticas de las Redes
              </h2>
              <button
                onClick={() => guardarGraficaIndividual("estadisticas", {generacion, segundos, vivos, totalCohetes})}
                disabled={guardando}
                className="bg-yellow-600 hover:bg-yellow-500 disabled:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-colors flex intems-center gap-2">
                  {guardando ? "Guardando..." : "Guardar Datos"}
                </button>
            </div>
            <span className="flex items-center mb-8">
              <span className="h-px flex-1 bg-linear-to-r from-transparent to-gray-300 dark:to-gray-600"></span>

              <span className="shrink-0 px-4 text-gray-900 dark:text-white">
                Gráfico lineal
              </span>

              <span className="h-px flex-1 bg-linear-to-l from-transparent to-gray-300 dark:to-gray-600"></span>
            </span>
            {/* Fila Gráfica 1 (Líneas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Gráfica Izquierda */}
              <div className="flex flex-col">
                <div className="mt-auto w-fit">
                  <button
                    onClick={() => guardarGraficaIndividual("Lineal", historial)}
                    className="bg-yellow-500 text-black font-bold px-6 py-1.5 rounded-full w-fit text-sm shadow mb-8 cursor-not-allowed"
                  >
                    Guardar
                  </button>
                </div>
                <div className="h-70 bg-[#1c2135] rounded-lg  mb-3 flex items-center justify-center text-slate-500 border border-slate-600">
                  <LineChart data={historial} />
                </div>
              </div>
              {/* Caja de Texto Derecha */}
              <div className="bg-white text-black rounded-lg overflow-hidden flex flex-col shadow">
                <CardGrafica
                  infoTexto={
                    <div className="space-y-3">
                      <p>
                        Esta gráfica monitoriza la capacidad de aprendizaje del
                        algoritmo genético a lo largo del tiempo.
                      </p>
                      <p>
                        La línea{" "}
                        <span className="text-[#10b981] font-bold">
                          principal (verde)
                        </span>{" "}
                        representa el <strong>Fitness Máximo</strong> (el tiempo
                        récord alcanzado por el mejor individuo de cada
                        generación).
                      </p>
                      <p>
                        La línea{" "}
                        <span className="text-blue-400 font-bold">
                          secundaria (azul)
                        </span>{" "}
                        muestra el <strong>Fitness Medio</strong> de toda la
                        población.
                      </p>
                      <p className="text-xs text-slate-200 mt-2 italic">
                        *Una tendencia ascendente en ambas líneas indica que la
                        red neuronal está optimizando su toma de decisiones con
                        éxito.
                      </p>
                    </div>
                  }
                  tipoGrafica="Lineal"
                  generacionActual={generacion}
                >
                  <LineChart data={historial} />
                  
                </CardGrafica>
              </div>
            </div>
            <span className="flex items-center mb-8">
              <span className="h-px flex-1 bg-linear-to-r from-transparent to-gray-300 dark:to-gray-600"></span>

              <span className="shrink-0 px-4 text-gray-900 dark:text-white">
                Gráfico Barras
              </span>

              <span className="h-px flex-1 bg-linear-to-l from-transparent to-gray-300 dark:to-gray-600"></span>
            </span>
            {/* Fila Gráfica 1 (Líneas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Gráfica Izquierda */}
              <div className="flex flex-col">
                <div className="mt-auto w-fit">
                  <button
                    onClick={() => guardarGraficaIndividual('Barras', historicoBarchar)}
                    className="bg-yellow-500 text-black font-bold px-6 py-1.5 rounded-full w-fit text-sm shadow mb-8 cursor-not-allowed"
                  >
                    Guardar
                  </button>
                </div>
                <div className="h-70 bg-[#1c2135] rounded-lg  mb-3 flex items-center justify-center text-slate-500 border border-slate-600">
                  <Barchar data={barcharData} />
                </div>
              </div>
              {/* Caja de Texto Derecha */}
              <div className="bg-white text-black rounded-lg overflow-hidden flex flex-col shadow">
                <CardGrafica
                  infoTexto={
                    <div className="space-y-3">
                      <p>
                        Esta gráfica desglosa el rendimiento individual de la
                        población en tiempo real.
                      </p>
                      <p>
                        Cada barra representa a una red (cohete), y su altura
                        indica los segundos exactos que ha logrado sobrevivir
                        antes de colisionar.
                      </p>
                      <p className="text-xs text-slate-200 mt-2 italic">
                        <strong className="text-blue-300 not-italic">
                          Varianza genética:
                        </strong>{" "}
                        Si hay mucha diferencia entre barras, existe alta
                        diversidad. Si casi todas las barras son idénticas, la
                        población está convergiendo hacia la una misma
                        estrategia.
                      </p>
                    </div>
                  }
                  tipoGrafica="Barras"
                  generacionActual={generacion}
                >
                  <Barchar data={barcharData} />
                </CardGrafica>
              </div>
            </div>
            <span className="flex items-center mb-8">
              <span className="h-px flex-1 bg-linear-to-r from-transparent to-gray-300 dark:to-gray-600"></span>

              <span className="shrink-0 px-4 text-gray-900 dark:text-white">
                Gráfica Forense
              </span>

              <span className="h-px flex-1 bg-linear-to-l from-transparent to-gray-300 dark:to-gray-600"></span>
            </span>
            {/* Fila Gráfica 1 (Líneas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Gráfica Izquierda */}
              <div className="flex flex-col">
                <div className="mt-auto w-fit">
                  <button
                    onClick={() => guardarGraficaIndividual("CausaMuerte", historicoCausaMuerte)}
                    className="bg-yellow-500 text-black font-bold px-6 py-1.5 rounded-full w-fit text-sm shadow mb-8 cursor-not-allowed"
                  >
                    Guardar
                  </button>
                </div>
                <div className="h-70 bg-[#1c2135] rounded-lg  mb-3 flex items-center justify-center text-slate-500 border border-slate-600">
                  <PieChart data={causaMuerteData} />
                </div>
              </div>
              {/* Caja de Texto Derecha */}
              <div className="bg-white text-black rounded-lg overflow-hidden flex flex-col shadow">
                <CardGrafica
                  infoTexto={
                    <div className="space-y-3">
                      <p>
                        Este gráfico actúa como un análisis forense de la
                        generación anterior, clasificando el motivo exacto de
                        colisión de cada cohete.
                      </p>
                      <p>
                        Monitorizar si los cohetes mueren contra obstáculos
                        especificos (
                        <span className="text-red-300 font-bold">
                          Tubo Superior
                        </span>{" "}
                        vs{" "}
                        <span className="text-orange-300 font-bold">
                          Inferior
                        </span>
                        ) o limites del mapa (
                        <span className="text-blue-300 font-bold">Suelo</span> /{" "}
                        <span className="text-green-300 font-bold">Techo</span>)
                        permite detectar si la red nueronal ha desarrollado un{" "}
                        <strong>sesgo evolutivo</strong>
                      </p>
                    </div>
                  }
                  tipoGrafica="CausaMuerte"
                  generacionActual={generacion}
                >
                  <PieChart data={causaMuerteData} />
                </CardGrafica>
              </div>
            </div>
            <span className="flex items-center mb-8">
              <span className="h-px flex-1 bg-linear-to-r from-transparent to-gray-300 dark:to-gray-600"></span>

              <span className="shrink-0 px-4 text-gray-900 dark:text-white">
                Gráfica de pesos
              </span>

              <span className="h-px flex-1 bg-linear-to-l from-transparent to-gray-300 dark:to-gray-600"></span>
            </span>
            {/* Fila Gráfica 1 (Líneas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Gráfica Izquierda */}
              <div className="flex flex-col">
                <div className="mt-auto w-fit">
                  <button
                    onClick={() => guardarGraficaIndividual("Dispersion", historicoDispersion)}
                    className="bg-yellow-500 text-black font-bold px-6 py-1.5 rounded-full w-fit text-sm shadow mb-8 cursor-not-allowed"
                  >
                    Guardar
                  </button>
                </div>
                <div className="h-70 bg-[#1c2135] rounded-lg  mb-3 flex items-center justify-center text-slate-500 border border-slate-600">
                  <DispersionChart data={datosDispersion} />
                </div>
              </div>
              {/* Caja de Texto Derecha */}
              <div className="bg-white text-black rounded-lg overflow-hidden flex flex-col shadow">
                <CardGrafica
                  infoTexto={
                    <div className="space-y-3">
                      <p>
                        Este gráfico mapea la 'estructura cerebral' de cada
                        cohete al inicio de la generación, revelando la
                        diversidad genética de la población.
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
                        <li>
                          <strong>Eje X (Pesos):</strong> Representa la media de
                          los <em>Weights</em> de las sinapsis. Determina la
                          "importancia" que la red neuronal le da a los sensores
                          (distnacia, altura).
                        </li>
                        <li>
                          <strong>Eje Y (Sesgos):</strong> Representa la media
                          de los <em>Biases</em>. Indica la "predisposición"
                          innata del cohete a saltar, independientemente de lo
                          que vean sus sensores.
                        </li>
                      </ul>
                      <p>
                        La gráfica identifica entre <span className="text-green-400 font-bold">cohetes clonados</span> y <span className="text-purple-400 font-bold">cohetes mutados</span>.
                      </p>
                      <p className="text-xs mt-2 italic text-slate-200">
                        * Una nube de puntos dispersa significa que la Tasa de
                        Mutación está generando individuos con estrategias de
                        vuelo muy distintas. Si los puntos se agrupan en el
                        mismo sitio, la población ha convergido (clones).
                      </p>
                    </div>
                  }
                  tipoGrafica="Dispersion"
                  generacionActual={generacion}
                >
                  <DispersionChart data={datosDispersion} />
                </CardGrafica>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
