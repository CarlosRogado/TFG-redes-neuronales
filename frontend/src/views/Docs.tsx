import { motion, AnimatePresence } from 'framer-motion';
import { useDocs } from '../hooks/useDocs';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthService } from '../services/AuthService';
import { toast } from 'sonner';
import LogoRedNeuronal from '../components/Logo';

import Intro from '../docs/sections/01-que-es-una-red.mdx';
import ML from '../docs/sections/02-tipos-de-aprendizaje.mdx';
import Tipos from '../docs/sections/03-que-es-una-neurona.mdx';
import Anatomia from '../docs/sections/04-anatomia-neurona.mdx';

const MapaContenido: Record<string, any> = {
  '01': Intro, '02': ML, '03': Tipos, '04': Anatomia
};

const Docs = () => {
  const { idActivo, cambiarSeccion, secciones } = useDocs();
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const ContenidoActivo = MapaContenido[idActivo];

  useEffect(() => {
    setEstaAutenticado(AuthService.tieneSesionActiva());
  }, []);

  const manejarCerrarSesion = () => {
    sessionStorage.removeItem("authSession");
    localStorage.removeItem("user_data");
    setEstaAutenticado(false);
    toast.success("Sesión cerrada exitosamente");
    window.location.href = "/";
  };

  const components = {
    a: ({ href = '', children, ...props }: any) => (
      <a href={href || '#'} {...props} className="text-blue-600 hover:text-blue-800 hover:underline">
        {children}
      </a>
    )
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="bg-gray-900 mx-auto flex items-center gap-8 px-4 sm:px-6 lg:px-8 w-full fixed top-0 left-0 right-0 z-40 h-16 border-b border-gray-700">
        <Link to="/" className="block text-teal-300">
          <span className="sr-only">Inicio</span>
          <LogoRedNeuronal className="w-12 h-12" />
        </Link>
        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav className="p-4 bg-gray-900 text-white flex gap-4">
            <Link to="/" className="hover:text-white/75">
              Inicio
            </Link>
            <div className="w-fit">
              <Link to="/docs" className="hover:text-white/75">
                Documentación
              </Link>
            </div>
            {estaAutenticado ? (
              <>
                <Link to="/simulation" className="hover:text-white/75">
                  Simulación
                </Link>
              </>
            ) : null}
          </nav>
          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              {estaAutenticado ? (
                <>
                  <div className="relative w-fit">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-5 py-2.5 text-sm font-medium text-teal-400 transition hover:bg-gray-700 hover:text-teal-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                      Mi perfil
                    </Link>
                  </div>
                  <button
                    onClick={manejarCerrarSesion}
                    className="hidden rounded-md border border-red-900/50 px-5 py-2.5 text-sm font-medium text-red-400 transition sm:block hover:bg-red-900/20 hover:text-red-300"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        <aside className="w-64 bg-gray-50 border-r border-gray-200 p-6 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto hidden lg:block z-30">
          <nav className="space-y-2">
            {secciones.map((s) => (
              <button
                key={s.id}
                onClick={() => cambiarSeccion(s.id)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  idActivo === s.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s.title}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto lg:ml-64">
          <AnimatePresence mode="wait">
            <motion.div
              key={idActivo}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="prose prose-lg max-w-6xl mx-auto px-8 py-12"
            >
              <ContenidoActivo components={components} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Docs;