import { useState, useRef, useEffect } from "react";
import { usePersistentState } from "./usePersistentState";
import { DatabaseService } from "../services/DatabaseService";
import { toast } from "sonner";
import type { HistorialEntry, BarcharData } from "../logic/types";
import type { CausaMuerte, DatosDispersion } from "../components/GameCanvas";

export function useSimulacion() {
    const [totalCohetes, setTotalCohetes] = usePersistentState("totalCohetes", 100);
    const [tasaMutacion, setTasaMutacion] = usePersistentState("tasaMutacion", 0.3);
    const [tasaElitismo, setTasaElitismo] = usePersistentState("tasaElitismo", 10);

    const [esPausa, setEsPausa] = useState(false);
    const [generacion, setGeneracion] = useState(1);
    const [vivos, setVivos] = useState(0);
    const [segundos, setSegundosActuales] = useState(0);

    const [historial, setHistorial] = useState<HistorialEntry[]>([]);
    const [barcharData, setBarcharData] = useState<BarcharData[]>([]);
    const [causaMuerteData, setCausaMuerteData] = useState<CausaMuerte[]>([]);
    const [datosDispersion, setDatosDispersion] = useState<DatosDispersion[]>([]);
    const [modalGuardar, setModalGuardar] = useState<{isOpen: boolean, tipo: string, contenido: any} | null>(null);
    const [guardando, setGuardando] = useState(false);

    const generacionref = useRef(generacion);
    useEffect(() => {
        generacionref.current = generacion;
    }, [generacion]);

    const [historicoBarchar, setHistoricoBarchar] = useState<Record<number, BarcharData[]>>({});
    const [historicoCausaMuerte, setHistoricoCausaMuerte] = useState<Record<number, CausaMuerte[]>>({});
    const [historicoDispersion, setHistoricoDispersion] = useState<Record<number, DatosDispersion[]>>({});

    const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTotalCohetes(parseInt(e.target.value));
        setHistorial([]);
        setHistoricoBarchar({});
        setHistoricoCausaMuerte({});
        setHistoricoDispersion({});
        setGeneracion(1);
        toast.info("Población modificada. Simulación reiniciada.");
    }

    const iniciarGuardadoIndividual = (tipoGrafica: string, dataObjeto: any) => {
        setEsPausa(true);
        setModalGuardar({ isOpen: true, tipo: tipoGrafica, contenido: dataObjeto});
    };

    const confirmarGuardadoIndividual = async (nombre: string) => {
        if(!modalGuardar) return;
        setGuardando(true);
        try{
            let nombreFinal = nombre.trim();
            if(!nombreFinal) {
                const fecha = new Date().toLocaleString();
                nombreFinal = `Simulacion - ${modalGuardar.tipo} - Gen ${generacionref.current} - ${fecha}`;
            }

            const simulacionesPrevias = await DatabaseService.getSimulation();
            const existe = simulacionesPrevias.some((s: any) => s.name.toLowerCase() === nombreFinal.toLowerCase());

            if(existe){
                toast.error("Ya existe una simulación con ese nombre. Por favor elige otro.");
                setGuardando(false);
                return;
            }

            await DatabaseService.saveSimulation(nombreFinal, {
                tipo: modalGuardar.tipo,
                contenido: modalGuardar.contenido
            });
            toast.success("Gráfica guardada exitosamente.");
            setModalGuardar(null);
        } catch (error: any) {
            toast.error("Error al guardar la gráfica: " + error.message);
        } finally {
            setGuardando(false);
        }
    };

    const cancelarGuardado = () => {
        setModalGuardar(null);
        setEsPausa(false);
    }

    const handleGuardarTodos = async () => {
        setEsPausa(true);
        setGuardando(true);
        try {
            const fecha = new Date().toLocaleString();
            const nombre = ` - Gen ${generacionref.current} - ${fecha}`;

            const pLineal = DatabaseService.saveSimulation("Lineal" + nombre, { tipo: "Lineal", contenido: historial });
            const pBarchar = DatabaseService.saveSimulation("Barras" + nombre, { tipo: "Barras", contenido: historicoBarchar });
            const pCausaMuerte = DatabaseService.saveSimulation("Forense" + nombre, { tipo: "Forense", contenido: historicoCausaMuerte });
            const pDispersion = DatabaseService.saveSimulation("Dispersion" + nombre, { tipo: "Dispersion", contenido: historicoDispersion });

            await Promise.all([pLineal, pBarchar, pCausaMuerte, pDispersion]);
            toast.success("Todas las gráficas guardadas exitosamente.");
        } catch (error: any) {
            toast.error("Error al guardar las gráficas: " + error.message);
        } finally {
            setGuardando(false);
        }
    };

    return {
        settings: { totalCohetes, tasaMutacion, tasaElitismo, setTasaMutacion, setTasaElitismo, handleTotalChange },
        datosEnVivo: { esPausa, setEsPausa, generacion, setGeneracion, vivos, setVivos, segundos, setSegundosActuales },
        graficas: { historial, setHistorial, barcharData, setBarcharData, causaMuerteData, setCausaMuerteData, datosDispersion, setDatosDispersion },
        historicos: { historicoBarchar, setHistoricoBarchar, historicoCausaMuerte, setHistoricoCausaMuerte, historicoDispersion, setHistoricoDispersion },
        guardado: { guardando, modalGuardar, iniciarGuardadoIndividual, confirmarGuardadoIndividual, cancelarGuardado, handleGuardarTodos },
        ref: { generacionref }
    };
}