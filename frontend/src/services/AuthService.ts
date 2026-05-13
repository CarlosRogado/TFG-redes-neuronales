export const AuthService = {
    CLAVE_USUARIO: 'user',
    CLAVE_SESION: 'authSession',

    esEmailValido: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    esContrasenaValida: (password: string): boolean => {
        return !!password && password.length >= 8;
    },

    registrarUsuario: async (email: string, password: string) => {
        try {
            if (!email || !password) {
                throw new Error("Correo electrónico y contraseña son requeridos");
            }

            if (!AuthService.esEmailValido(email)) {
                throw new Error("Correo electrónico no válido");
            }

            if (!AuthService.esContrasenaValida(password)) {
                throw new Error("La contraseña debe tener mínimo 8 caracteres");
            }

            const response = await fetch('http://localhost:4000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.error || 'Error al registrar el usuario');
            }

            return payload;
        } catch (error: any) {
            throw new Error(error.message);
        }
    },

    iniciarSesionUsuario: async (email: string, password: string) => {
        try {
            if (!email || !password) {
                throw new Error("Correo electrónico y contraseña son requeridos");
            }

            if (!AuthService.esEmailValido(email)) {
                throw new Error("Correo electrónico no válido");
            }

            if (!AuthService.esContrasenaValida(password)) {
                throw new Error("La contraseña debe tener mínimo 8 caracteres");
            }

            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.error || 'Error al iniciar sesión');
            }

            localStorage.setItem(AuthService.CLAVE_USUARIO, JSON.stringify({
                uid: payload.uid,
                email: payload.email,
                role: payload.role
            }));

            sessionStorage.setItem(AuthService.CLAVE_SESION, JSON.stringify({
                uid: payload.uid,
                loggedAt: Date.now()
            }));

            return payload;
        } catch (error: any) {
            throw new Error(error.message);
        }
    },

    cerrarSesionUsuario: () => {
        localStorage.removeItem(AuthService.CLAVE_USUARIO);
        sessionStorage.removeItem(AuthService.CLAVE_SESION);
    },

    obtenerUsuarioActual: () => {
        const user = localStorage.getItem(AuthService.CLAVE_USUARIO);
        return user ? JSON.parse(user) : null;
    },

    tieneSesionActiva: (): boolean => {
        const session = sessionStorage.getItem(AuthService.CLAVE_SESION);
        const user = localStorage.getItem(AuthService.CLAVE_USUARIO);
        return !!session && !!user;
    }
}