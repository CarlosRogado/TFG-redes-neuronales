import * as tf from '@tensorflow/tfjs';
import rocket from './rocket';

// Cabeceras del CSV
const HEADERS = [
  'id', 'score', 'fitness',
  ...Array.from({ length: 32 }, (_, i) => `w1_${i}`),   
  ...Array.from({ length: 8 }, (_, i) => `b1_${i}`),
  ...Array.from({ length: 8 }, (_, i) => `w2_${i}`),    
  'b2',
];

export function exportarGeneracionCSV(cohetes: rocket[]): string {
  const filas = cohetes.map((r) => {
    const pesos = r.brain.getWeights();
    const w1 = Array.from(pesos[0].dataSync()); 
    const b1 = Array.from(pesos[1].dataSync());  
    const w2 = Array.from(pesos[2].dataSync());  
    const b2 = pesos[3].dataSync()[0];           

    return [
      r.id, r.score, r.fitness,
      ...w1, ...b1, ...w2, b2,
    ].join(',');
  });

  return [HEADERS.join(','), ...filas].join('\n');
}

export function descargarCSV(csv: string, nombre: string = 'generacion') {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${nombre}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function importarGeneracionCSV(
  file: File,
  totalCohetes: number
): Promise<rocket[]> {
  const text = await file.text();
  const lineas = text.trim().split('\n');
  const cabeceras = lineas[0].split(',');
  
  if (cabeceras[0] !== 'id') {
    throw new Error('Formato CSV inválido');
  }

  const nuevosCohetes: rocket[] = [];
  const datos = lineas.slice(1);

  for (let i = 0; i < Math.min(datos.length, totalCohetes); i++) {
    const cols = datos[i].split(',').map(Number);

    const w1 = cols.slice(3, 35);     
    const b1 = cols.slice(35, 43);    
    const w2 = cols.slice(43, 51);    
    const b2 = [cols[51]];            

    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [4], units: 8, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    const pesosTensors = [
      tf.tensor2d(w1, [4, 8]),
      tf.tensor1d(b1),
      tf.tensor2d(w2, [8, 1]),
      tf.tensor1d(b2),
    ];
    model.setWeights(pesosTensors);

    const r = new rocket(200, 256, i, model);
    nuevosCohetes.push(r);
  }

  for (let i = nuevosCohetes.length; i < totalCohetes; i++) {
    nuevosCohetes.push(new rocket(200, 256, i));
  }

  return nuevosCohetes;
}
