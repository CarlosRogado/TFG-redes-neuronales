import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import 'katex/dist/katex.min.css';

import Home from "./views/Home";
import Register from "./views/Register";
import Login from "./views/Login";
import Docs from "./views/Docs";
import Simulation from "./views/Simulation";
import LogoRedNeuronal from "./components/Logo.tsx";
import { AuthService } from "./services/AuthService";
import Profile from "./views/Profile.tsx";

function RutaProtegidaSimulacion() {
  if (!AuthService.tieneSesionActiva()) {
    return <Navigate to="/login" replace />;
  }
  return <Simulation />;
}

function BarraNavegacion() {
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setEstaAutenticado(AuthService.tieneSesionActiva());
  }, [location]);

  const manejarCerrarSesion = () => {
    sessionStorage.removeItem("authSession");
    localStorage.removeItem("user_data");
    setEstaAutenticado(false);
    toast.success("Sesión cerrada exitosamente");
    window.location.href = "/";
  };
  return (
    <div className="bg-gray-900 mx-auto flex items-center gap-8 px-4 sm:px-6 lg:px-8 w-full">
      <Link to="/" className="block text-teal-300">
        <span className="sr-only">Inicio</span>
        <LogoRedNeuronal className="w-12 h-12" />
      </Link>
      <div className="flex flex-1 items-center justify-end md:justify-between">
        <nav className="p-4 bg-gray-900 text-white flex gap-4 ">
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
                    Mi Perfil
                  </Link>
                </div>
                <button
                  onClick={manejarCerrarSesion}
                  className="hidden rounded-md border border-red-900/50 px-5 py-2.5 text-sm font-medium text-red-400 transition sm:block hover:bg-red-900/20 hover:text-red-300"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="bottom-right" />
      <BarraNavegacion />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/simulation" element={<RutaProtegidaSimulacion />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
