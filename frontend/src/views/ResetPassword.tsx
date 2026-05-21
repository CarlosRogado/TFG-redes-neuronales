import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    if (!token) {
        return (
            <div className="min-h-screen bg-gray-900 text-white font-sans">
                <main className="flex items-center justify-center min-h-screen px-4 py-10">
                    <section className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800/80 p-8 shadow-2xl backdrop-blur-sm text-center">
                        <div className="mb-4 text-5xl">❌</div>
                        <h1 className="mb-4 text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-red-300 to-orange-300">
                            Enlace inválido
                        </h1>
                        <p className="mb-6 text-gray-300">
                            El enlace de recuperación no es válido o ha expirado.
                        </p>
                        <Link
                            to="/forgot-password"
                            className="inline-block w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-500"
                        >
                            Solicitar nuevo enlace
                        </Link>
                    </section>
                </main>
            </div>
        );
    }

    const esContrasenaValida = newPassword.length >= 8;
    const contrasenasCoinciden = newPassword === confirmPassword;
    const puedeEnviar = esContrasenaValida && contrasenasCoinciden && !cargando;

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        setCargando(true);
        setError('');

        try {
            const response = await fetch('http://localhost:4000/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.error || 'Error al restablecer la contraseña');
            }

            toast.success('Contraseña actualizada correctamente');
            navigate('/login', { state: { toastMessage: '¡Contraseña restablecida! Ahora inicia sesión' } });
        } catch (err: any) {
            setError(err.message || 'Error al conectar con el servidor');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <main className="flex items-center justify-center min-h-screen px-4 py-10">
                <section className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800/80 p-8 shadow-2xl backdrop-blur-sm">
                    <h1 className="mb-2 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-green-300 to-blue-300">
                        Nueva contraseña
                    </h1>
                    <p className="mb-6 text-center text-sm text-gray-400">
                        Introduce tu nueva contraseña
                    </p>

                    <form className="space-y-5" onSubmit={manejarEnvio}>
                        <div>
                            <label htmlFor="newPassword" className="mb-2 block text-sm font-semibold text-gray-200">
                                Nueva contraseña
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Mínimo 8 caracteres"
                                className={`w-full rounded-lg border px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 ${
                                    newPassword === '' || esContrasenaValida
                                        ? 'border-gray-600 bg-gray-900/80 focus:border-blue-500 focus:ring-blue-500/40'
                                        : 'border-red-500 bg-gray-900/80 focus:border-red-500 focus:ring-red-500/40'
                                }`}
                                required
                            />
                            {newPassword !== '' && !esContrasenaValida && (
                                <p className="mt-1 text-xs text-red-400">Mínimo 8 caracteres</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-gray-200">
                                Confirmar contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repite la contraseña"
                                className={`w-full rounded-lg border px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 ${
                                    confirmPassword === '' || contrasenasCoinciden
                                        ? 'border-gray-600 bg-gray-900/80 focus:border-blue-500 focus:ring-blue-500/40'
                                        : 'border-red-500 bg-gray-900/80 focus:border-red-500 focus:ring-red-500/40'
                                }`}
                                required
                            />
                            {confirmPassword !== '' && !contrasenasCoinciden && (
                                <p className="mt-1 text-xs text-red-400">Las contraseñas no coinciden</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!puedeEnviar}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white shadow-lg transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {cargando ? 'Restableciendo...' : 'Restablecer contraseña'}
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
                </section>
            </main>
        </div>
    );
}
