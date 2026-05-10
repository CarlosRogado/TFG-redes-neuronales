import React, { useState } from 'react';
import { AuthService }  from '../services/AuthService';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const isEmailValid = email === '' || AuthService.isValidEmail(email);
    const isPasswordValid = password === '' || AuthService.isValidPassword(password);
    const canSubmit = isEmailValid && isPasswordValid && email !== '' && password !== '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            await AuthService.registerUser(email, password);
            setMessage('¡Registrado exitosamente! Ahora inicia sesión');
            setEmail('');
            setPassword('');

          setTimeout(() => {
            navigate('/login');
          }, 1200);
        } catch (err: any) {
            setError(err.message || 'Error al registrar el usuario');
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="flex items-center justify-center min-h-screen px-4 py-10">
        <section className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800/80 p-8 shadow-2xl backdrop-blur-sm">
          <h1 className="mb-2 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-green-300 to-blue-300">
            Crear cuenta
          </h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-200"
              >
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
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-200"
              >
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
              {loading ? "Registrando..." : "Registrar"}
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

          <p className="mt-6 text-center text-sm text-gray-400">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="font-semibold text-green-400 transition hover:text-green-300"
            >
              Inicia sesión
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-gray-400">
            <Link
              to="/"
              className="font-semibold text-blue-400 transition hover:text-blue-300"
            >
              Volver al inicio
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
    