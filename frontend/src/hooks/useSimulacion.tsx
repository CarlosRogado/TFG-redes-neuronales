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

    const guardarGraficaIndividual = async (tipoGrafica: string, dataObjeto: any[]) => {
        setGuardando(true);
        try {
            await DatabaseService.saveSimulation(`Simulación - ${tipoGrafica} - Generación ${generacion}`, {
                tipo: tipoGrafica,
                contenido: dataObjeto
            });
            toast.success(`Gráfica ${tipoGrafica} guardada en la base de datos`);
        } catch (error: any) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setGuardando(false);
        }
    };

    const handleGuardarTodos = async () => {
        setGuardando(true);
        try {
            const pLineal = DatabaseService.saveSimulation(`Simulación - Lineal - Generación ${generacion}`, { tipo: "Lineal", contenido: historial });
            const pBarras = DatabaseService.saveSimulation(`Simulación - Barchar - Generación ${generacion}`, { tipo: "Barchar", contenido: barcharData });
            const pForense = DatabaseService.saveSimulation(`Simulación - CausaMuerte - Generación ${generacion}`, { tipo: "CausaMuerte", contenido: causaMuerteData });
            const pDispersion = DatabaseService.saveSimulation(`Simulación - Dispersion - Generación ${generacion}`, { tipo: "Dispersion", contenido: datosDispersion });

            await Promise.all([pLineal, pBarras, pForense, pDispersion]);
            toast.success("Todas las gráficas guardadas en la base de datos");
        } catch (error: any) {
            toast.error(`Error al guardar: ${error.message}`);
        } finally {
            setGuardando(false);
        }
    };

    return {
        settings: { totalCohetes, tasaMutacion, tasaElitismo, setTasaMutacion, setTasaElitismo, handleTotalChange },
        datosEnVivo: { esPausa, setEsPausa, generacion, setGeneracion, vivos, setVivos, segundos, setSegundosActuales },
        graficas: { historial, setHistorial, barcharData, setBarcharData, causaMuerteData, setCausaMuerteData, datosDispersion, setDatosDispersion },
        historicos: { historicoBarchar, setHistoricoBarchar, historicoCausaMuerte, setHistoricoCausaMuerte, historicoDispersion, setHistoricoDispersion },
        guardado: { guardando, guardarGraficaIndividual, handleGuardarTodos },
        ref: { generacionref }
    };
}