import { useState, useEffect } from 'react';

interface ModalGuardarProps {
    isOpen: boolean;
    tipo: string;
    guardando: boolean;
    onConfirmar: (nombre: string) => void;
    onCerrar: () => void;
}

export default function ModalGuardar({ isOpen, tipo, guardando, onConfirmar, onCerrar }: ModalGuardarProps) {
    const [nombre, setNombre] = useState("");

    useEffect(() => {
        if (isOpen) setNombre("");
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-[#1c2135] border border-slate-600 p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
                <h3 className="text-xl font-bold text-white mb-2">Guardar {tipo}</h3>
                <p className="text-sm text-slate-400 mb-6">
                    La simulación se ha pausado. Introduce un nombre para este archivo o déjalo vacío para generar uno automáticamente.
                </p>
                <input
                    type="text"
                    placeholder={`Simulación - ${tipo} - Gen X - Fecha`}
                    value={nombre}
                    onChange={(e)=> setNombre(e.target.value)}
                    className="w-full bg-[#0f1423] border border-slate-600 text-white rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 trainsiton-colors"
                    autoFocus
                />
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCerrar}
                        disabled={guardando}
                        className="px-4 py-2 rounded-lg text-slate-300 font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onConfirmar(nombre)}
                        disabled={guardando}
                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors disabled:opacity-50"
                    >
                        {guardando ? "Guardando..." : "Confirmar"}
                    </button>
                </div>

            </div>

        </div>
    );
}

