import React, { useState } from 'react';

interface CardGraficaProps {
    infoTexto: React.ReactNode;
    children: React.ReactNode;
}

export default function CardGrafica({ infoTexto, children }: CardGraficaProps) {
    const [activeTab, setActiveTab] = useState<'info' | 'comparar'>('info');
  return (
    <div>
        {/* DERECHA: La lógica de pestañas que hicisteis antes */}
        <div className="bg-[#5f6881] text-black rounded-lg overflow-hidden flex flex-col shadow h-full">
          
          <div className="flex bg-[#4e5569]">
            <button 
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-2 transition-colors ${activeTab === 'info' ? 'font-bold text-white  bg-[#5f6881] rounded-tl-lg' : ' text-[#252627] font-semibold hover:bg-[#5f6881] border-b border-white rounded-tl-lg'}`}
            >
              Información
            </button>
            <button 
              onClick={() => setActiveTab('comparar')}
              className={`flex-1 py-2 transition-colors ${activeTab === 'comparar' ? 'font-bold text-white bg-[#5f6881] rounded-tr-lg' : 'text-[#252627] font-semibold hover:bg-[#5f6881] border-b border-white rounded-tr-lg'}`}
            >
              Comparar
            </button>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            {activeTab === 'info' && (
              <div className="h-70 text-md text-white leading-relaxed overflow-y-auto">
                {infoTexto}
              </div>
            )}
            {activeTab === 'comparar' && (
              <div className="flex flex-col h-full relative min-h-[275px]">
                <div className="absolute top-2 right-2 bg-yellow-500/90 text-black text-xs font-bold px-3 py-2 rounded-lg shadow-lg max-w-50 z-10 animate-fade-in border border-yellow-400">
                  <span className="flex items-center gap-1 mb-1">
                    🚧 En construcción
                  </span>
                  Esta gráfica es un clon de la actual. Proximamente permitirá importar gráficas de anteriores generaciones desde la base de datos.
                </div>
                <div className="flex-1 w-full border-2 border-dashed border-slate-500 rounded-lg flex items-center justify-center opacity-70 pointer-events-none p-2">
                  {children}
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
