const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express(); // API REST para el backend

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@simulation.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '1234';

async function ensureAdminUser() {
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      password: ADMIN_PASSWORD,
      role: 'Admin'
    },
    create: {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'Admin'
    }
  });
}

app.use(cors()); // Permite solicitudes desde el frontend
app.use(express.json()); // Permite recibir JSON en el body de las solicitudes

// Endpoint para simular el AuthService (Register)
app.post('/register', async (req, res) => {
  const { email, password, role } = req.body; // Req.body es el POST enviado desde el frontend
  try {
    const user = await prisma.user.create({
      data: { email, password, role }
    });
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: "Error al crear usuario" });
  }
});

// Endpoint para el DatabaseService (saveSimulation)
app.post('/save-simulation', async (req, res) => {
  const data = req.body;
  try {
    const simulation = await prisma.simulationData.create({
      data: {
        userId: Number(data.userId),
        name: data.name,
      }
    });
    res.json(simulation);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al guardar simulación" });
  }
});






async function startServer() {
  try {
    await ensureAdminUser();
    app.listen(4000, () => console.log('Backend listo'));
  } catch (e) {
    console.error('No se pudo inicializar el backend:', e);
    process.exit(1);
  }
}

startServer();