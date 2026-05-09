interface StatsProps {
    generacion: number;
    segundos: number;
    vivos: number;
    totalCohetes: number;
}

export default function Stats({ generacion, segundos, vivos, totalCohetes }: StatsProps) {
    return (
        <div className="bg-[#282f44] rounded-xl shadow-lg border border-slate-700/50 p-4 mb-8 flex justify-between items-center text-center">
            {/* Columna de generación */}
            <div className="flex-1 border-r border-slate-600">
                <div className="text-3xl font-black text-white">{generacion}</div>
                <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">
                    Generación
                </div>
            </div>
            {/* Columna de segundos */}
            <div className="flex-1 border-r border-slate-600">
                <div className="text-3xl font-black text-white">{segundos}</div>
                <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">
                    Segundos
                </div>
            </div>
            {/* Columna de cohete vivos */}
            <div className="flex-1">
                <div className="text-3xl font-black text-white">
                    {vivos}<span className="text-lg text-slate-500">/{totalCohetes}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">
                    Cohetes Vivos
                </div>
            </div>
        </div>
    );
}