import GameCanvas from "../components/GameCanvas";
import SettingsPanel from "../components/SettingsPanel";
import Stats from "../components/Stats";
import DashboardGraficas from "../components/DashboardGraficas";
import ModalGuardar from "../components/ModalGuardar";
import { useSimulacion } from "../hooks/useSimulacion";
import "../style.css";

export default function Simulation() {
  const { settings, datosEnVivo, graficas, historicos, guardado, ref } = useSimulacion();
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
                totalCohetes={settings.totalCohetes}
                tasaMutacion={settings.tasaMutacion}
                tasaElitismo={settings.tasaElitismo}
                isPausa={datosEnVivo.esPausa}
                onGeneracionChange={datosEnVivo.setGeneracion}
                onVivosChange={datosEnVivo.setVivos}
                onSegundosChange={datosEnVivo.setSegundosActuales}
                onHistorialEntry={(entry) => graficas.setHistorial((prev) => [...prev, entry])}
                onBarcharDataChange={(data) => {
                  graficas.setBarcharData(data);
                  historicos.setHistoricoBarchar(prev => ({...prev, [ref.generacionref.current]: data}));
                }}
                onCausaMuerteChange={(data) => {
                  graficas.setCausaMuerteData(data);
                  historicos.setHistoricoCausaMuerte(prev => ({...prev, [ref.generacionref.current]: data}));
                }}
                onDatosDispersionChange={(data) => {
                  graficas.setDatosDispersion(data);
                  historicos.setHistoricoDispersion(prev => ({...prev, [ref.generacionref.current]: data}));
                }}
              />
            </div>
          </div>
          <div className="flex flex-col h-full">
            <SettingsPanel
              totalCohetes={settings.totalCohetes}
              tasaMutacion={settings.tasaMutacion}
              tasaElitismo={settings.tasaElitismo}
              isPausa={datosEnVivo.esPausa}
              onTotalChange={settings.handleTotalChange}
              onMutacionChange={(e) =>
                settings.setTasaMutacion(parseFloat(e.target.value))
              }
              onElitismoChange={(e) =>
                settings.setTasaElitismo(parseInt(e.target.value))
              }
              onPausaToggle={() => datosEnVivo.setEsPausa(!datosEnVivo.esPausa)}
            />
          </div>
        </div>
        <div>
          <Stats generacion={datosEnVivo.generacion} segundos={datosEnVivo.segundos} vivos={datosEnVivo.vivos} totalCohetes={settings.totalCohetes} />
          <div className="bg-[#282f44] rounded-xl p-6 shadow-lg">
            <DashboardGraficas
              generacion={datosEnVivo.generacion}
              historial={graficas.historial}
              barcharData={graficas.barcharData}
              causaMuerteData={graficas.causaMuerteData}
              datosDispersion={graficas.datosDispersion}
              historicos={historicos}
              guardando={guardado.guardando}
              onGuardarIndividual={guardado.iniciarGuardadoIndividual}
              onGuardarTodas={guardado.handleGuardarTodos}
            />
            <ModalGuardar
              isOpen={guardado.modalGuardar !== null}
              tipo={guardado.modalGuardar?.tipo || ""}
              guardando={guardado.guardando}
              onConfirmar={guardado.confirmarGuardadoIndividual}
              onCerrar={guardado.cancelarGuardado}
              />
          </div>
        </div>
      </main>
    </div>
  );
}