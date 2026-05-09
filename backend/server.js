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

// Verificacion de roles de usuario y CRUD
const isAdmin = async (req, res, next) => {
  const adminUid = req.headers['x-user-uid'];
  if (!adminUid) return res.status(401).json({ error: "Usuario no autorizado" });

  const user = await prisma.user.findUnique({ where: { uid: Number(adminUid) }});
  if (user && user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ error: "Acceso denegado" });
  }
};
// Endpoint para obtener perfil de usuario
app.get('/user-profile/:uid', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { uid: Number(req.params.uid)},
      select: { uid: true, email: true, role: true }
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener perfil de usuario" });
  }
});
// Endpoints para administración de usuarios (solo para Admin)
app.get('/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { uid: true, email: true, role: true }
    });
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener usuarios" });
    }
});
// Endpoint para eliminar usuario (solo para Admin)
app.delete('/admin/users/:uid', isAdmin, async (req, res) => {
  try {
    await prisma.user.delete({ where: { uid: Number(req.params.uid) }});
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (e) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});
// Endpoint para actualizar nombre de simulación (solo para el propietario)
app.put('/simulations/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const userUid = req.headers['x-user-uid'];

  try{
    const sim = await prisma.simulationData.findUnique({ where: { id: Number(id) }});
    if (!sim) return res.status(404).json({ error: "Simulación no encontrada" });

    if (sim.userId !== Number(userUid)) return res.status(403).json({ error: "Acceso denegado" });

    const updated = await prisma.simulationData.update({
      where: { id: Number(id) },
      data: { name }
    });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Error al actualizar simulación" });
  }
});
// Endpoint para eliminar simulación (solo para el propietario)
app.delete('/simulations/:id', async (req, res) => {
  const { id } = req.params;
  const userUid = req.headers['x-user-uid'];

  try{
    const sim = await prisma.simulationData.findUnique({ where: { id: Number(id) }});
    if (sim.userId !== Number(userUid)) return res.status(403).json({ error: "Acceso denegado" });

    await prisma.simulationData.delete({ where: {id: Number(id) }});
    res.json({ message: "Simulación eliminada correctamente" });
  } catch (e) {
    res.status(500).json({ error: "Error al eliminar simulación" });
  }
});
// Endpoint para cambiar la contraseña (solo para el propietario)
app.put('/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userUid = req.headers['x-user-uid'];

  try {
    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ error: "La nueva contraseña debe tener mínimo 8 caracteres" });
    }

    const user = await prisma.user.findUnique({ where: { uid: Number(userUid) }});
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: "Contraseña actual incorrecta" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { uid: Number(userUid) },
      data: { password: hashedNewPassword }
    });
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (e) {
    res.status(500).json({ error: "Error al cambiar contraseña" });
  }
});
// Endpoint para borrar cuenta de usuario (solo para el propietario)
app.delete('/delete-account', async (req, res) => {
  const { currentPassword } = req.body;
  const userUid = req.headers['x-user-uid'];

  try {
    const user = await prisma.user.findUnique({ where: { uid: Number(userUid) }});
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    await prisma.user.delete({ where: { uid: Number(userUid) }});
    res.json({ message: "Cuenta eliminada correctamente" });
  } catch (e) {
    res.status(500).json({ error: "Error al borrar cuenta" });
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