import React, { useEffect, useState } from 'react';
import { DatabaseService } from '../services/DatabaseService';

interface CardGraficaProps {
    infoTexto: React.ReactNode;
    children: React.ReactNode;
    tipoGrafica: string;
}

export default function CardGrafica({ infoTexto, children, tipoGrafica }: CardGraficaProps) {
    const [activeTab, setActiveTab] = useState<'info' | 'comparar'>('info');
    const [saveData, setSavedData] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      if (activeTab === 'comparar') {
          setIsLoading(true);
          DatabaseService.getSimulation().then((data) => {
            const filtrada = data.filter((d: any) => d.datos?.tipo === tipoGrafica);
            setSavedData(filtrada);
            setIsLoading(false);
        });
      }
    }, [activeTab, tipoGrafica]);

    const renderHistorico = () => {
      if(!selectedId) {
        return <div className="text-slate-400">Selecciona un elemento guardado para comparar.</div>;
      }
      const item = saveData.find(d => d.id.toString() === selectedId);
      if(item && React.isValidElement(children)) {
        const child = children as React.ReactElement<any, any>;
        return React.cloneElement(child, { data: item.datos.contenido } as any);
      }
      return null;
    };

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
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="mb-4 bg-[#1c2135] text-white px-4 py-2 rounded-lg w-max self-start focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar...</option>
                    {saveData.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex-1 w-full border border-slate-500 bg-[#1c2135] rounded-lg flex items-center justify-center text-slate-500">
                    {isLoading ? 'Cargando...' : renderHistorico()}
                  </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
