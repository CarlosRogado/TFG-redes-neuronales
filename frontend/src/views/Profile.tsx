import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import { toast } from 'sonner';

export default function Profile() {
    const [serverUser, setServerUser] = useState<{ uid: Number; email: string; role: string} | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const sessionRaw = sessionStorage.getItem('authSession');

                if (!sessionRaw) {
                    setLoading(false);
                    return;
                }
                const sessionData = JSON.parse(sessionRaw);
                const uid = sessionData.uid;

                if (!uid) {
                    setLoading(false);
                    return;
                }
                const response = await fetch(`http://localhost:4000/user-profile/${uid}`);

                if (response.ok) {
                    const data = await response.json();
                    setServerUser(data);
                } else {
                    toast.error("Error al cargar el perfil del usuario.");
                }
            } catch (error) {
                toast.error("Fallo de conexión con el servidor.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Cargando perfil...</div>;
    
    if (!AuthService.hasActiveSession()|| !serverUser) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-slate-200 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-[#1c2135] rounded-xl p-6 border border-slate-600 shadow-lg mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-white">Mi Perfil</h1>
                        <p className="text-blue-400">{serverUser.email}</p>
                    </div>
                    <div className="px-4 py-1.5 rounded-full text-sm font-bold bg-blue-500/20 text-blue-400 border border-blue-500/50">
                        {serverUser.role}
                    </div>
                </div>
                {serverUser.role === 'Admin' ? (
                    <AdminPanel adminUid={serverUser.uid} />
                ) : (
                   <UserPanel uid={serverUser.uid} />
                )}
            </div>
        </div>
    );
}

function AdminPanel({ adminUid }: { adminUid: Number }) {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    const fetchUsers = async () => {
        try {
            const response = await fetch(`http://localhost:4000/admin/users`, {
                headers: { 'x-user-uid' : adminUid.toString() }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                toast.error("Error al cargar los usuarios.");
            }
        } catch (error) {
            toast.error("Fallo de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteuser = async (uidToDelete: number, role: string) => {
        if (role === 'Admin') {
            toast.error("No puedes eliminar a otro administrador.");
            return;
        }

        if (window.confirm("¿Seguro que quieres borrar este usuario y todas sus simulaciones? Esta acción no se puede deshacer.")) {
            try{
                const response = await fetch(`http://localhost:4000/admin/users/${uidToDelete}`, {
                    method: 'DELETE',
                    headers: { 'x-user-uid' : adminUid.toString() }
                });
                if (response.ok) {
                    toast.success("Usuario eliminado correctamente.");
                    setUsers(users.filter(u => u.uid !== uidToDelete));
                } else {
                    toast.error("Error al eliminar el usuario.");
                }
            } catch (error) {
                toast.error("Fallo de conexión con el servidor.");
            }
        }
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white border-b border-slate-600 pb-2">Panel de Administración</h2>
            <div className="bg-[#282f44] rounded-xl p-6 border border-slate-700 shadow-lg">
                <h3 className="text-lg font-bold text-teal-300 mb-4 flex justify-between items-center">Gestión de Usuarios</h3>
                <button onClick={fetchUsers} className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded transition">
                    Actualizar
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate300">
                    <thead className="bg-[#1c2135] text-xs uppercase text-slate-400 font-bold">
                        <tr>
                            <th className="px-6 py-4">UID</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate700/50">
                        {loading ? (
                            <tr><td colSpan={4} className="text-center py-6">Cargando usuarios...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={4} className="text-center py-6">No hay usuarios registrados.</td></tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.uid} className="hover:bg-[#1c2135]/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-500">{user.uid}</td>
                                    <td className="px-6 py-4 font-medium text-white">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'Admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDeleteuser(user.uid, user.role)}
                                            disabled={user.role === 'Admin'}
                                            className="text-red-400 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xs bg-red-900/20 px-3 py-1.5 rounded transition">
                                            BORRAR
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
function UserPanel({ uid }: { uid: Number }) {
    const [simulations, setSimulations] = useState<any[]>([]);
    const[loading, setLoading] = useState(true);
    const [password, setPassword] = useState({ current: '', next: '' });

    const fetchSimulations = async () => {
        try {
            const response = await fetch(`http://localhost:4000/simulations/${uid}`);
            if (response.ok) {
                const data = await response.json();
                setSimulations(data);
            }
        } catch (error) {
            toast.error("Fallo de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchSimulations();
    }, []);

    const handleDeletesimulation = async (simId: number) => {
        if(window.confirm("¿Seguro que quieres borrar esta simulación? Esta acción no se puede deshacer.")) {
            try {
                const response = await fetch(`http://localhost:4000/simulations/${simId}`, {
                    method: 'DELETE',
                    headers: { 'x-user-uid' : uid.toString() }
                });
                if (response.ok) {
                    toast.success("Simulación eliminada correctamente.");
                    setSimulations(simulations.filter(s => s.id !== simId));
                } else {
                    toast.error("Error al eliminar la simulación.");
                }
            } catch (error) {
                toast.error("Fallo de conexión con el servidor.");
            }
        }
    };

    const handleRenameSimulation = async (simId: number, currentName: string) => {
        const nuevoNombre = window.prompt("Introduce el nuevo nombre para esta simulación:", currentName);
        if (!nuevoNombre || nuevoNombre.trim() === "") return;

        try {
            const response = await fetch(`http://localhost:4000/simulations/${simId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-uid' : uid.toString()
                },
                body: JSON.stringify({ name: nuevoNombre.trim() })
            });
            if (response.ok) {
                toast.success("Simulación renombrada correctamente.");
                setSimulations(simulations.map(s => s.id === simId ? { ...s, name: nuevoNombre.trim() } : s));
            } else {
                toast.error("Error al renombrar la simulación.");
            }
        } catch (error) {
            toast.error("Fallo de conexión con el servidor.");
        }
    };
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:4000/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-uid' : uid.toString()
                },
                body: JSON.stringify({ currentPassword: password.current, newPassword: password.next })
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message || "Contraseña cambiada correctamente.");
                setPassword({ current: '', next: '' });
            } else {
                toast.error(data.error || "Error al cambiar la contraseña.");
            }
        } catch (error) {
            toast.error("Fallo de conexión con el servidor.");
        }
    };
    const handleDeleteAccount = async () => {
        if (window.confirm("¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer y eliminará todas tus simulaciones.")) {
            const psw = window.prompt("Introduce tu contraseña para poder borrar tu cuenta:");
            if (!psw || psw.trim() === "") {
                toast.error("La contraseña es necesaria para eliminar la cuenta.");
                return;
            }
            try {
                const response = await fetch(`http://localhost:4000/delete-account`, {
                    method: 'DELETE',
                    headers: { 'x-user-uid' : uid.toString() },
                    body: JSON.stringify({ currentPassword: psw })
                });
                if (response.ok) {
                    toast.success("Cuenta eliminada correctamente.");
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = "/";
                } else {
                    toast.error("Error al eliminar la cuenta.");
                }
            } catch (error) {
                toast.error("Fallo de conexión con el servidor.");
            }
        }
    };
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white border-b border-slate-600 pb-2">Gestión de Cuenta</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#282f44] rounded-xl border border-slate-700 shadow-lg overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-blue-300">Mis Simulaciones Guardadas</h3>
                            <p className="text-sm text-slate-400">Historial de los datos genéticos almacenados</p>
                        </div>
                        <span className="bg-slate-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {simulations.length} {simulations.length === 1 ? "Simulación" : "Simulaciones"}
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-100 custom-scrollbar">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-[#1c2135] text-xs uppercase text-slate-400 font-bold">
                                <tr>
                                    <th className="px-6 py-4">Nombre del Archivo</th>
                                    <th className="px-6 py-4">Tipo</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {loading ? (
                                    <tr><td colSpan={3} className="text-center py-6">Cargando simulaciones...</td></tr>
                                ) : simulations.length === 0 ? (
                                    <tr><td colSpan={3} className="text-center py-6">No tienes simulaciones guardadas.</td></tr>
                                ) : (
                                    simulations.map((sim) => (
                                        <tr key={sim.id} className="hover:bg-[#1c2135]/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white wrap-break max-w-50">{sim.name}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${sim.datos?.tipo === 'Barchar' ? 'bg-yellow-500/20 text-yellow-400' : sim.datos?.tipo === 'CausaMuerte' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                    {sim.datos?.tipo || 'Desconocido'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleRenameSimulation(sim.id, sim.name)} className="ml-2 text-yellow-400 hover:text-yellow-300 focus:outline-none">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.343 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => handleDeletesimulation(sim.id)} className="ml-2 text-red-400 hover:text-red-300 focus:outline-none">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                    <div className="bg-[#282f44] rounded-xl p-6 border border-slate-700 shadow-lg flex flex-col gap-6">
                        <form onSubmit={handleChangePassword}>
                            <h3 className="text-lg font-bold text-red-400 mb-4">Seguridad</h3>
                            <div className="space-y-3">
                                <input
                                    type="password"
                                    placeholder="Contraseña actual"
                                    value={password.current}
                                    onChange={(e) => setPassword({ ...password, current: e.target.value })}
                                    className="w-full bg-[#1c2135] border border-slate-600 rounded px-3 py-2 text-sm"
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Nueva contraseña"
                                    value={password.next}
                                    onChange={(e) => setPassword({ ...password, next: e.target.value })}
                                    className="w-full bg-[#1c2135] border border-slate-600 rounded px-3 py-2 text-sm"
                                    required
                                />
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue500 text-white text-xs font-bold py-2">
                                    Cambiar Contraseña
                                </button>
                            </div>
                        </form>
                        <div className="pt-6 border-t border-slate-600 mt-auto">
                            <h3 className="text-lg font-bold text-red-600 mb-2">Zona de peligro</h3>
                            <p className="text-xs text-slate-400 mb-3">Borrar tu cuenta eliminará permanentemente tus datos del servidor</p>
                            <button onClick={handleDeleteAccount} className="w-full bg-red-900/30 hover:bg-red-800 text-red-400 border border-red-800/50 hover:text-white text-sm font-bold py-2 rounded transition-colors">
                                Eliminar Cuenta
                            </button>
                        </div>
                    </div>
            </div>
        </div>
    );
}
