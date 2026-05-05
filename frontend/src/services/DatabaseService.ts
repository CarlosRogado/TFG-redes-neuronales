import { AuthService} from "./AuthService";

export const DatabaseService = {
    saveSimulation: async (name:string, simulationData:any) => {
        try {
            const user = AuthService.getCurrentUser();
            if (!user || !user.uid) {
                throw new Error("Usuario no autenticado");
            }

            const response = await fetch('http://localhost:4000/save-simulation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.uid,
                    name: name,
                    datos: simulationData
                })
            });
            if (!response.ok) {
                throw new Error("Error al guardar la simulación");
            }

            return await response.json();
        } catch (error: any) {
            throw new Error(error.message);
        }
    },
    getSimulation: async () => {
        try {
            const user = AuthService.getCurrentUser();
            if (!user || !user.uid) return [];

            const response = await fetch(`http://localhost:4000/simulations/${user.uid}`);
            if (!response.ok) {
                throw new Error("Error al obtener las simulaciones");
            }
            return await response.json();
         } catch (error: any) {
            throw new Error(error.message);
            return [];
         }
    }
}