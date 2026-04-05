import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import rocket from './logic/rocket';
import obstacle from './logic/obstacle';

import './style.css'

function App() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [generacion, setGeneracion] = React.useState(1);
  const [vivos, setVivos] = React.useState(0);

  const [TOTAL] = React.useState(50);
  useEffect(() => {
    const canvasElement = canvasRef.current;

    if (!canvasElement) {
      return;
    }

    const sketch = (p: p5) => {
      let cohetes: rocket[] = [];
      let obstacles: obstacle[] = [];
      let cohetesMuertos: rocket[] = [];
      let frames = 0;
      let genInterna = 1;
      
      p.setup = () => {
              p.createCanvas(750, 500).parent(canvasElement);
        for(let i = 0; i < TOTAL; i++){
          cohetes.push(new rocket(50, p.height/2, i));
        }
        obstacles.push(new obstacle(p));
        setVivos(TOTAL);
      };

      p.draw = () => {
        p.background(20);
        frames++;

        if (frames % 100 === 0) {
          obstacles.push(new obstacle(p));
        }
        for (let i = obstacles.length - 1; i >= 0; i--){
          obstacles[i].show(p);
          obstacles[i].update();
          if (obstacles[i].offscreen()){
            obstacles.splice(i, 1);
          }
        }
        let closest: obstacle | null = null;
        let record = Infinity;
        for (let obs of obstacles){
          let d = (obs.x + obs.width) - 200;
          if (d > 0 && d < record){
            record = d;
            closest = obs;
          }
        }

        for (let i = cohetes.length - 1; i >= 0; i--){
          let c = cohetes[i];

          if(closest){
            c.think(closest, p);
          }
          c.update();
          c.show(p);

          let hit = false;
          if (closest && closest.hits(c,p)) hit = true;
          if (c.y > p.height || c.y < 0) hit = true;
          
          if(hit){
            cohetesMuertos.push(cohetes.splice(i, 1)[0]);
            setVivos(cohetes.length);
          }
        }
        if(cohetes.length === 0){
          nextGeneration();
        }
      };

    const nextGeneration = () => {
      genInterna++;
      setGeneracion(genInterna);

      let elMejor = cohetesMuertos.reduce((prev, curr) =>
        (curr.score > prev.score) ? curr : prev
      );
      const nuevosCohetes: rocket[] = [];
      for (let i = 0; i < TOTAL; i++) {
        let cerebroCopiado = elMejor.copy();
        let nuevoHijo = new rocket (200, p.height/2, i, cerebroCopiado);
        if (i>0){
          nuevoHijo.mutate(0.2, p);
        }
        nuevosCohetes.push(nuevoHijo);
      }
      for (let c of cohetes) {
        c.brain.dispose();
      }
      cohetes = nuevosCohetes;
      cohetesMuertos = [];
      obstacles = [new obstacle(p)];
      frames = 0;
      setVivos(TOTAL);
    };
  };
  const myP5 = new p5(sketch);
  return ()=>{
    myP5.remove();
  };
}, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 font-sans">
      
      {/* Header con Tailwind */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-black text-white tracking-tighter">
          Red Neuronal en JS
        </h1>
      </div>

      {/* Contenedor del Juego */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div 
          ref={canvasRef} 
          className="relative bg-black rounded-lg shadow-2xl border border-slate-800 overflow-hidden"
        />
      </div>

      {/* Dashboard de Stats con Tailwind Grid */}
      <div className="grid grid-cols-2 gap-6 mt-10 w-full max-w-187.5">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Generación</span>
          <span className="text-4xl font-mono text-blue-400">{generacion}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Cohetes Vivos</span>
          <span className="text-4xl font-mono text-green-400">{vivos} <span className="text-lg text-slate-700">/ {TOTAL}</span></span>
        </div>
      </div>

      {/* Footer / Info */}
      <footer className="mt-12 text-slate-600 text-sm italic">
        Desarrollado con React + Vite + TensorFlow.js
      </footer>
    </div>
  )
}

export default App
