const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const app = express(); // API REST para el backend

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@simulation.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '1234';

async function ensureAdminUser() {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      password: hashedPassword,
      role: 'Admin'
    },
    create: {
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'Admin'
    }
  });
}

app.use(cors()); // Permite solicitudes desde el frontend
app.use(express.json({limit:'50mb'})); // Permite recibir JSON en el body de las solicitudes
app.use(express.urlencoded({limit:'50mb',extended:true}));

// Validación de email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validación de contraseña (mínimo 8 caracteres)
function isValidPassword(password) {
  return password && password.length >= 8;
}

// Endpoint para registrar un nuevo usuario
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Email no válido" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ error: "La contraseña debe tener mínimo 8 caracteres" });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'User'
      }
    });

    res.json({
      uid: user.uid,
      email: user.email,
      role: user.role,
      message: "Usuario registrado exitosamente"
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// Endpoint para login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Email no válido" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ error: "La contraseña debe tener mínimo 8 caracteres" });
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: "Email o contraseña incorrectos" });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email o contraseña incorrectos" });
    }

    // Login exitoso
    res.json({
      uid: user.uid,
      email: user.email,
      role: user.role,
      message: "Login exitoso"
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al iniciar sesión" });
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
        datos: data.datos,
      }
    });
    res.json(simulation);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al guardar simulación" });
  }
});

app.get('/simulations/:userId', async (req, res) => {
  try{
    const userIdNum = Number(req.params.userId);
    const simulations = await prisma.simulationData.findMany({
      where: { userId: userIdNum },
      orderBy: { id: 'desc' }
    });
    res.json(simulations);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al obtener simulaciones" });
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