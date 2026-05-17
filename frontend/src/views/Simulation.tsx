import { useRef, useState } from "react";
import GameCanvas from "../components/GameCanvas";
import SettingsPanel from "../components/SettingsPanel";
import { exportarGeneracionCSV, descargarCSV, importarGeneracionCSV } from "../logic/csv";
import rocket from "../logic/rocket";
import Stats from "../components/Stats";
import DashboardGraficas from "../components/DashboardGraficas";
import ModalGuardar from "../components/ModalGuardar";
import { useSimulacion } from "../hooks/useSimulacion";
import "../style.css";

export default function Simulation() {
  const { settings, datosEnVivo, graficas, historicos, guardado, ref } = useSimulacion();
  const getRocketsRef = useRef<(() => rocket[]) | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importedRockets, setImportedRockets] = useState<rocket[] | null>(null);

  const handleExport = () => {
    if (!getRocketsRef.current) return;
    const rockets = getRocketsRef.current();
    if (rockets.length === 0) return;
    const csv = exportarGeneracionCSV(rockets);
    descargarCSV(csv, `generacion-${datosEnVivo.generacion}`);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rockets = await importarGeneracionCSV(file);
      settings.setTotalCohetes(rockets.length);
      setImportedRockets(rockets);
      datosEnVivo.setGeneracion(1);
      graficas.setHistorial([]);
      graficas.setBarcharData([]);
      graficas.setCausaMuerteData([]);
      graficas.setDatosDispersion([]);
    } catch (err: any) {
      alert("Error al importar: " + err.message);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
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
                  SIMULACIÓN
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded transition"
                >
                  EXPORTAR CSV
                </button>
                <button
                  onClick={handleImportClick}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded transition"
                >
                  IMPORTAR CSV
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
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
                onRocketsReady={(getRockets) => { getRocketsRef.current = getRockets; }}
                importedRockets={importedRockets}
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
