import React, { useEffect, useState } from 'react';
import { DatabaseService } from '../services/DatabaseService';

interface CardGraficaProps {
    infoTexto: React.ReactNode;
    children: React.ReactNode;
    tipoGrafica: string;
    generacionActual: number;
}

export default function CardGrafica({ infoTexto, children, tipoGrafica, generacionActual }: CardGraficaProps) {
  const [pestanaActiva, setPestanaActiva] = useState<'info' | 'comparar'>('info');
  const [datosGuardados, setDatosGuardados] = useState<any[]>([]);
  const [idSeleccionado, setIdSeleccionado] = useState<string>('');
  const [generacionSeleccionada, setGeneracionSeleccionada] = useState<string>('');
  const [cargando, setCargando] = useState(false);
  const [sincronizacionActiva, setSincronizacionActiva] = useState(true);

    useEffect(() => {
      if (pestanaActiva === 'comparar') {
          setCargando(true);
          DatabaseService.obtenerSimulaciones().then((data) => {
            const filtrada = data.filter((d: any) => d.datos?.tipo === tipoGrafica);
            setDatosGuardados(filtrada);
            setCargando(false);
        });
      }
    }, [pestanaActiva, tipoGrafica]);

    useEffect(() => {
      if(sincronizacionActiva){
        const genCompletada = Math.max(1, generacionActual - 1);
        setGeneracionSeleccionada(genCompletada.toString());
      }
    }, [sincronizacionActiva, generacionActual]);

    const handleSelectedId = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setIdSeleccionado(e.target.value);
    };

    const renderHistorico = () => {
      if(!idSeleccionado) return <div className="text-slate-400 text-sm mt-10">Selecciona un elemento guardado para comparar.</div>;

      const item = datosGuardados.find(d => d.id.toString() === idSeleccionado);
      if(item && React.isValidElement(children)) {
        
        const contenido = item.datos.contenido;
        const genDestino = sincronizacionActiva ? Math.max(1, generacionActual -1) : Number(generacionSeleccionada);

        if(Array.isArray(contenido)){
          const datosRecortados = contenido.filter((d: any)=> d.generacion <= genDestino);
          return React.cloneElement(children as React.ReactElement, { data: datosRecortados } as any);
        }

        const keys = Object.keys(contenido).map(Number).sort((a,b) => a - b);
        const maxGen = Math.max(...keys);

        const genFinal = genDestino <= maxGen ? genDestino : maxGen;

        if(contenido[genFinal]){
          return React.cloneElement(children as React.ReactElement, { data: contenido[genFinal] } as any);
        } else {
          return <div className="text-slate-400 text-sm mt-10">No hay datos disponibles para la generación seleccionada.</div>;
        }
      }
      return null;
    };

  return (
    <div>   
        <div className="bg-[#5f6881] text-black rounded-lg overflow-hidden flex flex-col shadow h-full">
          <div className="flex bg-[#4e5569]">
            <button 
              onClick={() => setPestanaActiva('info')}
              className={`flex-1 py-2 transition-colors ${pestanaActiva === 'info' ? 'font-bold text-white  bg-[#5f6881] rounded-tl-lg' : ' text-[#252627] font-semibold hover:bg-[#5f6881] border-b border-white rounded-tl-lg'}`}
            >
              Información
            </button>
            <button 
              onClick={() => setPestanaActiva('comparar')}
              className={`flex-1 py-2 transition-colors ${pestanaActiva === 'comparar' ? 'font-bold text-white bg-[#5f6881] rounded-tr-lg' : 'text-[#252627] font-semibold hover:bg-[#5f6881] border-b border-white rounded-tr-lg'}`}
            >
              Comparar
            </button>
          </div>
          <div className="p-5 flex-1 flex flex-col ">
            {pestanaActiva === 'info' && ( 
              <div className="h-100 text-sm text-slate-300 ovverflow-y-auto pr-2 custom-scrollbar">
                {infoTexto}
              </div>
            )}
            {pestanaActiva === 'comparar' && (
              <div className="flex flex-col relative h-100">
                <div className="relative mb-4">
                  <select
                    value={idSeleccionado}
                    onChange={handleSelectedId}
                    className="w-full appearance-none bg-[#282f44] border border-slate-600 text-slate-200 text-sm font-medium py-2.5 pl-4 pr-10 rounded-lg focus: outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors cursor-pointer"
                    disabled={cargando}
                    >
                      <option value="">-- Seleccionar simulación guardada --</option>
                      {datosGuardados.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  {idSeleccionado && (
                    <div className="flex items-center justify-between mb-4 bg-[#0f1423] py-2.5 px-4 rounded-lg border border-slate-700 shadow-inner">
                      <label className="flex items-center cursor-pointer gap-3 relative group">
                        <input type="checkbox" checked={sincronizacionActiva} onChange={(e) => setSincronizacionActiva(e.target.checked)} className="sr-only peer" />
                        <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 group-hover:after:shadow-md"></div>
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest select-none group-hover:text-white transition-colors">Sincronizar</span>
                      </label>
                    {!sincronizacionActiva ? (
                      <div className="relative">
                        <select
                          value={generacionSeleccionada}
                          onChange={(e)=> setGeneracionSeleccionada(e.target.value)}
                          className="appearance-none bg-[#1c2135] border border-slate-600 text-slate-200 text-xs font-bold py-1.5 pl-3 pr-8 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer shadow-sm"
                        >
                          {(() => {
                            const item = datosGuardados.find(d => d.id.toString() === idSeleccionado);
                            if(!item) return null;
                            const contenido = item.datos.contenido;

                            if(Array.isArray(contenido)){
                              return contenido.map((d: any) => (
                                <option key= {d.generacion} value= {d.generacion}>
                                  Generación {d.generacion}
                                </option>
                              ));
                            } else {
                              return Object.keys(contenido)
                                .sort((a,b) => Number(a) - Number(b))
                                .map((gen) => (
                                  <option key={gen} value={gen}>
                                    Generación {gen}
                                  </option>
                                ));
                            }
                          })()}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    ) : sincronizacionActiva ? (
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                          <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">EN VIVO: GEN {Math.max(1, generacionActual -1)}</span>
                      </div>
                    ) : null}
                    </div>
                  )}
                  <div className="flex-1 w-full bg-[#0f1423] rounded-xl flex items-center justify-center p-2 border border-slate-700/50 shadow-inner">
                    {cargando ? (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span className="text-xs font-semibold tracking-wider">CARGANDO...</span>
                      </div>
                      ) : renderHistorico()}
                  </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
