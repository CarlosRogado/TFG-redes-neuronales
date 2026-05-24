<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TensorFlow.js-FF6F00?style=flat&logo=tensorflow&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/pnpm-F69220?style=flat&logo=pnpm&logoColor=white" />
</div>
<h1 align="center">🧠 Redes Neuronales JS</h1>

<p align="center">
  Cohetes con redes neuronales que aprenden a esquivar obstáculos mediante un algoritmo genético. Todo corre en tu navegador con TensorFlow.js.
</p>


🐳 Despliegue con Docker

### Requisitos

- Docker y Docker Compose instalados

### 1. Clonar

```bash
  git clone https://github.com/CarlosRogado/Redes-neuronales-JS
  cd Redes-neuronales-JS
```

### 2. Configurar variables de entorno

Copia el archivo de entorno del backend:

```bash
  cp backend/.env.example backend/.env
```

#### 📧 Contraseña de aplicación para Gmail (SMTP)

Para que funcione el envío de correos (recuperación de contraseña) necesitas una contraseña de aplicación de Google:

1. Ve a https://myaccount.google.com/apppasswords
2. Inicia sesión con la cuenta de Gmail que quieras usar
3. Selecciona Otro (nombre personalizado) → pon Redes Neuronales JS
4. Copia la contraseña de 16 caracteres que te genera
5. Pégala en SMTP_PASSWORD en tu backend/.env
6. SMTP_USER debe ser tu correo de Gmail completo

> ⚠️ Necesitas tener activada la verificación en dos pasos en tu cuenta de Google para poder generar contraseñas de aplicación. Si no, esta opción no aparecerá.

El resto de valores por defecto ya funcionan con Docker Compose.

### 3. Arrancar

```bash
  docker compose up -d
```

Docker Compose levanta 4 servicios:

| Servicio | Puerto | Descripción |
| :--- | :--- | :--- |
| frontend | 5173 | App React + Vite (hot reload) |
| backend | 4000 | API REST con Express + Prisma |
| db | 5432 | PostgreSQL |
| adminer | 8080 | Gestor web de la base de datos |

### 4. Abrir

```
  http://localhost:5173
```

### 5. Parar

```bash
  docker compose down
```

Para borrar también los volúmenes (datos de la BD):

```bash
  docker compose down -v
```

---
🧬 Cómo funciona

Cada cohete tiene una red neuronal 6→8→1 (6 entradas, 8 neuronas ocultas, 1 salida). Por generación vuelan 100 cohetes simultáneamente. Cuando chocan, se evalúa su rendimiento y el algoritmo genético crea la siguiente generación:

- Elitismo (20 %) → los 20 mejores pasan intactos
- Mutación (10 %) → el resto se genera combinando pesos de los élites con ruido gaussiano
- Fitness cuadrático → score² × 100 para amplificar diferencias

---
📁 Estructura del proyecto

```
  Redes-neuronales-JS/
  ├── frontend/                   # React + Vite
  │   └── src/
  │       ├── logic/              # Núcleo: cohete, obstáculo, evolución, cerebro
  │       ├── components/         # Canvas, gráficas, paneles
  │       ├── docs/sections/      # 11 secciones de documentación del TFG
  │       └── hooks/              # useSimulacion, useDocs, etc.
  ├── backend/                    # Express + Prisma
  │   └── prisma/                 # Schema y migraciones
  ├── docker-compose.yml
  ├── frontend/Dockerfile
  └── backend/Dockerfile
```

---
📖 Documentación

La aplicación incluye una guía completa sobre redes neuronales y algoritmos genéticos accesible en la pestaña Docs del menú (/docs). 11 secciones que cubren desde los fundamentos teóricos hasta la implementación concreta del proyecto.

---

<div align="center">
  <sub>TFG — Desarrollo de Aplicaciones Web · Carlos Rogado Caamaño y Víctor Vicente Díaz · 2026</sub>
</div>