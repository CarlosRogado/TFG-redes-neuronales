export const AuthService = {
    USER_STORAGE_KEY: 'user',
    SESSION_STORAGE_KEY: 'authSession',

    // Validar email
    isValidEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validar contraseña (mínimo 8 caracteres)
    isValidPassword: (password: string): boolean => {
        return !!password && password.length >= 8;
    },

    // Registrar usuario
    registerUser: async (email: string, password: string) => {
        try {
            // Validaciones locales
            if (!email || !password) {
                throw new Error("Email y contraseña son requeridos");
            }

            if (!AuthService.isValidEmail(email)) {
                throw new Error("Email no válido");
            }

            if (!AuthService.isValidPassword(password)) {
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

    // Login de usuario
    loginUser: async (email: string, password: string) => {
        try {
            // Validaciones locales
            if (!email || !password) {
                throw new Error("Email y contraseña son requeridos");
            }

            if (!AuthService.isValidEmail(email)) {
                throw new Error("Email no válido");
            }

            if (!AuthService.isValidPassword(password)) {
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

            // Guardar datos del usuario persistentes y marcar sesión activa en esta pestaña
            localStorage.setItem(AuthService.USER_STORAGE_KEY, JSON.stringify({
                uid: payload.uid,
                email: payload.email,
                role: payload.role
            }));

            sessionStorage.setItem(AuthService.SESSION_STORAGE_KEY, JSON.stringify({
                uid: payload.uid,
                loggedAt: Date.now()
            }));

            return payload;
        } catch (error: any) {
            throw new Error(error.message);
        }
    },

    // Cerrar sesión
    logoutUser: () => {
        localStorage.removeItem(AuthService.USER_STORAGE_KEY);
        sessionStorage.removeItem(AuthService.SESSION_STORAGE_KEY);
    },

    // Obtener usuario actual
    getCurrentUser: () => {
        const user = localStorage.getItem(AuthService.USER_STORAGE_KEY);
        return user ? JSON.parse(user) : null;
    },

    // Validar si hay sesión activa en la pestaña actual
    hasActiveSession: (): boolean => {
        const session = sessionStorage.getItem(AuthService.SESSION_STORAGE_KEY);
        const user = localStorage.getItem(AuthService.USER_STORAGE_KEY);
        return !!session && !!user;
    }
}