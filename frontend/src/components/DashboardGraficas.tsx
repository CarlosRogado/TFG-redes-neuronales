import CardGrafica from "./CardGrafica";
import LineChart from "./LineChart";
import Barchar from "./Barchar";
import PieChart from "./PieChart";
import DispersionChart from "./DispersionChart";

interface DashboardGraficasProps {
  generacion: number;
  historial: any[];
  barcharData: any[];
  causaMuerteData: any[];
  datosDispersion: any[];
  guardando: boolean;
  onGuardarTodas: () => void;
  onGuardarIndividual: (tipo: string, datos: any[]) => void;
}

export default function DashboardGraficas({
  generacion,
  historial,
  barcharData,
  causaMuerteData,
  datosDispersion,
  guardando,
  onGuardarTodas,
  onGuardarIndividual,
}: DashboardGraficasProps) {
  return (
    <div className="mt-8">
      {/* Titulo y boton global */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-white pb-3 mb-6">
          Estadísticas de las Redes
        </h2>
        <button
          onClick={() => onGuardarTodas()}
          disabled={guardando}
          className="bg-yellow-600 hover:bg-yellow-500 disabled:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-colors flex intems-center gap-2"
        >
          {guardando ? "Guardando..." : "Guardar Gráficas"}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10 items-stretch">
        {/* Gráfica Izquierda (En vivo)*/}
        <div className="flex flex-col bg-[#1c2135] rounded-xl boder border-slate-700 shadow-xl overflow-hidden h-full">
          {/* Cabecera gráfica */}
          <div className="flex justify-between items-center px-5 py-3 bg-[#282f44] border-b border-slate-700">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Evolución del Aprendizaje
              </h3>
            </div>
            {/* Botón guardar gráfica */}
            <button
              onClick={() => onGuardarIndividual("Lineal", historial)}
              className="group flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 hover:bg-emerald-600 text-slate-300 hover:text-white text-xs font-bold rounded-md transition-all duration-300 border border-slate-500 hover:border-emerald-500 shadow-sm"
              title="Guardar datos de esta gráfica"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                ></path>
              </svg>
              GUARDAR
            </button>
          </div>
          {/* Contenido de la gráfica */}
          <div className="flex-1 p-5 flex flex-col bg-[#1c2135]">
            <div className="flex-1 w-full bg-[#0f1423] rounded-xl border border-slate-700/50 shadow-inner flex items-center justify-center p-2 min-h-75">
              <LineChart data={historial} />
            </div>
          </div>
        </div>
        {/* Caja de Texto Derecha */}
        <div className="h-full">
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
                  récord alcanzado por el mejor individuo de cada generación).
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
                  *Una tendencia ascendente en ambas líneas indica que la red
                  neuronal está optimizando su toma de decisiones con éxito.
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
      {/* Fila Gráfica 2 (Barras) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10 items-stretch">
        {/* Gráfica Izquierda (En vivo)*/}
        <div className="flex flex-col bg-[#1c2135] rounded-xl boder border-slate-700 shadow-xl overflow-hidden h-full">
          {/* Cabecera gráfica */}
          <div className="flex justify-between items-center px-5 py-3 bg-[#282f44] border-b border-slate-700">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Evolución del Aprendizaje
              </h3>
            </div>
            {/* Botón guardar gráfica */}
            <button
              onClick={() => onGuardarIndividual("Barras", barcharData)}
              className="group flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 hover:bg-emerald-600 text-slate-300 hover:text-white text-xs font-bold rounded-md transition-all duration-300 border border-slate-500 hover:border-emerald-500 shadow-sm"
              title="Guardar datos de esta gráfica"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                ></path>
              </svg>
              GUARDAR
            </button>
          </div>
          {/* Contenido de la gráfica */}
          <div className="flex-1 p-5 flex flex-col bg-[#1c2135]">
            <div className="flex-1 w-full bg-[#0f1423] rounded-xl border border-slate-700/50 shadow-inner flex items-center justify-center p-2 min-h-75">
              <Barchar data={barcharData} />
            </div>
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
                  Cada barra representa a una red (cohete), y su altura indica
                  los segundos exactos que ha logrado sobrevivir antes de
                  colisionar.
                </p>
                <p className="text-xs text-slate-200 mt-2 italic">
                  <strong className="text-blue-300 not-italic">
                    Varianza genética:
                  </strong>{" "}
                  Si hay mucha diferencia entre barras, existe alta diversidad.
                  Si casi todas las barras son idénticas, la población está
                  convergiendo hacia la una misma estrategia.
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
      {/* Fila Gráfica 3 (Causa de Muerte) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Gráfica Izquierda */}
        <div className="flex flex-col">
          <div className="mt-auto w-fit">
            <button
              onClick={() =>
                onGuardarIndividual("CausaMuerte", causaMuerteData)
              }
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
                  Este gráfico actúa como un análisis forense de la generación
                  anterior, clasificando el motivo exacto de colisión de cada
                  cohete.
                </p>
                <p>
                  Monitorizar si los cohetes mueren contra obstáculos
                  especificos (
                  <span className="text-red-300 font-bold">Tubo Superior</span>{" "}
                  vs <span className="text-orange-300 font-bold">Inferior</span>
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
      {/* Fila Gráfica 4 (Dispersión) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Gráfica Izquierda */}
        <div className="flex flex-col">
          <div className="mt-auto w-fit">
            <button
              onClick={() =>
                onGuardarIndividual("Dispersion", datosDispersion)
              }
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
                  Este gráfico mapea la 'estructura cerebral' de cada cohete al
                  inicio de la generación, revelando la diversidad genética de
                  la población.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
                  <li>
                    <strong>Eje X (Pesos):</strong> Representa la media de los{" "}
                    <em>Weights</em> de las sinapsis. Determina la "importancia"
                    que la red neuronal le da a los sensores (distnacia,
                    altura).
                  </li>
                  <li>
                    <strong>Eje Y (Sesgos):</strong> Representa la media de los{" "}
                    <em>Biases</em>. Indica la "predisposición" innata del
                    cohete a saltar, independientemente de lo que vean sus
                    sensores.
                  </li>
                </ul>
                <p>
                  La gráfica identifica entre{" "}
                  <span className="text-green-400 font-bold">
                    cohetes clonados
                  </span>{" "}
                  y{" "}
                  <span className="text-purple-400 font-bold">
                    cohetes mutados
                  </span>
                  .
                </p>
                <p className="text-xs mt-2 italic text-slate-200">
                  * Una nube de puntos dispersa significa que la Tasa de
                  Mutación está generando individuos con estrategias de vuelo
                  muy distintas. Si los puntos se agrupan en el mismo sitio, la
                  población ha convergido (clones).
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
  );
}
