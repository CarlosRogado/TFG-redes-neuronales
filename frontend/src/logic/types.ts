export type HistorialEntry = {
    generacion: number;
    maxSegundos?: number;
    mediaSegundos?: number;
    mejorFitness?: number;
    promedioFitness?: number;
    peorFitness?: number;
}

export type BarcharData = {
    id: string;
    segundos: number;
};