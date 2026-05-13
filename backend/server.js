const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const app = express(); 

const EMAIL_ADMIN = process.env.ADMIN_EMAIL || 'admin@simulation.local';
const CONTRASENA_ADMIN = process.env.ADMIN_PASSWORD || '1234';

async function asegurarUsuarioAdmin() {
  const hashedPassword = await bcrypt.hash(CONTRASENA_ADMIN, 10);
  await prisma.user.upsert({
    where: { email: EMAIL_ADMIN },
    update: {
      password: hashedPassword,
      role: 'Admin'
    },
    create: {
      email: EMAIL_ADMIN,
      password: hashedPassword,
      role: 'Admin'
    }
  });
}

app.use(cors()); 
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb',extended:true}));

function esEmailValido(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function esContrasenaValida(password) {
  return password && password.length >= 8;
}

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  try {

    if (!email || !password) {
      return res.status(400).json({ error: "Correo electrónico y contraseña son requeridos" });
    }
    if (!esEmailValido(email)) {
      return res.status(400).json({ error: "Correo electrónico no válido" });
    }
    if (!esContrasenaValida(password)) {
      return res.status(400).json({ error: "La contraseña debe tener mínimo 8 caracteres" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: "El correo electrónico ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {

    if (!email || !password) {
      return res.status(400).json({ error: "Correo electrónico y contraseña son requeridos" });
    }
    if (!esEmailValido(email)) {
      return res.status(400).json({ error: "Correo electrónico no válido" });
    }
    if (!esContrasenaValida(password)) {
      return res.status(400).json({ error: "La contraseña debe tener mínimo 8 caracteres" });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: "Correo electrónico o contraseña incorrectos" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Correo electrónico o contraseña incorrectos" });
    }

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

const esAdministrador = async (req, res, next) => {
  const adminUid = req.headers['x-user-uid'];
  if (!adminUid) return res.status(401).json({ error: "Usuario no autorizado" });

  const user = await prisma.user.findUnique({ where: { uid: Number(adminUid) }});
  if (user && user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ error: "Acceso denegado" });
  }
};
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
app.get('/admin/users', esAdministrador, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { uid: true, email: true, role: true }
    });
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener usuarios" });
    }
});
app.delete('/admin/users/:uid', esAdministrador, async (req, res) => {
  try {
    const targetUid = Number(req.params.uid);
    
    await prisma.simulationData.delete({ where: { userId: targetUid }});
    await prisma.user.delete({ where: { uid: targetUid }});

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (e) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});
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
app.put('/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userUid = req.headers['x-user-uid'];

  try {
    if (!esContrasenaValida(newPassword)) {
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

    await prisma.simulationData.deleteMany({ where: { userId: Number(userUid) }});
    await prisma.user.delete({ where: { uid: Number(userUid) }});

    res.json({ message: "Cuenta eliminada correctamente" });
  } catch (e) {
    res.status(500).json({ error: "Error al borrar cuenta" });
  }
});

async function startServer() {
  try {
    await asegurarUsuarioAdmin();
    app.listen(4000, () => console.log('Backend listo'));
  } catch (e) {
    console.error('No se pudo inicializar el backend:', e);
    process.exit(1);
  }
}

startServer();