export const AuthService ={
    registerUser: async (email:string, password: string, role: string = 'User') => {
        try {
            const response = await fetch('http://localhost:4000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, role }),
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.error || 'Error al registrar el usuario en el servidor');
            }

            return payload;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}