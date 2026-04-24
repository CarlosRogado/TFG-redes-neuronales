import React, { useState } from 'react';
import { AuthService }  from '../services/AuthService';
import { Link } from 'react-router-dom';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('User');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const hanndleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const newUser = await AuthService.registerUser(email, password, role);
            setMessage(`Usuario ${newUser.email} registrado con éxito!`);
            setEmail('');
            setPassword('');
            setRole('User');
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
          <h1 className="mb-2 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-600">
            Crear cuenta
          </h1>
          <p className="mb-8 text-center text-gray-300">
            Registra un usuario para acceder al simulador.
          </p>

          <form className="space-y-5" onSubmit={hanndleSubmit}>
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
                className="w-full rounded-lg border border-gray-600 bg-gray-900/80 px-4 py-3 text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-200">
                Contrasena
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="123456"
                className="w-full rounded-lg border border-gray-600 bg-gray-900/80 px-4 py-3 text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="mb-2 block text-sm font-semibold text-gray-200">
                Rol
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-gray-600 bg-gray-900/80 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Guest">Guest</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white shadow-lg transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Enviando...' : 'Registrar usuario'}
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
            Volver a{' '}
            <Link to="/" className="font-semibold text-blue-400 transition hover:text-blue-300">
              inicio
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
    