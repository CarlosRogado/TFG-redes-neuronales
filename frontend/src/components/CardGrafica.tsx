import React, { useState } from 'react';

interface CardGraficaProps {
    titulo: string;
    infoTexto: string;
    children: React.ReactNode;
}

export default function CardGrafica({ titulo, infoTexto, children }: CardGraficaProps) {
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
              <div className="flex flex-col h-full items-center justify-center">
                <div className="w-full h-70 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                   {children}
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
