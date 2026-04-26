import React, { useState } from 'react';
import { AuthService }  from '../services/AuthService';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    React.useEffect(() => {
      if (AuthService.hasActiveSession()) {
        navigate('/simulation', { replace: true });
      }
    }, [navigate]);

    // Validaciones en tiempo real
    const isEmailValid = email === '' || AuthService.isValidEmail(email);
    const isPasswordValid = password === '' || AuthService.isValidPassword(password);
    const canSubmit = isEmailValid && isPasswordValid && email !== '' && password !== '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            await AuthService.loginUser(email, password);
            setMessage('¡Iniciaste sesión exitosamente!');
            toast.success('¡Iniciaste sesión exitosamente!');

            // Limpiar formulario
            setEmail('');
            setPassword('');

            // Redirigir a la página de simulación después de 1.5 segundos
            setTimeout(() => {
                window.location.href = '/';
            }, 500);
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
            toast.error('Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="flex items-center justify-center min-h-screen px-4 py-10">
        <section className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800/80 p-8 shadow-2xl backdrop-blur-sm">
          <h1 className="mb-2 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-green-300 to-blue-300">
            Iniciar sesión
          </h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-200">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@demo.com"
                className={`w-full rounded-lg border px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 ${
                  isEmailValid
                    ? 'border-gray-600 bg-gray-900/80 focus:border-blue-500 focus:ring-blue-500/40'
                    : 'border-red-500 bg-gray-900/80 focus:border-red-500 focus:ring-red-500/40'
                }`}
                required
              />
              {!isEmailValid && (
                <p className="mt-1 text-xs text-red-400">Email no válido</p>
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
                  isPasswordValid
                    ? 'border-gray-600 bg-gray-900/80 focus:border-blue-500 focus:ring-blue-500/40'
                    : 'border-red-500 bg-gray-900/80 focus:border-red-500 focus:ring-red-500/40'
                }`}
                required
              />
              {!isPasswordValid && (
                <p className="mt-1 text-xs text-red-400">Mínimo 8 caracteres</p>
              )}
              {password !== '' && (
                <p className="mt-1 text-xs text-gray-400">
                  {password.length}/8 caracteres
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white shadow-lg transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          {message && (
            <p className="mt-4 rounded-lg border border-emerald-700/60 bg-emerald-900/40 px-4 py-3 text-sm text-emerald-300">
              {message}
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
              Registrarse aquí
            </Link>
          </div>

          <p className="mt-4 text-center text-sm text-gray-400">
            <Link to="/" className="font-semibold text-green-400 transition hover:text-green-300">
              Volver al inicio
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}