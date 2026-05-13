import React, { useState } from 'react';
import { AuthService }  from '../services/AuthService';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    React.useEffect(() => {
      if (AuthService.tieneSesionActiva()) {
        navigate('/simulation', { replace: true });
      }
    }, [navigate]);

    const esEmailValido = email === '' || AuthService.esEmailValido(email);
    const esContrasenaValida = password === '' || AuthService.esContrasenaValida(password);
    const puedeEnviar = esEmailValido && esContrasenaValida && email !== '' && password !== '';

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        setCargando(true);
        setMensaje('');
        setError('');

        try {
            await AuthService.iniciarSesionUsuario(email, password);
            setMensaje('¡Iniciaste sesión exitosamente!');
            toast.success('¡Iniciaste sesión exitosamente!');

            setEmail('');
            setPassword('');

            setTimeout(() => {
                window.location.href = '/';
            }, 500);
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
            toast.error('Error al iniciar sesión');
        } finally {
          setCargando(false);
        }
    };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="flex items-center justify-center min-h-screen px-4 py-10">
        <section className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800/80 p-8 shadow-2xl backdrop-blur-sm">
          <h1 className="mb-2 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-green-300 to-blue-300">
            Iniciar sesión
          </h1>

          <form className="space-y-5" onSubmit={manejarEnvio}>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-200">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@demo.com"
                className={`w-full rounded-lg border px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 ${
                  esEmailValido
                    ? 'border-gray-600 bg-gray-900/80 focus:border-blue-500 focus:ring-blue-500/40'
                    : 'border-red-500 bg-gray-900/80 focus:border-red-500 focus:ring-red-500/40'
                }`}
                required
              />
              {!esEmailValido && (
                <p className="mt-1 text-xs text-red-400">Correo electrónico no válido</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-200">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className={`w-full rounded-lg border px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 ${
                  esContrasenaValida
                    ? 'border-gray-600 bg-gray-900/80 focus:border-blue-500 focus:ring-blue-500/40'
                    : 'border-red-500 bg-gray-900/80 focus:border-red-500 focus:ring-red-500/40'
                }`}
                required
              />
              {!esContrasenaValida && (
                <p className="mt-1 text-xs text-red-400">Mínimo 8 caracteres</p>
              )}
              {password !== '' && (
                <p className="mt-1 text-xs text-gray-400">
                  {password.length}/8 caracteres
                </p>
              )}
            </div>
              <p className="text-xs text-slate-400 italic">* prueba con <strong>admin@admin.es</strong> / <strong>password123</strong></p>
            <button
              type="submit"
              disabled={!puedeEnviar || cargando}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white shadow-lg transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          {mensaje && (
            <p className="mt-4 rounded-lg border border-emerald-700/60 bg-emerald-900/40 px-4 py-3 text-sm text-emerald-300">
              {mensaje}
            </p>
          )}
          {error && (
            <p className="mt-4 rounded-lg border border-red-700/60 bg-red-900/40 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="mt-6 border-t border-gray-700 pt-4">
            <p className="mb-3 text-center text-sm text-gray-400">
              ¿No tienes cuenta?
            </p>
            <Link
              to="/register"
              className="block w-full rounded-lg border border-green-500 bg-transparent px-4 py-3 text-center font-semibold text-green-400 transition hover:bg-green-500/10 focus:outline-none focus:ring-2 focus:ring-green-500/40"
            >
              Regístrate aquí
            </Link>
          </div>

          <p className="mt-4 text-center text-sm text-gray-400">
            <Link to="/" className="font-semibold text-blue-400 transition hover:text-blue-300">
              Volver al inicio
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}