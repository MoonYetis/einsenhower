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
    created_by: "Osman Marin",
    assigned_to: "Marie Puscan",
    created_at: "Hoy, 08:30 AM",
    due_date: "Inmediata",
    tags: ["Negocio", "Desarrollo"],
    notes: [
      { id: 1, user: "Marie Puscan", userEmail: "marie.puscan@matrixos.io", content: "Analizando los alias de Pydantic v2. Parece que los campos del payload JWT ignoraban la comprobación de expiración.", created_at: "Hoy, 09:12 AM" },
      { id: 2, user: "Osman Marin", userEmail: "osman.marin@matrixos.io", content: "Estado actualizado a urgente. Esto podría exponer endpoints del equipo sin el Bearer token correcto.", created_at: "Hoy, 10:42 AM" }
    ],
    attachments: [
      { id: 1, file_name: "log_vulnerabilidad_auth.txt", file_path: "/uploads/log_vulnerabilidad_auth.txt", uploaded_at: "Hoy, 09:15 AM" }
    ],
    delegation_histories: [
      { id: 1, from_user: "Osman Marin", to_user: "Marie Puscan", assigned_at: "Hoy, 08:30 AM" }
    ]
  },
  {
    id: "#381",
    title: "Optimización de Índices en Base de Datos PostgreSQL 16",
    description: "Analizar las consultas lentas sobre los filtros cruzados de tareas y equipos. Agregar índices compuestos sobre (team_id, quadrant, status) para acelerar consultas.",
    quadrant: "Q2",
    status: "TODO",
    created_by: "Marie Puscan",
    assigned_to: "Marie Puscan",
    created_at: "Ayer, 14:20 PM",
    due_date: "Viernes, 29 de Mayo",
    tags: ["Negocio", "Desarrollo"],
    notes: [
      { id: 1, user: "Marie Puscan", userEmail: "marie.puscan@matrixos.io", content: "Hemos detectado picos de latencia de hasta 250ms al cargar el cuadrante consolidado. Con el índice bajará a 12ms.", created_at: "Ayer, 15:00 PM" }
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
    created_by: "Osman Marin",
    assigned_to: "Osman Marin",
    created_at: "Hace 2 días",
    due_date: "Lunes, 1 de Junio",
    tags: ["Negocio", "Desarrollo"],
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
    created_by: "Osman Marin",
    assigned_to: "Marie Puscan",
    created_at: "Hace 3 días",
    due_date: "Fin de mes",
    tags: ["Negocio"],
    notes: [
      { id: 1, user: "Marie Puscan", userEmail: "marie.puscan@matrixos.io", content: "Ya comencé a redactar el archivo wiki/Alembic-Async.md. Necesito confirmación del esquema de modelos de Fase 1 para publicarlo.", created_at: "Hace 1 día" }
    ],
    attachments: [],
    delegation_histories: [
      { id: 1, from_user: "Osman Marin", to_user: "Marie Puscan", assigned_at: "Hace 3 días" }
    ]
  },
  {
    id: "#802",
    title: "Planificar viaje de fin de semana con la familia",
    description: "Investigar cabañas o posadas familiares en el campo para desconectar el fin de semana. Tratar de reservar antes del jueves.",
    quadrant: "Q2",
    status: "TODO",
    created_by: "Osman Marin",
    assigned_to: "Osman Marin",
    created_at: "Hoy, 10:00 AM",
    due_date: "Sábado, 30 de Mayo",
    tags: ["Familiar", "Ocio"],
    notes: [],
    attachments: [],
    delegation_histories: []
  },
  {
    id: "#803",
    title: "Comprar regalo de aniversario para mamá",
    description: "Comprar un juego de macetas artesanales o flores finas y coordinar envío para el sábado por la mañana.",
    quadrant: "Q2",
    status: "TODO",
    created_by: "Marie Puscan",
    assigned_to: "Marie Puscan",
    created_at: "Ayer, 11:30 AM",
    due_date: "Viernes, 29 de Mayo",
    tags: ["Familiar", "Personal"],
    notes: [],
    attachments: [],
    delegation_histories: []
  },
  {
    id: "#804",
    title: "Renovar membresía anual de club de pádel",
    description: "Coordinar el pago antes de que venza el plazo de descuento por pago anticipado. Prioridad baja.",
    quadrant: "Q4",
    status: "TODO",
    created_by: "Osman Marin",
    assigned_to: "Osman Marin",
    created_at: "Hace 2 días",
    due_date: "Fin de mes",
    tags: ["Personal", "Ocio"],
    notes: [],
    attachments: [],
    delegation_histories: []
  },
  {
    id: "#104",
    title: "Auditoría de Tecnologías Obsoletas: Base de Datos PHP Heredada",
    description: "Q4: Baja prioridad. Depurar registros remotos redundantes, congelar contenedores legados y migrar esquemas de prueba remanentes.",
    quadrant: "Q4",
    status: "DONE",
    created_by: "Osman Marin",
    assigned_to: "Marie Puscan",
    created_at: "Hace 1 semana",
    tags: ["Negocio"],
    notes: [],
    attachments: [],
    delegation_histories: [
      { id: 1, from_user: "Osman Marin", to_user: "Marie Puscan", assigned_at: "Hace 1 semana" }
    ]
  }
];

// Leer tareas desde JSON
function readTasks(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(data);
      // Validar si es la base de datos antigua y purgarla si contiene tester antiguo
      const hasOldUsers = parsed.some((t: any) => 
        t.assigned_to === "David Líder" || 
        t.created_by === "David Líder" || 
        (t.notes && t.notes.some((n: any) => n.user === "Marcos Dev"))
      );
      if (hasOldUsers) {
        console.log("Detectados usuarios obsoletos en tasks.json, reiniciando base de datos...");
        fs.writeFileSync(DATA_FILE, JSON.stringify(defaultTasks, null, 2), "utf-8");
        return [...defaultTasks];
      }
      return parsed;
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
  const { title, description, quadrant, assigned_to, created_by, due_date, tags } = req.body;
  
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
    created_by: created_by || "Osman Marin",
    assigned_to: assigned_to || "Osman Marin",
    created_at: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) + ", Hoy",
    due_date: due_date || "Sin plazo",
    tags: tags || [],
    notes: [],
    attachments: [],
    delegation_histories: [
      {
        id: Date.now(),
        from_user: created_by || "Osman Marin",
        to_user: assigned_to || "Osman Marin",
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
  const { status, quadrant, assigned_to, due_date, tags } = req.body;
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
  if (due_date !== undefined) task.due_date = due_date;
  if (tags !== undefined) task.tags = tags;

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
    user: user || "Osman Marin",
    userEmail: user === "Marie Puscan" ? "marie.puscan@matrixos.io" : "osman.marin@matrixos.io",
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

// === ENDPOINTS DE LA API DE FINANZAS (FINANCES.JSON STORAGE) ===

const FINANCES_FILE = path.join(process.cwd(), "finances.json");

interface FinanceTransaction {
  id: string;
  title: string;
  description: string;
  amount: number;
  type: "INGRESOS" | "EGRESOS" | "OBLIGACIONES"; // Ingreso, Egreso, Obligación
  category: string;
  date: string; // YYYY-MM-DD
  due_date?: string; // Para obligaciones
  status?: "PENDIENTE" | "PAGADO"; // Para obligaciones
  created_at: string;
}

const defaultFinances: { categories: string[]; transactions: FinanceTransaction[] } = {
  categories: ["Negocio", "Familiar", "Ocio", "Desarrollo", "Personal", "Finanzas", "Servicios", "Impuestos"],
  transactions: [
    {
      id: "tx-1",
      title: "Cobro Factura SoftDev S.A.",
      description: "Servicio de consultoría y desarrollo de software correspondiente a la primera fase.",
      amount: 4500,
      type: "INGRESOS",
      category: "Negocio",
      date: "2026-05-10",
      created_at: "2026-05-10T08:00:00.000Z"
    },
    {
      id: "tx-2",
      title: "Suscripción AWS Cloud Run",
      description: "Servidor de despliegue en la nube y base de datos postgresql administrada.",
      amount: 180,
      type: "EGRESOS",
      category: "Negocio",
      date: "2026-05-15",
      created_at: "2026-05-15T12:00:00.000Z"
    },
    {
      id: "tx-3",
      title: "Alquiler de Oficina",
      description: "Obligación de pago de oficina física del coworking.",
      amount: 1200,
      type: "OBLIGACIONES",
      category: "Negocio",
      date: "2026-05-30",
      due_date: "2026-05-30",
      status: "PENDIENTE",
      created_at: "2026-05-01T09:00:00.000Z"
    },
    {
      id: "tx-4",
      title: "Supermercado Mensual Familiar",
      description: "Compras de provisiones para la casa.",
      amount: 450,
      type: "EGRESOS",
      category: "Familiar",
      date: "2026-05-12",
      created_at: "2026-05-12T15:30:00.000Z"
    },
    {
      id: "tx-5",
      title: "Colegio de los Niños",
      description: "Colegiatura del mes en curso.",
      amount: 380,
      type: "OBLIGACIONES",
      category: "Familiar",
      date: "2026-05-28",
      due_date: "2026-05-28",
      status: "PAGADO",
      created_at: "2026-05-01T10:00:00.000Z"
    },
    {
      id: "tx-6",
      title: "Plan Teléfono e Internet Celular",
      description: "Servicios de comunicación móvil.",
      amount: 45,
      type: "EGRESOS",
      category: "Familiar",
      date: "2026-05-22",
      created_at: "2026-05-22T08:15:00.000Z"
    },
    {
      id: "tx-7",
      title: "Venta de Licencia de Software",
      description: "Cobro recurrente por licenciamiento de microservicio.",
      amount: 850,
      type: "INGRESOS",
      category: "Negocio",
      date: "2026-05-25",
      created_at: "2026-05-25T11:00:00.000Z"
    }
  ]
};

// Leer finanzas de JSON
function readFinances(): { categories: string[]; transactions: FinanceTransaction[] } {
  try {
    if (fs.existsSync(FINANCES_FILE)) {
      const data = fs.readFileSync(FINANCES_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error leyendo archivo de finanzas:", error);
  }
  // Crear archivo inicial si no existe
  writeFinances(defaultFinances);
  return defaultFinances as any;
}

// Escribir finanzas a JSON
function writeFinances(data: { categories: string[]; transactions: FinanceTransaction[] }): void {
  try {
    fs.writeFileSync(FINANCES_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error escribiendo archivo de finanzas:", error);
  }
}

// 1. Obtener todas las finanzas (transacciones y categorías)
app.get("/api/finances", (req, res) => {
  const data = readFinances();
  res.json(data);
});

// 2. Crear una nueva transacción (ingreso, egreso u obligación)
app.post("/api/finances/transactions", (req, res) => {
  const { title, description, amount, type, category, date, due_date, status } = req.body;
  
  if (!title || !amount || !type || !category || !date) {
    return res.status(400).json({ error: "Faltan campos mandatorios (título, monto, tipo, categoría, fecha)" });
  }

  const data = readFinances();
  const newTx: FinanceTransaction = {
    id: `tx-${Math.floor(1000 + Math.random() * 9000)}`,
    title,
    description: description || "",
    amount: parseFloat(amount),
    type,
    category,
    date,
    due_date: due_date || undefined,
    status: type === "OBLIGACIONES" ? (status || "PENDIENTE") : undefined,
    created_at: new Date().toISOString()
  };

  data.transactions.unshift(newTx);
  writeFinances(data);
  res.status(201).json(newTx);
});

// 3. Modificar una transacción (editar campos o pagar obligación)
app.patch("/api/finances/transactions/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, amount, type, category, date, due_date, status } = req.body;
  
  const data = readFinances();
  const txIndex = data.transactions.findIndex(t => t.id === id);

  if (txIndex === -1) {
    return res.status(404).json({ error: "Transacción no encontrada" });
  }

  const tx = data.transactions[txIndex];

  if (title !== undefined) tx.title = title;
  if (description !== undefined) tx.description = description;
  if (amount !== undefined) tx.amount = parseFloat(amount);
  if (type !== undefined) tx.type = type;
  if (category !== undefined) tx.category = category;
  if (date !== undefined) tx.date = date;
  if (due_date !== undefined) tx.due_date = due_date;
  
  if (status !== undefined) {
    tx.status = status;
    // Si marcamos una obligación como PAGADO, de manera opcional podemos registrarla también como un egreso real
    // Pero lo mantendremos como tipo OBLIGACIÓN con estatuto PAGADO para no duplicar, lo cual es muy transparente.
  }

  data.transactions[txIndex] = tx;
  writeFinances(data);
  res.json(tx);
});

// 4. Eliminar una transacción
app.delete("/api/finances/transactions/:id", (req, res) => {
  const { id } = req.params;
  const data = readFinances();
  const initialLen = data.transactions.length;
  data.transactions = data.transactions.filter(t => t.id !== id);

  if (data.transactions.length === initialLen) {
    return res.status(404).json({ error: "Transacción no localizada" });
  }

  writeFinances(data);
  res.json({ message: "Transacción eliminada con éxito", id });
});

// 5. Crear una nueva categoría personalizada
app.post("/api/finances/categories", (req, res) => {
  const { categoryName } = req.body;
  
  if (!categoryName) {
    return res.status(400).json({ error: "El nombre de la categoría es mandatorio" });
  }

  const cleanName = categoryName.trim();
  const data = readFinances();

  if (data.categories.includes(cleanName)) {
    return res.status(400).json({ error: "Esta categoría ya existe" });
  }

  data.categories.push(cleanName);
  writeFinances(data);
  res.status(201).json({ categories: data.categories });
});

// 6. Eliminar una categoría personalizada
app.delete("/api/finances/categories/:name", (req, res) => {
  const { name } = req.params;
  const data = readFinances();
  
  const initialLen = data.categories.length;
  data.categories = data.categories.filter(c => c !== name);

  if (data.categories.length === initialLen) {
    return res.status(404).json({ error: "Categoría no localizada" });
  }

  writeFinances(data);
  res.json({ message: "Categoría eliminada con éxito", categories: data.categories });
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
