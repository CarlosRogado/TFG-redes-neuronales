import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [cargando, setCargando] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [error, setError] = useState('');

    const esEmailValido = email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const puedeEnviar = esEmailValido && email !== '' && !cargando;

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        setCargando(true);
        setError('');

        try {
            const response = await fetch('http://localhost:4000/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.error || 'Error al solicitar recuperación');
            }

            setEnviado(true);
        } catch (err: any) {
            setError(err.message || 'Error al conectar con el servidor');
        } finally {
            setCargando(false);
        }
    };

    if (enviado) {
        return (
            <div className="min-h-screen bg-gray-900 text-white font-sans">
                <main className="flex items-center justify-center min-h-screen px-4 py-10">
                    <section className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800/80 p-8 shadow-2xl backdrop-blur-sm text-center">
                        <div className="mb-4 text-5xl">📧</div>
                        <h1 className="mb-4 text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-green-300 to-blue-300">
                            Revisa tu correo
                        </h1>
                        <p className="mb-6 text-gray-300 leading-relaxed">
                            Si existe una cuenta con <strong className="text-green-400">{email}</strong>,
                            recibirás un enlace para restablecer tu contraseña.
                        </p>
                        <p className="mb-6 text-sm text-gray-400">
                            ¿No ha llegado? Revisa la carpeta de spam o{' '}
                            <button
                                onClick={() => { setEnviado(false); setEmail(''); }}
                                className="text-blue-400 hover:text-blue-300 underline"
                            >
                                inténtalo de nuevo
                            </button>
                        </p>
                        <Link
                            to="/login"
                            className="inline-block w-full rounded-lg border border-green-500 bg-transparent px-4 py-3 text-center font-semibold text-green-400 transition hover:bg-green-500/10"
                        >
                            Volver a iniciar sesión
                        </Link>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <main className="flex items-center justify-center min-h-screen px-4 py-10">
                <section className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800/80 p-8 shadow-2xl backdrop-blur-sm">
                    <h1 className="mb-2 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-green-300 to-blue-300">
                        Recuperar contraseña
                    </h1>
                    <p className="mb-6 text-center text-sm text-gray-400">
                        Te enviaremos un enlace para restablecer tu contraseña
                    </p>

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
                                placeholder="tu@correo.com"
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

                        <button
                            type="submit"
                            disabled={!puedeEnviar}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white shadow-lg transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {cargando ? 'Enviando...' : 'Enviar enlace'}
                        </button>
                    </form>

                    {error && (
                        <p className="mt-4 rounded-lg border border-red-700/60 bg-red-900/40 px-4 py-3 text-sm text-red-300">
                            {error}
                        </p>
                    )}

                    <p className="mt-6 text-center text-sm text-gray-400">
                        <Link to="/login" className="font-semibold text-blue-400 transition hover:text-blue-300">
                            Volver a iniciar sesión
                        </Link>
                    </p>

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
