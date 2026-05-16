import { useRef, useEffect } from "react";
import { useLatestRef } from "../hooks/useLatestRef";
import { CANVAS_W, CANVAS_H } from "../logic/constants";
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
  onRocketsReady?: (getRockets: () => rocket[]) => void;
  importedRockets?: rocket[] | null;
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
  onRocketsReady,
  importedRockets,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  const tasaMutacionRef = useLatestRef(tasaMutacion);
  const tasaElitismoRef = useLatestRef(tasaElitismo);
  const isPausaRef = useRef(isPausa);
  const onGeneracionChangeRef = useLatestRef(onGeneracionChange);
  const onVivosChangeRef = useLatestRef(onVivosChange);
  const onHistorialEntryRef = useLatestRef(onHistorialEntry);
  const onBarcharDataChangeRef = useLatestRef(onBarcharDataChange);
  const onCausaMuerteChangeRef = useLatestRef(onCausaMuerteChange);
  const onDatosDispersionChangeRef = useLatestRef(onDatosDispersionChange);
  const onSegundosChangeRef = useLatestRef(onSegundosChange);

  useEffect(() => {
    isPausaRef.current = isPausa;
  }, [isPausa]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let cohetes: rocket[] = [];
    let obstacles: obstacle[] = [];
    let cohetesMuertos: rocket[] = [];
    let frames = 0;
    let generacion = 1;
    let generando = false;

    if (importedRockets && importedRockets.length > 0) {
      cohetes = importedRockets;
    } else {
      for (let i = 0; i < totalCohetes; i++) {
        cohetes.push(new rocket(200, CANVAS_H / 2, i));
      }
    }
    obstacles.push(new obstacle());
    onVivosChangeRef.current(cohetes.length);
    onGeneracionChangeRef.current(generacion);

    if (onRocketsReady) {
      onRocketsReady(() => cohetes);
    }

    function gameLoop() {
      if (!isPausaRef.current) {
        frames++;

        ctx.fillStyle = "#141414";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        if (frames % 150 === 0) {
          obstacles.push(new obstacle());
        }

        if (frames % 60 === 0) {
          if (cohetes.length > 0) {
            const f = cohetes[cohetes.length - 1].score;
            onSegundosChangeRef.current?.(Math.floor(f / 60));
          } else {
            onSegundosChangeRef.current?.(0);
          }
        }

        if (frames % 60 === 0) {
          const currentBarcharData = [...cohetesMuertos, ...cohetes].map(
            (r) => ({
              id: `Cohete ${r.id + 1}`,
              segundos: Number((r.score / 60).toFixed(2)),
            })
          );
          onBarcharDataChangeRef.current?.(currentBarcharData);
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
          obstacles[i].show(ctx);
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
            cohete.think(closest);
          }

          cohete.update();
          cohete.show(ctx);

          let hit = false;
          if (closest && closest.hits(cohete)) {
            hit = true;
          } else if (cohete.y + cohete.height > CANVAS_H) {
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
          cohetesMuertos.forEach((c) => {
            if (causasCount[c.causaMuerte] !== undefined) {
              causasCount[c.causaMuerte]++;
            }
          });
          const causas = Object.keys(causasCount).map((key) => ({
            name: key,
            value: causasCount[key],
          }));

          generando = true;
          nextGeneration({
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
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    }

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationRef.current);
      [...cohetes, ...cohetesMuertos].forEach((r) => {
        try {
          r.brain.dispose();
        } catch (_) {}
      });
    };
  }, [totalCohetes, importedRockets]);

  return (
    <div className="w-3xl h-lg bg-gray-800 rounded-lg flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="block"
      />
    </div>
  );
}
