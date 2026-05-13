import React from "react";

interface SettingsPanelProps {
  totalCohetes: number;
  tasaMutacion: number;
  tasaElitismo: number;
  isPausa: boolean;
  onTotalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMutacionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onElitismoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPausaToggle: () => void;
}

export default function SettingsPanel({
  totalCohetes,
  tasaMutacion,
  tasaElitismo,
  isPausa,
  onTotalChange,
  onMutacionChange,
  onElitismoChange,
  onPausaToggle,
}: SettingsPanelProps) {
  return (
    <div className="bg-[#282f44] rounded-xl p-8 shadow-lg flex flex-col">
      <h2 className="text-lg font-bold text-white border-b border-slate-500 pb-3 mb-6">
        Configuración
      </h2>
      <div className="mb-8">
        <button
          onClick={() => onPausaToggle()}
          className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
            isPausa
              ? "bg-red-500/20 hover:bg-red-500/50 text-red-400"
              : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400"
          }`}
        >
          {isPausa ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
              REANUDAR SIMULACIÓN
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                  clipRule="evenodd"
                />
              </svg>
              SIMULACIÓN EN CURSO
            </>
          )}
        </button>
      </div>
      <div className="mb-6">
        <label className="block text-white font-semibold mb-2">
          Población Total: <span className="text-blue-400">{totalCohetes}</span>
        </label>
        <input
          type="range"
          min="10"
          max="200"
          value={totalCohetes}
          onChange={onTotalChange}
          className="w-full cursor-pointer accent-blue-400"
        />
        <p className="text-md text-red-800 mt- p-2 rounded">
          ⚠️ Modificar la población reiniciará la simulación al instante.
        </p>
      </div>
      <div className="mb-10">
        <label className="block text-white font-semibold mb-2">
          Tasa de mutación:{" "}
          <span className="text-purple-400">
            {(tasaMutacion * 100).toFixed(0)}%
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={tasaMutacion}
          onChange={onMutacionChange}
          className="w-full cursor-pointer accent-purple-400"
        />
        <p className="text-xs text-slate-400 mt-1">
          Probabilidad de que un peso sináptico cambie al azar.
        </p>
      </div>
      <div className="mb-10">
        <label className="block text-white font-semibold mb-4">
          Clonación Pura (Elitismo):{" "}
          <span className="text-emerald-400">{tasaElitismo}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={tasaElitismo}
          onChange={onElitismoChange}
          className="w-full cursor-pointer accent-emerald-400"
        />
        <p className="text-xs text-slate-400 mt-1">
          Mutantes: {100 - tasaElitismo}% | Clonados: {tasaElitismo}%
        </p>
      </div>
    </div>
  );
}
