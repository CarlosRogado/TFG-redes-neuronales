import { useRef, useEffect } from "react";
import { useLatestRef } from "../hooks/useLatestRef";
import p5 from "p5";
import rocket from "../logic/rocket";
import obstacle from "../logic/obstacle";
import nextGeneration from "../logic/evolution";
import type { HistorialEntry, BarcharData } from "../logic/types";

export type CausaMuerte = {
  name: string;
  value: number;
};
export type DatosDispersion = {
  id: string;
  pesoX: number;
  pesoY: number;
};

type GameCanvasProps = {
  totalCohetes: number;
  tasaMutacion: number;
  tasaElitismo: number;
  isPausa: boolean;
  onGeneracionChange: (generacion: number) => void;
  onVivosChange: (vivos: number) => void;
  onHistorialEntry: (entry: HistorialEntry) => void;
  onBarcharDataChange?: (data: BarcharData[]) => void;
  onCausaMuerteChange?: (causas: CausaMuerte[]) => void;
  onDatosDispersionChange?: (data: DatosDispersion[]) => void;
  onSegundosChange?: (segundos: number) => void;
};

export default function GameCanvas({
  totalCohetes,
  tasaMutacion,
  tasaElitismo,
  isPausa,
  onGeneracionChange,
  onVivosChange,
  onHistorialEntry,
  onBarcharDataChange,
  onCausaMuerteChange,
  onDatosDispersionChange,
  onSegundosChange,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null); 
  const p5InstanceRef = useRef<p5 | null>(null); 

  const tasaMutacionRef = useLatestRef(tasaMutacion); 
  const tasaElitismoRef = useLatestRef(tasaElitismo); 
  const onGeneracionChangeRef = useLatestRef(onGeneracionChange); 
  const onVivosChangeRef = useLatestRef(onVivosChange); 
  const onHistorialEntryRef = useLatestRef(onHistorialEntry); 
  const onCausaMuerteChangeRef = useLatestRef(onCausaMuerteChange);   
  const onDatosDispersionChangeRef = useLatestRef(onDatosDispersionChange); 
   const onSegundosChangeRef = useLatestRef(onSegundosChange); 

  useEffect(() => {
    if (p5InstanceRef.current) {
      if (isPausa) {
        p5InstanceRef.current.noLoop(); 
      } else {
        p5InstanceRef.current.loop(); 
      }
    }
  }, [isPausa]);

  useEffect(() => {
    const canvasElement = canvasRef.current; 
    if (!canvasElement) return;

    const juego = (p: p5) => {
      let cohetes: rocket[] = [];
      let obstacles: obstacle[] = [];
      let cohetesMuertos: rocket[] = [];
      let frames = 0;
      let generacion = 1;
      let generando = false;
      p.setup = () => {
        p.createCanvas(768, 512).parent(canvasElement); 

        for (let i = 0; i < totalCohetes; i++) {
          cohetes.push(new rocket(200, p.height / 2, i));
        }

        obstacles.push(new obstacle(p));
        onVivosChangeRef.current(totalCohetes);
        onGeneracionChangeRef.current(generacion);
      };
      p.draw = () => {
        p.background(20);
        frames++;

        if (frames % 150 === 0) {
          obstacles.push(new obstacle(p));
        }

        if (frames % 60 === 0) {
          if (cohetes.length > 0) {
            const currentFrames = cohetes[cohetes.length - 1].score;
            const currentSegundos = (currentFrames / 60).toFixed(0);
            onSegundosChangeRef.current?.(Number(currentSegundos));
          } else {
            onSegundosChangeRef.current?.(0);
          }

          const currentBarcharData = [...cohetesMuertos, ...cohetes].map((currentRocket) => ({
              id: `Cohete ${currentRocket.id + 1}`,
              segundos: Number((currentRocket.score / 60).toFixed(2)),
            }),
          );
          if (onBarcharDataChange) {
            onBarcharDataChange(currentBarcharData);
          }
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
          obstacles[i].show(p);
          obstacles[i].update();
          if (obstacles[i].offscreen()) {
            obstacles.splice(i, 1);
          }
        }

        let closest: obstacle | null = null;
        let record = Infinity;

        for (const obs of obstacles) {
          const distance = obs.x + obs.width - 200;
          if (distance > 0 && distance < record) {
            record = distance;
            closest = obs;
          }
        }

        for (let i = cohetes.length - 1; i >= 0; i--) {
          const cohete = cohetes[i];

          if (closest && frames % 8 === 0) {
            cohete.think(closest, p);
          }

          cohete.update();
          cohete.show(p);

          let hit = false;
          if (closest && closest.hits(cohete, p)) {
            hit = true;
          } else if (cohete.y + cohete.height > p.height) {
            cohete.causaMuerte = "Suelo";
            hit = true;
          } else if (cohete.y < 0) {
            cohete.causaMuerte = "Techo";
            hit = true;
          }
          if (hit) {
            cohetesMuertos.push(cohete);
            cohetes.splice(i, 1);
          }
        }

        if (frames % 8 === 0) {
          onVivosChangeRef.current(cohetes.length);
        }

        if (cohetes.length === 0 && cohetesMuertos.length > 0 && !generando) {
          const causasCount: Record<string, number> = {
            "Tubo Superior": 0,
            "Tubo Inferior": 0,
            Suelo: 0,
            Techo: 0,
          };
          cohetesMuertos.forEach((cohete) => {
            if (causasCount[cohete.causaMuerte] !== undefined) {
              causasCount[cohete.causaMuerte]++;
            }
          });
          const causas = Object.keys(causasCount).map((key) => ({
            name: key,
            value: causasCount[key],
          }));
          generando = true;
          nextGeneration({
            p,
            cohetesMuertos,
            totalCohetes,
            tasaMutacion: tasaMutacionRef.current,
            tasaElitismo: tasaElitismoRef.current,
            frames,
            generacion,
          }).then((result) => {
            generando = false;
            onCausaMuerteChangeRef.current?.(causas);
            onDatosDispersionChangeRef.current?.(result.datosDispersion);
            cohetes = result.cohetes;
            obstacles = result.obstacles;
            cohetesMuertos = result.cohetesMuertos;
            frames = result.frames;
            generacion = Number(result.generacion);

            onGeneracionChangeRef.current(generacion);
            onVivosChangeRef.current(totalCohetes);
            onHistorialEntryRef.current({
              maxSegundos: Number(result.historialEntry.maxSegundos),
              mediaSegundos: Number(result.historialEntry.mediaSegundos),
              generacion: Number(result.historialEntry.generacion),
            });
            onSegundosChangeRef.current?.(0);
          });
        }
      };
    };
    const p5Instance = new p5(juego);
    p5InstanceRef.current = p5Instance;

    return () => {
      p5Instance.remove();
    };
  }, [totalCohetes]);
  return (
    <div className="w-3xl h-lg bg-gray-800 rounde-lg">
      <div ref={canvasRef} />
    </div>
  );
}
