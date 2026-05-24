import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LogoRedNeuronal from '../components/Logo';
import { AuthService } from '../services/AuthService';
import { toast } from 'sonner';

export default function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const [estaAutenticado, setEstaAutenticado] = useState(false);

    useEffect(() => {
        if (location.state?.toastMessage) {
            toast.success(location.state.toastMessage);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    useEffect(() => {
        setEstaAutenticado(AuthService.tieneSesionActiva());
    }, []);

    const manejarIniciarSimulacion = () => {
        navigate('/simulation');
    };

    return (
        <div className="h-full bg-gray-900 text-white font-sans">
            <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <LogoRedNeuronal className="w-50 h-50" />
                <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-green-300 to-blue-300 mb-6">
                   Simulador de Redes Neuronales 
                </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-10">
                Observa cómo una red neuronal aprende a esquivar obstáculos en tiempo real en tu navegador mediante nuestro simulador interactivo.
            </p>
            
            <div className="flex gap-4">
                {estaAutenticado ? (
                    <button type="button" onClick={manejarIniciarSimulacion} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105">
                        Iniciar Simulación 🚀
                    </button>
                ):(
                    <>
                        <Link to="/login" className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105">
                            Iniciar Sesión
                        </Link>
                        <Link to="/register" className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg shadow-lg transition-colors">
                            Crear Cuenta
                        </Link>
                    </>
                )}
            </div>
        </main>

        <section className="py-16 px-8 bg-gray-800">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="p-6 bg-gray-900 rounded-xl shadow-md border border-gray-700">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-bold mb-2">Red neuronal FeedFordward</h3>
                <p className="text-gray-400">Implementación de un perceptrón multicapa usando TensorFlow.js con backend WebGPU o WebGPL.</p>
            </div>

            <div className="p-6 bg-gray-900 rounded-xl shadow-md border border-gray-700">
                <div className="text-4xl mb-4">🧬</div>
                <h3 className="text-xl font-bold mb-2">Algoritmo Genético</h3>
                <p className="text-gray-400">Selección natural basada en Fitness, clonación y mutaciones aleatorias.</p>
            </div>

            <div className="p-6 bg-gray-900 rounded-xl shadow-md border border-gray-700">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2">Analítica en vivo</h3>
                <p className="text-gray-400">Visualización de datos en tiempo real mediante gráficas y persistencia en BBDD.</p>
            </div>

            </div>
        </section>

        <footer className="text-center py-6 text-gray-500 border-t border-gray-800">
            <p>Trabajo de Fin de Grado - Desarrollo de Aplicaciones Web</p>
            <p className="text-sm mt-1">© 2026 Víctor Vicente Díaz y Carlos Rogado Caamaño</p>
        </footer>
        </div>
    );
}