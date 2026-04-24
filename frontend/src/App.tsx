import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./views/Home";
import Register from "./views/Register";
// import Login from "./views/Login";
// import Docs from "./views/Docs";
import Simulation from "./views/Simulation";
import LogoRedNeuronal from "./components/Logo.tsx"

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-900 mx-auto flex items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="block text-teal-300">
          <span className="sr-only">Home</span>
          <LogoRedNeuronal className="w-12 h-12" />
        </Link>
        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav className="p-4 bg-gray-900 text-white flex gap-4 ">
            <Link to="/" className="hover:text-white/75">Home</Link>
            <Link to="/docs" className="hover:text-white/75">Docs</Link>
            <Link to="/simulation" className="hover:text-white/75">Simulacion</Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <Link to="/login" className="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-500">
                Login
              </Link>

              <Link to="/register" className="hidden rounded-md px-5 py-2.5 text-sm font-medium transition sm:block bg-gray-800 text-white hover:text-white/75">
                Registro
              </Link>
            </div>

            <button className="block rounded-sm bg-gray-800 p-2.5 text-white transition md:hidden  hover:text-white/75">
              <span className="sr-only">Toggle menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        {/*<Route path="/login" element={<Login />} />
        <Route path="/docs" element={<Docs />} /> */}
        <Route path="/simulation" element={<Simulation />} />
        <Route path="*" element={<Home />} /> {/* Ruta comodín para redirigir a Home si no se encuentra la ruta */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;