import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import multer from "multer";

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), "tasks.json");
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Asegurar que exista la carpeta de archivos adjuntos
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configurar almacenamiento de archivos adjuntos con Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Soporte de cuerpo JSON y URL codificada
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Datos iniciales de tareas por defecto (para arranque transparente)
const defaultTasks = [
  {
    id: "#492",
    title: "Fallo Crítico: Mitigar Fuga en Middleware de Autenticación FastAPI",
    description: "La migración hacia Pydantic v2 provocó una omisión involuntaria de validación en el gestor de sesiones de FastAPI. Requiere atención urgente.",
    quadrant: "Q1",
    status: "IN_PROGRESS",
    created_by: "Sistema de Seguridad Automático",
    assigned_to: "David Líder",
    created_at: "Hoy, 08:30 AM",
    due_date: "Inmediata",
    notes: [
      { id: 1, user: "Marcos Dev", userEmail: "marco.dev@matrixos.io", content: "Analizando los alias de Pydantic v2. Parece que los campos del payload JWT ignoraban la comprobación de expiración.", created_at: "Hoy, 09:12 AM" },
      { id: 2, user: "Ana Administradora DF", userEmail: "ana.db@matrixos.io", content: "Estado actualizado a urgente. Esto podría exponer endpoints del equipo sin el Bearer token correcto.", created_at: "Hoy, 10:42 AM" }
    ],
    attachments: [
      { id: 1, file_name: "log_vulnerabilidad_auth.txt", file_path: "/uploads/log_vulnerabilidad_auth.txt", uploaded_at: "Hoy, 09:15 AM" }
    ],
    delegation_histories: [
      { id: 1, from_user: "Bot de Seguridad", to_user: "David Líder", assigned_at: "Hoy, 08:30 AM" },
      { id: 2, from_user: "David Líder", to_user: "Marcos Dev", assigned_at: "Hoy, 09:00 AM" }
    ]
  },
  {
    id: "#381",
    title: "Optimización de Índices en Base de Datos PostgreSQL 16",
    description: "Analizar las consultas lentas sobre los filtros cruzados de tareas y equipos. Agregar índices compuestos sobre (team_id, quadrant, status) para acelerar FastAPI.",
    quadrant: "Q2",
    status: "TODO",
    created_by: "Ana Administradora DF",
    assigned_to: "Ana Administradora DF",
    created_at: "Ayer, 14:20 PM",
    due_date: "Viernes, 29 de Mayo",
    notes: [
      { id: 1, user: "Ana Administradora DF", userEmail: "ana.db@matrixos.io", content: "Hemos detectado picos de latencia de hasta 250ms al cargar el cuadrante consolidado en equipos de más de 50 personas. Con el índice bajará a 12ms.", created_at: "Ayer, 15:00 PM" }
    ],
    attachments: [],
    delegation_histories: []
  },
  {
    id: "#310",
    title: "Orquestación de Pipelines CI/CD con Docker Compose",
    description: "Configurar los healthchecks automáticos de pg_isready dentro del Docker Compose y optimizar Dockerfile para compilación asincrónica en Cloud Run.",
    quadrant: "Q2",
    status: "TODO",
    created_by: "Sofía DevOps",
    assigned_to: "Sofía DevOps",
    created_at: "Hace 2 días",
    due_date: "Lunes, 1 de Junio",
    notes: [],
    attachments: [
      { id: 2, file_name: "prod_docker_architecture.pdf", file_path: "/uploads/prod_docker_architecture.pdf", uploaded_at: "Ayer, 10:00 AM" }
    ],
    delegation_histories: []
  },
  {
    id: "#223",
    title: "Actualizar Documentación Corporativa: Migraciones Alembic",
    description: "Escribir las guías sobre cómo generar scripts de migración asincrónicos compatibles con asyncpg y SQLAlchemy 2.0.",
    quadrant: "Q3",
    status: "TODO",
    created_by: "David Líder",
    assigned_to: "Clara Documentación",
    created_at: "Hace 3 días",
    due_date: "Fin de mes",
    notes: [
      { id: 1, user: "Clara Documentación", userEmail: "clara.docs@matrixos.io", content: "Ya comencé a redactar el archivo wiki/Alembic-Async.md. Necesito confirmación del esquema de modelos de Fase 1 para publicarlo.", created_at: "Hace 1 día" }
    ],
    attachments: [],
    delegation_histories: [
      { id: 1, from_user: "David Líder", to_user: "Clara Documentación", assigned_at: "Hace 3 días" }
    ]
  },
  {
    id: "#104",
    title: "Auditoría de Tecnologías Obsoletas: Base de Datos PHP Heredada",
    description: "Q4: Baja prioridad. Depurar registros remotos redundantes, congelar contenedores legados y migrar esquemas de prueba remanentes.",
    quadrant: "Q4",
    status: "DONE",
    created_by: "David Líder",
    assigned_to: "Marcos Dev",
    created_at: "Hace 1 semana",
    notes: [],
    attachments: [],
    delegation_histories: [
      { id: 1, from_user: "David Líder", to_user: "Marcos Dev", assigned_at: "Hace 1 semana" }
    ]
  }
];

// Leer tareas desde JSON
function readTasks(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error leyendo archivo de tareas:", error);
  }
  return [...defaultTasks];
}

// Guardar tareas a JSON
function writeTasks(tasks: any[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf-8");
  } catch (error) {
    console.error("Error escribiendo archivo de tareas:", error);
  }
}

// Servir la carpeta de cargas estáticamente
app.use("/uploads", express.static(UPLOADS_DIR));

// === ENDPOINTS DE LA API (INTEGRACIÓN REAL) ===

// 1. Obtener todas las tareas de la base de datos
app.get("/api/tasks", (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// 2. Crear una nueva tarea colaborativa
app.post("/api/tasks", (req, res) => {
  const { title, description, quadrant, assigned_to, created_by } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: "El título es obligatorio" });
  }

  const tasks = readTasks();
  const rawId = `#${Math.floor(100 + Math.random() * 900)}`;
  
  // Garantizar que el ID no colisione
  let id = rawId;
  while (tasks.some(t => t.id === id)) {
    id = `#${Math.floor(100 + Math.random() * 900)}`;
  }

  const newTask = {
    id,
    title,
    description: description || "",
    quadrant: quadrant || "Q1",
    status: "TODO",
    created_by: created_by || "Usuario Integrado",
    assigned_to: assigned_to || "David Líder",
    created_at: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) + ", Hoy",
    notes: [],
    attachments: [],
    delegation_histories: [
      {
        id: Date.now(),
        from_user: "David Líder (Ejecutivo)",
        to_user: assigned_to || "David Líder",
        assigned_at: "Hoy, Justo Ahora"
      }
    ]
  };

  tasks.unshift(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

// 3. Modificar cuadrante o estado de una tarea (Trazando delegación si aplica)
app.patch("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { status, quadrant, assigned_to } = req.body;
  const tasks = readTasks();
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Tarea no localizada" });
  }

  const task = tasks[taskIndex];

  // Si cambia de responsable, registrar traza de delegación
  if (assigned_to !== undefined && task.assigned_to !== assigned_to) {
    task.delegation_histories = task.delegation_histories || [];
    task.delegation_histories.push({
      id: Date.now(),
      from_user: task.assigned_to,
      to_user: assigned_to,
      assigned_at: "Hoy, Justo Ahora"
    });
    task.assigned_to = assigned_to;
  }

  if (status !== undefined) task.status = status;
  if (quadrant !== undefined) task.quadrant = quadrant;

  tasks[taskIndex] = task;
  writeTasks(tasks);
  res.json(task);
});

// 4. Eliminar una tarea de la matriz
app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const tasks = readTasks();
  const filtered = tasks.filter(t => t.id !== id);

  if (tasks.length === filtered.length) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  writeTasks(filtered);
  res.json({ message: "Tarea eliminada exitosamente", id });
});

// 5. Añadir comentarios/notas secuenciales en tiempo real
app.post("/api/tasks/:id/notes", (req, res) => {
  const { id } = req.params;
  const { content, user } = req.body;

  if (!content) {
    return res.status(400).json({ error: "El comentario no puede estar vacío" });
  }

  const tasks = readTasks();
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Tarea no localizada" });
  }

  const task = tasks[taskIndex];
  task.notes = task.notes || [];

  const newNote = {
    id: Date.now(),
    user: user || "David Líder (Actual)",
    userEmail: "david.lead@matrixos.io",
    content: content,
    created_at: "Hace un momento"
  };

  task.notes.push(newNote);
  tasks[taskIndex] = task;
  writeTasks(tasks);
  res.status(201).json(newNote);
});

// 6. Subir archivo adjunto real a una tarea
app.post("/api/tasks/:id/attachments", upload.single("file"), (req, res) => {
  const { id } = req.params;
  
  if (!req.file) {
    return res.status(400).json({ error: "Debe subir un archivo legítimo" });
  }

  const tasks = readTasks();
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Tarea no encontrada en el sistema" });
  }

  const task = tasks[taskIndex];
  task.attachments = task.attachments || [];

  const newAttachment = {
    id: Date.now(),
    file_name: req.file.originalname,
    file_path: `/uploads/${req.file.filename}`,
    uploaded_at: "Hoy, " + new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  };

  task.attachments.push(newAttachment);
  tasks[taskIndex] = task;
  writeTasks(tasks);

  res.status(201).json(newAttachment);
});


// === INTEGRACIÓN DE VITE / PRODUCCIÓN ===
async function start() {
  if (process.env.NODE_ENV !== "production") {
    // Modo Desarrollo: Usar el middleware de Vite para HMR y servir activos de React
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Modo de Producción: Servir archivos compilados estáticamente
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MatrixOS Core] Servidor escuchando en http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Fallo al iniciar el servidor integrado:", err);
});
