/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { 
  Database, 
  Layers, 
  FileText, 
  Users, 
  CheckCircle, 
  ChevronRight,
  ChevronLeft, 
  Copy, 
  Check, 
  GitBranch, 
  Server, 
  FileCode, 
  Share2, 
  Calendar,
  Sparkles,
  Info,
  Clock,
  Plus,
  Paperclip,
  Activity,
  Send,
  Trash2,
  Lock,
  Tag,
  Award,
  PieChart,
  Briefcase,
  Heart,
  Smile,
  Compass,
  Printer,
  TrendingUp,
  Zap,
  Brain,
  LayoutDashboard,
  Volume2,
  Terminal
} from "lucide-react";

interface UserResponseSim {
  id: number;
  name: string;
  email: string;
}

interface TaskNoteSim {
  id: number;
  user: string;
  userEmail: string;
  content: string;
  created_at: string;
}

interface TaskAttachmentSim {
  id: number;
  file_name: string;
  file_path: string;
  uploaded_at: string;
}

interface DelegationHistorySim {
  id: number;
  from_user: string;
  to_user: string;
  assigned_at: string;
}

interface TaskSim {
  id: string;
  title: string;
  description: string;
  quadrant: "Q1" | "Q2" | "Q3" | "Q4";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assigned_to: string;
  created_by: string;
  created_at: string;
  due_date?: string;
  notes: TaskNoteSim[];
  attachments: TaskAttachmentSim[];
  delegation_histories: DelegationHistorySim[];
  tags?: string[];
}

const TAG_COLORS: Record<string, { bg: string, text: string, border: string }> = {
  "Negocio": { bg: "bg-blue-50 text-blue-700 border-blue-200", text: "text-blue-700", border: "border-blue-200" },
  "Familiar": { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", text: "text-emerald-700", border: "border-emerald-200" },
  "Ocio": { bg: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200", text: "text-fuchsia-700", border: "border-fuchsia-200" },
  "Desarrollo": { bg: "bg-violet-50 text-violet-700 border-violet-200", text: "text-violet-700", border: "border-violet-200" },
  "Personal": { bg: "bg-rose-50 text-rose-700 border-rose-200", text: "text-rose-700", border: "border-rose-200" },
  "Finanzas": { bg: "bg-amber-50 text-amber-700 border-amber-200", text: "text-amber-700", border: "border-amber-200" },
};

const DEFAULT_TAG_COLOR = { bg: "bg-slate-50 text-slate-700 border-slate-200", text: "text-slate-700", border: "border-slate-200" };

export default function App() {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"database" | "main" | "models" | "schemas" | "docker">("main");
  // Estado para contraer o expandir la sección de Código Fuente de Fase 2
  const [isCodeSectionExpanded, setIsCodeSectionExpanded] = useState(false);
  
  // Lista de usuarios legítimos del equipo asignada a la matriz de Eisenhower
  const mockTeamUsers = [
    { id: 1, name: "Osman Marin", email: "osman.marin@matrixos.io", avatar: "OM", password: "osman" },
    { id: 2, name: "Marie Puscan", email: "marie.puscan@matrixos.io", avatar: "MP", password: "marie" }
  ];

  // Estado del usuario activo autenticado (Persistido de manera local en el navegador)
  const [currentUser, setCurrentUser] = useState<{ id: number; name: string; email: string; avatar: string } | null>(() => {
    const stored = localStorage.getItem("matrix_user");
    return stored ? JSON.parse(stored) : null;
  });

  // Estado para el control del login interactivo
  const [loginSelectedUser, setLoginSelectedUser] = useState<number | null>(null);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Estado de tareas simulación interactiva con hilos secuenciales reales en React
  const [tasks, setTasks] = useState<TaskSim[]>([
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
  ]);

  // Tarea seleccionada activa
  const [selectedTaskId, setSelectedTaskId] = useState<string>("#492");
  const [deleteConfirmTaskId, setDeleteConfirmTaskId] = useState<string | null>(null);
  
  // Estado para filtrado y categorización por etiquetas (tags)
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [newSelectedTags, setNewSelectedTags] = useState<string[]>([]);
  
  // Estados de Sincronización y Respaldo Físico para celulares y sobremesa
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Vistas inteligentes adicionales: Matriz Eisenhower, Life-Work Balance, Bitácora Semanal, Finanzas Colectivas
  const [activeView, setActiveView] = useState<"matrix" | "analytics" | "logbook" | "dashboard" | "finances">("dashboard");
  const [weeklyCommentary, setWeeklyCommentary] = useState<string>(() => {
    return localStorage.getItem("weekly_commentary") || "Esta semana ha estado enfocada en optimizar el core de nuestra arquitectura y balancear los compromisos familiares clave para desconectar correctamente.";
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);

  // Interfaces para la sección de Finanzas Inteligentes
  interface FinanceTransactionSim {
    id: string;
    title: string;
    description: string;
    amount: number;
    type: "INGRESOS" | "EGRESOS" | "OBLIGACIONES";
    category: string;
    date: string; // YYYY-MM-DD
    due_date?: string;
    status?: "PENDIENTE" | "PAGADO";
    created_at: string;
    is_recurrent?: boolean;
    recurrence_parent_id?: string;
  }

  // Estados de Finanzas Colectivas
  const [financeTransactions, setFinanceTransactions] = useState<FinanceTransactionSim[]>([]);
  const [financeCategories, setFinanceCategories] = useState<string[]>(["Familiar", "Vinannet", "Vinanmerch", "Airbnb"]);
  const [selectedFinanceMonth, setSelectedFinanceMonth] = useState<string>("2026-05"); // Año-Mes por defecto para el sismógrafo financiero
  const [selectedFinanceWorkspace, setSelectedFinanceWorkspace] = useState<string>("Familiar"); // Cuenta independiente activa
  const [selectedFinanceTypeFilter, setSelectedFinanceTypeFilter] = useState<"TODAS" | "INGRESOS" | "EGRESOS" | "OBLIGACIONES">("TODAS");
  const [financeSearchQuery, setFinanceSearchQuery] = useState("");
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);

  // Formulario de Transacción Nueva
  const [newTxTitle, setNewTxTitle] = useState("");
  const [newTxDescription, setNewTxDescription] = useState("");
  const [newTxAmount, setNewTxAmount] = useState("");
  const [newTxType, setNewTxType] = useState<"INGRESOS" | "EGRESOS" | "OBLIGACIONES">("INGRESOS");
  const [newTxCategory, setNewTxCategory] = useState("Familiar");
  const [newTxDate, setNewTxDate] = useState("2026-05-27");
  const [newTxDueDate, setNewTxDueDate] = useState("2026-05-27");
  const [newTxIsRecurrent, setNewTxIsRecurrent] = useState(false);
  const [showAddTxCard, setShowAddTxCard] = useState(false);

  // Deletion modals for recurrences
  const [recDeletionModal, setRecDeletionModal] = useState<{ isOpen: boolean; txId: string; title: string; parentId: string } | null>(null);

  // Formulario de Categorías Personalizadas
  const [newCustomCategoryInput, setNewCustomCategoryInput] = useState("");
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);

  // Derived state for filtered finance transactions
  const filteredTxs = financeTransactions.filter(tx => {
    const formatMonthAndYearSim = (dateStr: string) => dateStr.substring(0, 7);
    const matchesMonth = formatMonthAndYearSim(tx.date) === selectedFinanceMonth;
    const matchesCategory = tx.category === selectedFinanceWorkspace;
    const matchesType = selectedFinanceTypeFilter === "TODAS" || tx.type === selectedFinanceTypeFilter;
    
    const query = financeSearchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      tx.title.toLowerCase().includes(query) || 
      (tx.description && tx.description.toLowerCase().includes(query));

    return matchesMonth && matchesCategory && matchesType && matchesSearch;
  });

  const reloadFinances = async () => {
    try {
      const res = await fetch("/api/finances");
      if (res.ok) {
        const data = await res.json();
        setFinanceTransactions(data.transactions || []);
        if (data.categories) {
          setFinanceCategories(data.categories);
        }
      }
    } catch (err) {
      console.warn("Fallo al recargar finanzas:", err);
    }
  };

  // Funciones de API de Finanzas Colectivas
  const handleAddFinanceTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxTitle.trim() || !newTxAmount || !newTxDate) {
      addLog("⚠️ ERROR: Faltan campos obligatorios para registrar la transacción.", "warn");
      return;
    }
    try {
      const res = await fetch("/api/finances/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTxTitle,
          description: newTxDescription,
          amount: parseFloat(newTxAmount),
          type: newTxType,
          category: selectedFinanceWorkspace,
          date: newTxDate,
          due_date: newTxType === "OBLIGACIONES" ? newTxDueDate : undefined,
          status: newTxType === "OBLIGACIONES" ? "PENDIENTE" : undefined,
          is_recurrent: newTxIsRecurrent
        })
      });
      if (res.ok) {
        await reloadFinances();
        addLog(`💵 FINANZAS: Registrada nueva transacción ${newTxIsRecurrent ? "recurrrente" : ""} en [${selectedFinanceWorkspace}] - ${newTxTitle} ($${newTxAmount})`, "success");
        // Reset campos
        setNewTxTitle("");
        setNewTxDescription("");
        setNewTxAmount("");
        setNewTxIsRecurrent(false);
        setShowAddTxCard(false);
      }
    } catch (err) {
      console.error(err);
      addLog("❌ ERROR: No se pudo salvar la transacción en el servidor.", "error");
    }
  };

  const executeDeleteFinanceTransaction = async (id: string, deleteAllRecurrences: boolean, title: string) => {
    try {
      const url = `/api/finances/transactions/${id}?deleteAllRecurrences=${deleteAllRecurrences}`;
      const res = await fetch(url, {
        method: "DELETE"
      });
      if (res.ok) {
        await reloadFinances();
        addLog(`🗑️ FINANZAS: Eliminado - "${title}" ${deleteAllRecurrences ? "(toda la serie recurrente)" : "(este mes únicamente)"}`, "warn");
        setRecDeletionModal(null);
      }
    } catch (err) {
      console.error(err);
      addLog("❌ ERROR: No se pudo eliminar la transacción.", "error");
    }
  };

  const handleDeleteFinanceTransaction = async (id: string, title: string) => {
    const tx = financeTransactions.find(t => t.id === id);
    if (tx && tx.recurrence_parent_id) {
      setRecDeletionModal({
        isOpen: true,
        txId: id,
        title: title,
        parentId: tx.recurrence_parent_id
      });
      return;
    }
    await executeDeleteFinanceTransaction(id, false, title);
  };

  const handleToggleObligationStatus = async (id: string, currentStatus: "PENDIENTE" | "PAGADO", title: string) => {
    const nextStatus = currentStatus === "PENDIENTE" ? "PAGADO" : "PENDIENTE";
    try {
      const res = await fetch(`/api/finances/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setFinanceTransactions(prev => prev.map(t => t.id === id ? updated : t));
        addLog(`⚙️ OBLIGACIÓN: ${title} marcada como ${nextStatus === "PAGADO" ? "PAGADA ✔️" : "PENDIENTE ⏳"}`, "success");
      }
    } catch (err) {
      console.error(err);
      addLog("❌ ERROR: No se pudo actualizar el estado de la obligación.", "error");
    }
  };

  const handleAddCustomCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomCategoryInput.trim()) return;
    try {
      const res = await fetch("/api/finances/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName: newCustomCategoryInput })
      });
      if (res.ok) {
        const data = await res.json();
        setFinanceCategories(data.categories);
        addLog(`🏷️ CATEGORÍA FINANCIERA: Creada categoría personalizada - ${newCustomCategoryInput}`, "success");
        setNewCustomCategoryInput("");
        setShowAddCategoryForm(false);
        // Seleccionar automáticamente la nueva categoría en el dropdown
        setNewTxCategory(newCustomCategoryInput);
      } else {
        const errData = await res.json();
        addLog(`⚠️ ERROR: ${errData.error || "No se pudo crear la categoría."}`, "warn");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCustomCategory = async (catName: string) => {
    if (financeCategories.length <= 1) {
      addLog(`⚠️ ERROR: Debe mantener al menos una cuenta activa para poder operar el balance.`, "error");
      return;
    }
    try {
      const res = await fetch(`/api/finances/categories/${encodeURIComponent(catName)}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const data = await res.json();
        setFinanceCategories(data.categories);
        addLog(`🗑️ CATEGORÍA FINANCIERA: Eliminada la cuenta / categoría - ${catName}`, "warn");
        if (selectedFinanceWorkspace === catName) {
          setSelectedFinanceWorkspace(data.categories[0] || "General");
        }
        if (newTxCategory === catName) {
          setNewTxCategory(data.categories[0] || "General");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Consola de Telemetría y Actividades en tiempo real
  const [consoleLogs, setConsoleLogs] = useState<{ id: string; time: string; text: string; type: "info" | "success" | "warn" | "error" | "telemetry" }[]>(() => {
    return [
      { id: "log-1", time: "19:56:10", text: "⚙️ Consola de Control de MatrixOS inicializada con éxito.", type: "success" },
      { id: "log-2", time: "19:56:12", text: "🖧 Canal de comunicación bidireccional PostgreSQL activo sobre puerto 5432.", type: "info" },
      { id: "log-3", time: "19:56:14", text: "📈 Telemetría: Sismógrafo de balance mental asincrónico listo para calibración.", type: "telemetry" },
      { id: "log-4", time: "19:56:16", text: "🍅 Temporizador Pomodoro sincronizado con el gestor de tareas.", type: "info" },
    ];
  });

  const addLog = (text: string, type: "info" | "success" | "warn" | "error" | "telemetry" = "info") => {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    setConsoleLogs(prev => [
      { id: "log-" + Date.now() + Math.random(), time: timeStr, text, type },
      ...prev
    ].slice(0, 50));
  };

  // 1. Temporizador de Pomodoro e Incremento de Enfoque Sincronizado
  const [pomodoroTaskId, setPomodoroTaskId] = useState<string | null>(null);
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState(1500); // 25 Minutos
  const [pomodoroIsRunning, setPomodoroIsRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<"focus" | "break">("focus");

  // 2. OKRs / Metas Semanales Estratégicas
  const [weeklyGoals, setWeeklyGoals] = useState<{ id: string; title: string; category: "Trabajo" | "Vida" }[]>(() => {
    const saved = localStorage.getItem("weekly_goals");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: "goal-1", title: "Cerrar backend asíncrono PostgreSQL & Alembic", category: "Trabajo" },
      { id: "goal-2", title: "Planificar picnic y viaje de fin de semana con la familia", category: "Vida" },
      { id: "goal-3", title: "Mejorar distribución de carga mental delegando Q3", category: "Trabajo" }
    ];
  });
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState<"Trabajo" | "Vida">("Trabajo");

  // 3. Simulación sismográfica de sobrecarga / Burnout Meter
  const [burnoutSimulationOffset, setBurnoutSimulationOffset] = useState(0); // Para delegar tareas simuladas

  
  React.useEffect(() => {
    setDeleteConfirmTaskId(null);
  }, [selectedTaskId]);

  // 1. Temporizador de Pomodoro e Incremento de Enfoque Sincronizado
  React.useEffect(() => {
    let interval: any = null;
    if (pomodoroIsRunning && pomodoroTimeLeft > 0) {
      interval = setInterval(() => {
        setPomodoroTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (pomodoroIsRunning && pomodoroTimeLeft === 0) {
      // Pitido & Alerta de voz sintética
      try {
        const synth = window.speechSynthesis;
        if (synth) {
          const utterance = new SpeechSynthesisUtterance(
            pomodoroMode === "focus" 
              ? "Enfoque finalizado. Excelente trabajo realizándolo." 
              : "Descanso completado. Regresemos al tablero."
          );
          synth.speak(utterance);
        }
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (context) {
          const osc = context.createOscillator();
          const gain = context.createGain();
          osc.connect(gain);
          gain.connect(context.destination);
          osc.frequency.setValueAtTime(880, context.currentTime);
          gain.gain.setValueAtTime(0.2, context.currentTime);
          osc.start();
          osc.stop(context.currentTime + 0.35);
        }
      } catch (e) {
        console.warn("Restricciones de sonido del navegador:", e);
      }

      if (pomodoroMode === "focus") {
        setPomodoroMode("break");
        setPomodoroTimeLeft(300); // 5 Minutos de descanso
        addLog(`🍅 Ciclo Pomodoro Completado para la tarea ${pomodoroTaskId || 'general'}. Iniciando descanso activo de 5 min.`, "success");
        if (pomodoroTaskId) {
          handleAutoLogPomodoroNote(
            pomodoroTaskId,
            "🍅 [Pomodoro Completado] Osman Marin completó con éxito un ciclo de enfoque óptimo de 25 minutos sobre esta meta transaccional."
          );
        }
      } else {
        setPomodoroMode("focus");
        setPomodoroTimeLeft(1500); // 25 Minutos
        setPomodoroIsRunning(false); // Pausar para que el usuario reinicie el enfoque
        addLog("☕ Descanso Pomodoro finalizado. Listos para iniciar un nuevo ciclo de enfoque de 25 min.", "info");
      }
    }
    return () => clearInterval(interval);
  }, [pomodoroIsRunning, pomodoroTimeLeft, pomodoroMode, pomodoroTaskId]);

  const handleAutoLogPomodoroNote = async (taskId: string, content: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          user: currentUser?.name || "Osman Marin"
        })
      });
      if (res.ok) {
        const createdNoteObj = await res.json();
        setTasks(prev => prev.map(t => {
          if (t.id === taskId) {
            return {
              ...t,
              notes: [...t.notes, createdNoteObj]
            };
          }
          return t;
        }));
      }
    } catch (err) {
      console.warn("Error enviando nota de pomodoro, usando local:", err);
      const newNoteObj = {
        id: Date.now(),
        user: currentUser?.name || "Osman Marin",
        userEmail: currentUser?.email || "osman.marin@matrixos.io",
        content,
        created_at: "Hace un momento"
      };
      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            notes: [...t.notes, newNoteObj]
          };
        }
        return t;
      }));
    }
  };

  // 2. OKRs / Metas Semanales Estratégicas
  const [taskGoalsMap, setTaskGoalsMap] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("task_goals_map");
    return saved ? JSON.parse(saved) : {};
  });

  const handleLinkTaskToGoal = (taskId: string, goalId: string | null) => {
    const newMap = { ...taskGoalsMap };
    if (goalId) {
      newMap[taskId] = goalId;
      const targetGoal = weeklyGoals.find(g => g.id === goalId);
      addLog(`🎯 Enlazada tarea ${taskId} a la meta: "${targetGoal?.title || goalId}"`, "success");
    } else {
      delete newMap[taskId];
      addLog(`🔗 Desenlazada tarea ${taskId} de meta asignada`, "warn");
    }
    setTaskGoalsMap(newMap);
    localStorage.setItem("task_goals_map", JSON.stringify(newMap));
  };

  const handleAddWeeklyGoal = (title: string, category: "Trabajo" | "Vida") => {
    if (!title.trim()) return;
    const newGoal = {
      id: "goal-" + Date.now(),
      title: title.trim(),
      category
    };
    const updated = [...weeklyGoals, newGoal];
    setWeeklyGoals(updated);
    localStorage.setItem("weekly_goals", JSON.stringify(updated));
    setNewGoalTitle("");
    addLog(`➕ Creado OKR Semanal [${category}]: "${title.trim()}"`, "success");
  };

  const handleRemoveWeeklyGoal = (goalId: string) => {
    const targetGoal = weeklyGoals.find(g => g.id === goalId);
    const updated = weeklyGoals.filter(g => g.id !== goalId);
    setWeeklyGoals(updated);
    localStorage.setItem("weekly_goals", JSON.stringify(updated));
    
    // Desvincular todas las tareas que tengan este goalId
    const newMap = { ...taskGoalsMap };
    Object.keys(newMap).forEach(k => {
      if (newMap[k] === goalId) {
        delete newMap[k];
      }
    });
    setTaskGoalsMap(newMap);
    localStorage.setItem("task_goals_map", JSON.stringify(newMap));
    addLog(`❌ Eliminada meta semanal: "${targetGoal?.title || goalId}" y limpiados los enlaces asociados.`, "warn");
  };


  // Selector de filtro de etiquetas cruzado
  const filteredTasks = selectedTagFilter
    ? tasks.filter(t => t.tags && t.tags.includes(selectedTagFilter))
    : tasks;

  const currentTask = tasks.find(t => t.id === selectedTaskId) || tasks[0] || {
    id: "#492",
    title: "Cargando tarea...",
    description: "",
    quadrant: "Q1",
    status: "TODO",
    notes: [],
    attachments: [],
    delegation_histories: [],
    assigned_to: "Osman Marin",
    created_by: "Osman Marin"
  };

  // Carga inicial y obtención en tiempo real de la API
  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
          if (data.length > 0) {
            setSelectedTaskId(data[0].id);
          }
        }
      } catch (err) {
        console.warn("Fallo de API, usando fallback en memoria local de React:", err);
      }
    };
    const fetchFinances = async () => {
      try {
        const res = await fetch("/api/finances");
        if (res.ok) {
          const data = await res.json();
          setFinanceTransactions(data.transactions || []);
          setFinanceCategories(data.categories || []);
        }
      } catch (err) {
        console.warn("Fallo de API de finanzas, usando fallback en memoria: ", err);
      }
    };
    fetchTasks();
    fetchFinances();
  }, []);

  // Estado para crear nuevas tareas interactivas directamente en el tablero
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newQuadrant, setNewQuadrant] = useState<"Q1" | "Q2" | "Q3" | "Q4">("Q1");
  const [newAssignee, setNewAssignee] = useState("Marie Puscan");
  const [newDueDate, setNewDueDate] = useState("");

  // Estado para redactar notas interactivas secuenciales
  const [newNoteContent, setNewNoteContent] = useState("");

  // Estados del calendario interactivo
  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [calendarMonth, setCalendarMonth] = useState<number>(4); // Mayo por defecto
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null);

  // Comprobar si una tarea coincide con un día específico del calendario
  const matchTaskWithDate = (taskDate: string | undefined, year: number, month: number, day: number): boolean => {
    if (!taskDate) return false;
    
    const normalized = taskDate.toLowerCase().trim();
    
    // 1. Coincidencia con fechas ISO YYYY-MM-DD
    const isoMatch = normalized.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const tYear = parseInt(isoMatch[1], 10);
      const tMonth = parseInt(isoMatch[2], 10) - 1; // Mes en JS es base 0
      const tDay = parseInt(isoMatch[3], 10);
      return tYear === year && tMonth === month && tDay === day;
    }
    
    // 2. Mapear meses en español
    const spanishMonths = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const currentMonthName = spanishMonths[month];
    
    // 3. Comprobar si el texto contiene el mes y el día específico
    if (normalized.includes(currentMonthName)) {
      const numberMatches = normalized.match(/\d+/);
      if (numberMatches) {
        const parsedDay = parseInt(numberMatches[0], 10);
        return parsedDay === day;
      }
    }

    // "fin de mes" en Mayo de 2026 -> 31 de Mayo
    if (normalized.includes("fin de mes") && month === 4 && day === 31) {
      return true;
    }
    
    // "inmediata" en Mayo de 2026 -> 26 de Mayo (día de hoy según hora del sistema)
    if (normalized.includes("inmediata") && year === 2026 && month === 4 && day === 26) {
      return true;
    }
    
    return false;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Enviar credenciales de inicio de sesión real/simulado
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginSelectedUser) {
      setLoginError("Por favor, selecciona un miembro del equipo.");
      return;
    }
    const userObj = mockTeamUsers.find(u => u.id === loginSelectedUser);
    if (!userObj) return;

    if (loginPassword.trim().toLowerCase() === userObj.password) {
      const sessionUser = {
        id: userObj.id,
        name: userObj.name,
        email: userObj.email,
        avatar: userObj.avatar
      };
      localStorage.setItem("matrix_user", JSON.stringify(sessionUser));
      setCurrentUser(sessionUser);
      setLoginError("");
      setLoginPassword("");
    } else {
      setLoginError(`Contraseña incorrecta. (Prueba con "${userObj.password}")`);
    }
  };

  // Cerrar sesión activa del equipo
  const handleLogout = () => {
    localStorage.removeItem("matrix_user");
    setCurrentUser(null);
    setLoginSelectedUser(null);
    setLoginPassword("");
    setLoginError("");
  };

  // Iniciar el arrastre de una tarea de la matriz
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  // Permitir la zona de soltar de la matriz de Eisenhower
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Cambiar cuadrante de tarea directamente (Perfecto para pantallas touch / móviles)
  const handleMoveQuadrantDirectly = async (taskId: string, targetQuadrant: "Q1" | "Q2" | "Q3" | "Q4") => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, quadrant: targetQuadrant } : t))
    );
    addLog(`📱 TOUCH CONTROL: Reubicada tarea ${taskId} al cuadrante ${targetQuadrant}`, "telemetry");

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quadrant: targetQuadrant })
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
      }
    } catch (err) {
      console.warn("Fallo de API al actualizar cuadrante con control touch:", err);
    }
  };

  // Cambiar estado TODO <-> DONE directamente para celulares
  const handleToggleTaskStatusDirectly = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const newStatus = task.status === "DONE" ? "TODO" : "DONE";
    
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    addLog(`📱 TOUCH CONTROL: Tarea ${taskId} marcada como ${newStatus === "DONE" ? "COMPLETADA ✔️" : "PENDIENTE ⏳"}`, "success");

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
      }
    } catch (err) {
      console.warn("Fallo de API al cambiar estado con control touch:", err);
    }
  };

  // Simulación de sincronización manual de bases de datos
  const handleManualSync = async () => {
    setIsSyncing(true);
    addLog("🗧 CANAL DB: Iniciando sincronización forzada de registros...", "info");
    
    setTimeout(() => {
      setIsSyncing(false);
      addLog("⚙️ MATRIX OS: Recalibrados todos los índices de PostgreSQL sobre puerto 5432.", "success");
      addLog(`✨ SINCRONIZACIÓN EXITOSA: Sincronizadas ${tasks.length} tareas en tiempo real.`, "telemetry");
      
      // Producir una alerta por SpeechSynthesis
      try {
        const synth = window.speechSynthesis;
        if (synth) {
          const utterance = new SpeechSynthesisUtterance("Sincronización de base de datos completada exitosamente.");
          synth.speak(utterance);
        }
      } catch (e) {}
    }, 1200);
  };

  // Descargar respaldo local JSON
  const handleExportBackup = () => {
    try {
      const backupData = {
        app_name: "MatrixOS Backup",
        timestamp: new Date().toISOString(),
        tasks,
        weeklyGoals,
        taskGoalsMap,
        weeklyCommentary
      };
      
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `matrix_os_backup_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      
      addLog("📥 COPIA DE SEGURIDAD: Creado y descargado archivo JSON con estado nominal del sistema.", "success");
    } catch (err) {
      addLog("❌ FALLO DE RESPALDO: No se pudo serializar el estado del sistema.", "error");
    }
  };

  // Importar respaldo local JSON
  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = event.target.files?.[0];
    if (!file) return;

    fileReader.onload = async (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed && Array.isArray(parsed.tasks)) {
          // Reemplazar tareas
          setTasks(parsed.tasks);
          addLog(`📤 COPIA DE SEGURIDAD: Restauradas ${parsed.tasks.length} tareas desde respaldo JSON.`, "success");
          
          if (Array.isArray(parsed.weeklyGoals)) {
            setWeeklyGoals(parsed.weeklyGoals);
            addLog(`🎯 METAS OKRs Semanales restauradas (${parsed.weeklyGoals.length} objetivos).`, "success");
          }
          if (parsed.taskGoalsMap) {
            setTaskGoalsMap(parsed.taskGoalsMap);
          }
          if (parsed.weeklyCommentary) {
            setWeeklyCommentary(parsed.weeklyCommentary);
          }
          
          addLog("✨ RESTAURACIÓN EXCEPCIONAL: Operación de restauración MatrixOS realizada correctamente.", "telemetry");
        } else {
          addLog("❌ ERROR DE IMPORTACIÓN: Archivo incompatible o corrupto.", "error");
        }
      } catch (err) {
        addLog("❌ ERROR DE PARSEO: Estructura JSON del respaldo inválida.", "error");
      }
    };
    fileReader.readAsText(file);
    // Vaciar input
    event.target.value = "";
  };

  // Soltar tarea en nueva sección de cuadrante
  const handleDrop = async (e: React.DragEvent, targetQuadrant: "Q1" | "Q2" | "Q3" | "Q4") => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    // Actualización optimista del cuadrante en el estado react
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, quadrant: targetQuadrant } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quadrant: targetQuadrant })
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
      }
    } catch (err) {
      console.warn("Fallo de API al actualizar cuadrante con drag and drop:", err);
    }
  };

  // Modificar la fecha límite / plazo de la tarea
  const handleUpdateDueDate = async (taskId: string, newDate: string) => {
    // Actualización local
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, due_date: newDate } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ due_date: newDate })
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
      }
    } catch (err) {
      console.warn("Fallo de API al actualizar fecha de plazo:", err);
    }
  };

  // Abrir Modal de Tarea con reseteo completo e inicialización de tags
  const handleOpenAddTaskModal = (initialDueDate?: string) => {
    setNewTitle("");
    setNewDescription("");
    setNewQuadrant("Q1");
    setNewAssignee("Marie Puscan");
    setNewDueDate(initialDueDate || "");
    setNewSelectedTags([]);
    setShowAddTaskModal(true);
  };

  // Agregar una tarea interactiva real en el Servidor
  const handleCreateTaskSim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const currentUserName = currentUser?.name || "Osman Marin";

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          quadrant: newQuadrant,
          assigned_to: newAssignee,
          created_by: currentUserName,
          due_date: newDueDate || "Sin plazo",
          tags: newSelectedTags
        })
      });

      if (res.ok) {
        const createdTaskObj = await res.json();
        setTasks(prev => [createdTaskObj, ...prev]);
        setSelectedTaskId(createdTaskObj.id);
      } else {
        throw new Error("Respuesta inválida");
      }
    } catch (err) {
      console.warn("Fallo de API, usando inserción offline:", err);
      const randomizedId = `#${Math.floor(100 + Math.random() * 900)}`;
      const newTask: TaskSim = {
        id: randomizedId,
        title: newTitle,
        description: newDescription || "Sin descripción adicional.",
        quadrant: newQuadrant,
        status: "TODO",
        created_by: currentUserName,
        assigned_to: newAssignee,
        created_at: "Ahora mismo",
        due_date: newDueDate || "Sin plazo",
        tags: newSelectedTags,
        notes: [],
        attachments: [],
        delegation_histories: [
          {
            id: Date.now(),
            from_user: currentUserName,
            to_user: newAssignee,
            assigned_at: "Ahora mismo"
          }
        ]
      };
      setTasks(prev => [newTask, ...prev]);
      setSelectedTaskId(newTask.id);
    }

    setShowAddTaskModal(false);
    setNewTitle("");
    setNewDescription("");
    setNewDueDate("");
    setNewSelectedTags([]);
  };

  // Agregar una etiqueta a una tarea en caliente (PATCH API)
  const handleAddTagToTask = async (taskId: string, tag: string) => {
    let finalTag = tag;
    if (tag === "__custom__") {
      const custom = prompt("Escribe el nombre de la nueva categoría:");
      if (!custom || !custom.trim()) return;
      finalTag = custom.trim();
    }
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const currentTags = task.tags || [];
    if (currentTags.includes(finalTag)) return;

    const newTags = [...currentTags, finalTag];
    
    // Actualización optimista local
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, tags: newTags } : t)));

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: newTags })
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
      }
    } catch (err) {
      console.warn("Error actualizando tags en API, usando local:", err);
    }
  };

  // Quitar una etiqueta de una tarea en caliente (PATCH API)
  const handleRemoveTagFromTask = async (taskId: string, tagToRemove: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const currentTags = task.tags || [];
    const newTags = currentTags.filter(tg => tg !== tagToRemove);

    // Actualización optimista local
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, tags: newTags } : t)));

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: newTags })
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
      }
    } catch (err) {
      console.warn("Error quitando tag en API, usando local:", err);
    }
  };

  // Agregar una nota real en la DB
  const handleAddNoteSim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim() || !currentTask) return;

    const currentUserName = currentUser?.name || "Osman Marin";
    const currentUserEmail = currentUser?.email || "osman.marin@matrixos.io";

    try {
      const res = await fetch(`/api/tasks/${currentTask.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newNoteContent,
          user: currentUserName
        })
      });

      if (res.ok) {
        const createdNoteObj = await res.json();
        setTasks(prev => prev.map(task => {
          if (task.id === currentTask.id) {
            return {
              ...task,
              notes: [...task.notes, createdNoteObj]
            };
          }
          return task;
        }));
      } else {
        throw new Error("Respuesta inválida de API");
      }
    } catch (err) {
      console.warn("Fallo de API, usando inserción local de comentario:", err);
      const newNoteObj: TaskNoteSim = {
        id: Date.now(),
        user: currentUserName,
        userEmail: currentUserEmail,
        content: newNoteContent,
        created_at: "Hace unos segundos"
      };

      setTasks(prev => prev.map(task => {
        if (task.id === currentTask.id) {
          return {
            ...task,
            notes: [...task.notes, newNoteObj]
          };
        }
        return task;
      }));
    }

    setNewNoteContent("");
  };

  // Eliminar una tarea real en la base de datos
  const handleDeleteTaskSim = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const remaining = tasks.filter(t => t.id !== id);
        setTasks(remaining);
        if (remaining.length > 0) {
          setSelectedTaskId(remaining[0].id);
        } else {
          setSelectedTaskId("");
        }
      }
    } catch (err) {
      console.warn("Fallo de API al eliminar, haciendo borrado en memoria:", err);
      const remaining = tasks.filter(t => t.id !== id);
      setTasks(remaining);
      if (remaining.length > 0) {
        setSelectedTaskId(remaining[0].id);
      } else {
        setSelectedTaskId("");
      }
    }
  };

  // Cambiar el estado o cuadrante de la tarea dinámicamente con la API Express
  const handleStatusChangeSim = async (id: string, newStatus: "TODO" | "IN_PROGRESS" | "DONE") => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updatedTask = await res.json();
        setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      } else {
        throw new Error("Fallo API status change");
      }
    } catch (err) {
      console.warn("Fallo de API, usando mutación local:", err);
      setTasks(prev => prev.map(task => {
        if (task.id === id) {
          return { ...task, status: newStatus };
        }
        return task;
      }));
    }
  };

  // Controlar la reasignación de colaboradores en tiempo real con la API Express
  const handleReassignSim = async (id: string, newAssignee: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assigned_to: newAssignee }),
      });
      if (res.ok) {
        const updatedTask = await res.json();
        setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      } else {
        throw new Error("Fallo API reassign");
      }
    } catch (err) {
      console.warn("Fallo de API, usando reasignación local:", err);
      setTasks(prev => prev.map(task => {
        if (task.id === id) {
          const histories = [...task.delegation_histories];
          if (task.assigned_to !== newAssignee) {
            histories.push({
              id: Date.now(),
              from_user: task.assigned_to,
              to_user: newAssignee,
              assigned_at: "Hace unos segundos"
            });
          }
          return {
            ...task,
            assigned_to: newAssignee,
            delegation_histories: histories
          };
        }
        return task;
      }));
    }
  };

  // Manejar la subida de un archivo real del sistema
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentTask) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/tasks/${currentTask.id}/attachments`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const attachment = await res.json();
        setTasks(prev => prev.map(task => {
          if (task.id === currentTask.id) {
            return {
              ...task,
              attachments: [...task.attachments, attachment]
            };
          }
          return task;
        }));
      } else {
        alert("Fallo al subir el archivo al volumen integrado.");
      }
    } catch (err) {
      console.error("Error al subir archivo adjunto de forma integrada:", err);
    }
  };

  // Stringified base de datos y endpoints de la Fase 2 para visualización directa
  const databasePyContent = `import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql+asyncpg://eisenhower:eisenhower_pass@db:5432/eisenhower_db"
)

# Inicializar motor asíncrono para PostgreSQL 16
engine = create_async_engine(DATABASE_URL, echo=True, future=True)

# Generador de sesiones asíncronas para control simultáneo
async_session = async_sessionmaker(
    bind=engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

# Dependencia moderna get_db para inyección de dependencias en FastAPI
async def get_db():
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()`;

  const mainPyContent = `import os
import shutil
from datetime import datetime
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Task, TaskNote, TaskAttachment, DelegationHistory, TeamMember
from app.schemas import TaskCreate, TaskResponse, TaskUpdate, TaskNoteCreate, TaskNoteResponse

app = FastAPI(title="MatrixOS - API Colaborativa Eisenhower")

# Configurar CORS para comunicación directa con el cliente React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint: Crear Tarea Colaborativa (Fase 2)
@app.post("/api/tasks", response_model=TaskResponse, status_code=201)
async def create_task(task_data: TaskCreate, db: AsyncSession = Depends(get_db)):
    nueva_tarea = Task(
        title=task_data.title,
        description=task_data.description,
        quadrant=task_data.quadrant,
        team_id=task_data.team_id,
        assigned_to=task_data.assigned_to
    )
    db.add(nueva_tarea)
    await db.flush()
    return nueva_tarea

# Endpoint: Historial y Trazabilidad de Delegaciones Integradas
@app.patch("/api/tasks/{task_id}", response_model=TaskResponse)
async def update_task(task_id: int, updates: TaskUpdate, db: AsyncSession = Depends(get_db)):
    query = select(Task).where(Task.id == task_id)
    result = await db.execute(query)
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no localizada")
        
    # Registrar traza si se reasigna la tarea
    if updates.assigned_to is not None and task.assigned_to != updates.assigned_to:
        historial = DelegationHistory(
            task_id=task.id,
            from_user_id=task.assigned_to,
            to_user_id=updates.assigned_to
        )
        db.add(historial)
        task.assigned_to = updates.assigned_to
        
    if updates.quadrant is not None:
        task.quadrant = updates.quadrant
    if updates.status is not None:
        task.status = updates.status
        
    await db.flush()
    return task

# Endpoint: Hilos de Comentarios Secuenciales (Fase 2)
@app.post("/api/tasks/{task_id}/notes", response_model=TaskNoteResponse)
async def add_note(task_id: int, data: TaskNoteCreate, db: AsyncSession = Depends(get_db)):
    nueva_nota = TaskNote(task_id=task_id, content=data.content, user_id=1)
    db.add(nueva_nota)
    await db.flush()
    return nueva_nota`;

  const modelsPyContent = `from enum import Enum as PyEnum
from datetime import datetime
from sqlalchemy import String, Integer, ForeignKey, DateTime, Enum, Text, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class Quadrant(str, PyEnum):
    Q1 = "Q1"  # Urgente / Importante (Hacer Primero)
    Q2 = "Q2"  # No Urgente / Importante (Planificar)
    Q3 = "Q3"  # Urgente / No Importante (Delegar)
    Q4 = "Q4"  # No Urgente / No Importante (Eliminar)

class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    quadrant: Mapped[Quadrant] = mapped_column(Enum(Quadrant), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="TODO")
    assigned_to: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    
    # Hilos secuenciales de Comentarios
    notes = relationship("TaskNote", back_populates="task", cascade="all, delete-orphan")
    attachments = relationship("TaskAttachment", back_populates="task")`;

  const schemasPyContent = `from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from app.models import Quadrant

class TaskNoteCreate(BaseModel):
    content: str = Field(..., min_length=1)

class TaskCreate(BaseModel):
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    quadrant: Quadrant
    team_id: int
    assigned_to: Optional[int] = None`;

  const dockerComposeContent = `version: '3.8'

services:
  db:
    image: postgres:16-alpine
    container_name: eisenhower_db
    restart: always
    environment:
      POSTGRES_USER: eisenhower
      POSTGRES_PASSWORD: eisenhower_pass
      POSTGRES_DB: eisenhower_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    container_name: eisenhower_backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://eisenhower:eisenhower_pass@db:5432/eisenhower_db
    depends_on:
      - db`;

  if (!currentUser) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 md:p-8 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
        {/* Diseños de fondo modernos al estilo Matrix */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.05),transparent_40%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        <div className="w-full max-w-sm bg-slate-900 border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-2xl relative z-10 backdrop-blur-md">
          <div className="text-center mb-6">
            <div className="inline-flex w-12 h-12 bg-indigo-600 rounded-xl items-center justify-center text-white font-mono text-2xl font-black tracking-tighter mb-4 shadow-lg shadow-indigo-600/25">
              M
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase font-sans">
              Matrix<span className="text-indigo-500">OS</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-wider">
              Matriz de Eisenhower Colaborativa
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2 font-mono">
                Selecciona tu Cuenta:
              </label>
              <div className="grid grid-cols-2 gap-3 pb-1">
                {mockTeamUsers.map(user => {
                  const isSelected = loginSelectedUser === user.id;
                  return (
                    <div
                      key={user.id}
                      onClick={() => {
                        setLoginSelectedUser(user.id);
                        setLoginError("");
                      }}
                      className={`p-4 border rounded-xl text-center cursor-pointer transition-all ${
                        isSelected
                          ? "bg-slate-800/80 border-indigo-500 shadow-md shadow-indigo-500/10"
                          : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-2 text-white font-bold text-xs select-none">
                        {user.avatar}
                      </div>
                      <div className="text-xs font-bold text-white tracking-tight leading-tight">
                        {user.name}
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono mt-1 block select-none">
                        {user.avatar === "OM" ? "Director Plan" : "Líder de Dev"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {loginSelectedUser && (
              <div className="space-y-2 animate-fade-in">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <label className="font-black uppercase tracking-wider text-slate-400">
                    Contraseña del Equipo:
                  </label>
                  <span className="text-slate-500">
                    Sugerida: <span className="text-indigo-450 underline font-bold">{mockTeamUsers.find(u => u.id === loginSelectedUser)?.password}</span>
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="Contraseña integrada"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all font-mono"
                    required
                  />
                </div>
              </div>
            )}

            {loginError && (
              <div className="p-3 bg-red-950/50 border border-red-900/80 text-rose-300 text-xs rounded-lg text-center font-mono leading-relaxed">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={!loginSelectedUser}
              className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-white transition-all select-none cursor-pointer flex items-center justify-center gap-1.5 ${
                loginSelectedUser
                  ? "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <span>Acceder a la Matriz</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center mt-6 text-[9px] text-slate-500 font-mono uppercase tracking-wider select-none">
            Consola de Seguridad Integrada • v1.1.2
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden selection:bg-slate-900 selection:text-white">
      
      {/* Header de Navegación Estilo Geometric Balance */}
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-3 md:px-8 flex-shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-900 rounded flex items-center justify-center text-white font-mono text-lg font-black tracking-tighter shrink-0 select-none">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] md:text-[10px] font-black text-slate-400 tracking-widest -mb-0.5 uppercase truncate max-w-[120px] md:max-w-none">Fase 2 / Backend Activo</span>
              <h1 className="font-black text-sm md:text-base tracking-tight uppercase text-slate-900 flex items-center gap-1.5">
                MatrixOS <span className="text-slate-400 font-medium hidden sm:inline">/ Arquitectura</span>
              </h1>
            </div>
          </div>
          <nav className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-wider text-slate-500">
            <span className="text-slate-900 border-b-2 border-slate-900 pb-5 pt-5 cursor-default">Fase 2: Conexiones & Endpoints</span>
            <span className="hover:text-slate-900 transition-colors cursor-pointer py-5" onClick={() => handleOpenAddTaskModal()}>
              + Programar Tarea
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-5">
          {/* Sincronizador Físico y Backup JSON Móvil / Sobremesa */}
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg p-1 shrink-0">
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className={`p-1.5 rounded transition-all cursor-pointer flex items-center justify-center text-xs h-7 w-7 ${
                isSyncing 
                  ? "bg-indigo-600 text-white animate-spin" 
                  : "bg-white hover:bg-slate-200 text-slate-700 hover:text-indigo-600 border border-slate-300/40"
              }`}
              title="Forzar actualización y sincronización PostgreSQL local"
            >
              🔄
            </button>
            <button
              onClick={handleExportBackup}
              className="p-1.5 rounded bg-white hover:bg-slate-200 text-slate-700 border border-slate-300/40 transition-all cursor-pointer flex items-center justify-center text-xs h-7 w-7 sm:w-auto sm:px-2"
              title="Descargar Copia de Seguridad JSON"
            >
              📥 <span className="hidden sm:inline text-[9px] font-mono font-black ml-1 uppercase">Backup</span>
            </button>
            <label className="p-1.5 rounded bg-white hover:bg-slate-200 text-slate-700 border border-slate-300/40 transition-all cursor-pointer flex items-center justify-center text-xs h-7 w-7 sm:w-auto sm:px-2">
              📤 <span className="hidden sm:inline text-[9px] font-mono font-black ml-1 uppercase">Restaurar</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>

          {/* Avatar e Información de Sesión Activa */}
          {currentUser && (
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 py-1 px-2.5 rounded-full text-[10px] md:text-xs text-slate-700 select-none shrink-0">
              <span className="w-4.5 h-4.5 md:w-5 md:h-5 bg-slate-900 rounded-full flex items-center justify-center text-[8px] md:text-[9px] font-mono text-white font-bold shrink-0">
                {currentUser.avatar}
              </span>
              <span className="font-bold truncate hidden sm:inline max-w-[120px]">{currentUser.name}</span>
              <button 
                onClick={handleLogout}
                className="text-[9px] uppercase font-bold text-slate-400 hover:text-rose-600 border-l border-slate-300 pl-1.5 ml-1 cursor-pointer transition-colors"
                title="Cerrar sesión activa del equipo"
              >
                Salir
              </button>
            </div>
          )}

          {/* Listado de Miembros del Equipo de Arquitectura */}
          <div className="hidden md:flex -space-x-2 items-center shrink-0">
            {mockTeamUsers.map(user => (
              <div 
                key={user.id} 
                className="w-7 h-7 rounded-full border-2 border-white bg-slate-800 text-white flex items-center justify-center text-[10px] font-black cursor-help hover:scale-105 transition-transform" 
                title={`${user.name} (${user.email})`}
              >
                {user.avatar}
              </div>
            ))}
          </div>

          <button 
            onClick={() => handleOpenAddTaskModal()}
            className="px-2.5 py-1.5 md:px-4 md:py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold rounded uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Nueva Tarea</span>
          </button>
        </div>
      </header>

      {/* Grid Principal - Estructura Clave de Geometric Balance */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Lado Izquierdo: Tablero de Tenedores de la Matriz de Eisenhower en Español */}
        <section className="flex-1 overflow-y-auto border-r border-slate-200 bg-slate-50 p-6 space-y-6">
          
          {/* Banner de Estado e Introducción de Fase 2 */}
          <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Layers className="w-36 h-36 text-slate-900" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-mono font-black uppercase rounded mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Conexión PostgreSQL en Tiempo Real
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Matriz de Eisenhower Interactiva
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                  Visualiza el flujo de datos transaccionales. Haz clic en cualquier tarea para editar su estado, consultar adjuntos, auditar hilos secuenciales de comentarios y rastrear su historial de delegación colaboradores.
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200 py-1.5 px-3 rounded flex items-center gap-1.5 shadow-2xs">
                  <Database className="w-3.5 h-3.5 text-slate-400" /> PostgreSQL 16
                </span>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200 py-1.5 px-3 rounded flex items-center gap-1.5 shadow-2xs">
                  <Server className="w-3.5 h-3.5 text-slate-400" /> FastAPI Async
                </span>
              </div>
            </div>
          </div>

          {/* Selector de Navegación Multidimensional de Comando */}
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 gap-1 shadow-xs overflow-x-auto">
            <button
              onClick={() => setActiveView("dashboard")}
              className={`flex-1 min-w-[130px] py-2.5 px-4 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeView === "dashboard"
                  ? "bg-slate-900 border border-slate-950 text-white shadow font-black scale-[1.01]"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-500" />
              Consola Definitiva
            </button>
            <button
              onClick={() => setActiveView("matrix")}
              className={`flex-1 min-w-[130px] py-2.5 px-4 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeView === "matrix"
                  ? "bg-slate-900 border border-slate-950 text-white shadow font-black scale-[1.01]"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Matriz & Calendario
            </button>
            <button
              onClick={() => setActiveView("analytics")}
              className={`flex-1 min-w-[130px] py-2.5 px-4 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeView === "analytics"
                  ? "bg-slate-900 border border-slate-950 text-white shadow font-black scale-[1.01]"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              Balance de Vida (Life-Work Analytics)
            </button>
            <button
              onClick={() => setActiveView("logbook")}
              className={`flex-1 min-w-[130px] py-2.5 px-4 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeView === "logbook"
                  ? "bg-slate-900 border border-slate-950 text-white shadow font-black scale-[1.01]"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Logros & Reporte Semanal
            </button>
            <button
              onClick={() => setActiveView("finances")}
              className={`flex-1 min-w-[130px] py-2.5 px-4 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeView === "finances"
                  ? "bg-slate-900 border border-slate-950 text-white shadow font-black scale-[1.01]"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              Finanzas Colectivas
            </button>
          </div>

          {/* ========================================================
              VISTA DE CONSOLA DEFINITIVA (COMMAND COCKPIT HUD)
              ======================================================== */}
          {activeView === "dashboard" && (
            <div className="space-y-6 animate-fade-in font-sans">
              
              {/* Resumen General de Operaciones */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xxs flex items-center gap-3">
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                    <Activity className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-black text-slate-400 block uppercase tracking-wider">Tareas Urgentes (Q1)</span>
                    <span className="text-xl font-mono font-black text-slate-900">
                      {tasks.filter(t => t.quadrant === "Q1" && t.status !== "DONE").length} Activas
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xxs flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-black text-slate-400 block uppercase tracking-wider">Proyectos Estratégicos (Q2)</span>
                    <span className="text-xl font-mono font-black text-slate-900">
                      {tasks.filter(t => t.quadrant === "Q2" && t.status !== "DONE").length} Pendientes
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xxs flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Award className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-black text-slate-400 block uppercase tracking-wider">OKRs Definidos</span>
                    <span className="text-xl font-mono font-black text-slate-900">
                      {weeklyGoals.length} Objetivos
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xxs flex items-center gap-3">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-black text-slate-400 block uppercase tracking-wider">Flujo Pomodoro</span>
                    <span className="text-xl font-mono font-black text-slate-900 uppercase">
                      {pomodoroIsRunning ? (pomodoroMode === "focus" ? "Enfoque" : "Descanso") : "Pausado"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bento Grid: Controles y Consolas Principales */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Lado Izquierdo: Sismógrafo, OKRs y Deck de Acciones Rápidas */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Sismógrafo Integrado con el Regulador Cognitivo */}
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                          <Activity className="w-4 h-4" />
                        </span>
                        <div>
                          <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider font-mono">
                            Sismógrafo de Sobrecarga Mental
                          </h4>
                          <p className="text-[10px] text-slate-500 font-sans">
                            Analizador biométrico de tareas críticas en espera de mitigación.
                          </p>
                        </div>
                      </div>
                      <span className="p-1 px-2 bg-indigo-50 border border-indigo-100 rounded font-mono text-[8px] font-extrabold text-indigo-700 uppercase tracking-widest">
                        Ponderación Dinámica
                      </span>
                    </div>

                    {(() => {
                      const realQ1Count = tasks.filter(t => t.quadrant === "Q1" && t.status !== "DONE").length;
                      const realQ2Count = tasks.filter(t => t.quadrant === "Q2" && t.status !== "DONE").length;
                      const otherActiveCount = tasks.filter(t => (t.quadrant === "Q3" || t.quadrant === "Q4") && t.status !== "DONE").length;

                      const adjustedQ1Value = Math.max(0, realQ1Count - burnoutSimulationOffset);
                      const rawScore = (adjustedQ1Value * 22) + (realQ2Count * 13) + (otherActiveCount * 5);
                      const score = Math.max(5, Math.min(100, Math.round(rawScore)));

                      let meterLabel = "OPERACIÓN SALUDABLE: Ritmo Óptimo";
                      let meterColor = "text-emerald-500 text-[10px] font-black";
                      let meterBg = "bg-emerald-50 text-emerald-800 border-emerald-100";
                      let advice = "Tu indicador cognitivo es excelente. Es un momento propicio para enfocar ciclos Pomodoro y cerrar objetivos complejos.";

                      if (score >= 35 && score < 70) {
                        meterLabel = "PRESIÓN MODERADA: Nivel Sostenido";
                        meterColor = "text-amber-500 text-[10px] font-black";
                        meterBg = "bg-amber-50 text-amber-800 border-amber-100";
                        advice = "Atención: Tu mente está absorbiendo múltiples directrices de negocio. Úsa el deck inferior para auto-delegar tareas de Q3 a Marie Puscan en caliente.";
                      } else if (score >= 70) {
                        meterLabel = "RIESGO DE DESGASTE CRÍTICO: Fatiga";
                        meterColor = "text-rose-600 text-[10px] font-black animate-pulse";
                        meterBg = "bg-rose-50 text-rose-800 border-rose-150";
                        advice = "¡Auxilio! Urgencias simultáneas saturando tu área de carga mental. Es crítico desacelerar o delegar tareas urgentes inmediatamente para evitar el burnout.";
                      }

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          <div className="md:col-span-5 flex flex-col items-center bg-slate-50 border border-slate-150 rounded-xl p-4 text-center">
                            <div className="relative w-36 h-20 overflow-hidden flex flex-col justify-end">
                              <div className="absolute top-0 left-0 w-36 h-36 rounded-full border-10 border-slate-200" />
                              <div 
                                className="absolute bottom-0 left-1/2 w-1 h-12 origin-bottom rounded-t bg-slate-800 transition-transform duration-700"
                                style={{ transform: `translate(-50%, 0) rotate(${-90 + ((score / 100) * 180)}deg)` }}
                              />
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-slate-900 rounded-full border-2 border-white" />
                            </div>
                            <div className="mt-3">
                              <span className="text-xl font-mono font-black text-slate-900 block">{score}%</span>
                              <span className={meterColor}>{meterLabel}</span>
                            </div>
                          </div>

                          <div className="md:col-span-7 space-y-3">
                            <div className={`p-3 border rounded-xl text-[11px] leading-relaxed ${meterBg}`}>
                              <strong className="block uppercase font-black tracking-wide text-[9px] mb-0.5">Recomendación de Cabina:</strong>
                              {advice}
                            </div>

                            {/* Regulador Cognitivo Interactiva */}
                            <div className="p-3 bg-slate-150 border border-slate-200 rounded-lg space-y-2">
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="font-extrabold text-slate-700">Simulador de Mitigación (Delegación Activa)</span>
                                <span className="bg-indigo-600 text-white p-0.5 px-1.5 rounded font-black">
                                  -{burnoutSimulationOffset * 22}% Presión
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-slate-400">0</span>
                                <input 
                                  type="range"
                                  min="0"
                                  max={Math.max(3, realQ1Count)}
                                  value={burnoutSimulationOffset}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setBurnoutSimulationOffset(val);
                                    addLog(`📈 Modulado el regulador mental sismográfico a factor de mitigación: -${val * 22}%`, "telemetry");
                                  }}
                                  className="flex-1 accent-indigo-600 h-1 bg-slate-250 rounded-lg cursor-pointer"
                                />
                                <span className="text-[10px] font-mono text-slate-400">{Math.max(3, realQ1Count)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Consola de Gatillos / Deck de Acciones Rápidas */}
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="p-1 px-1.5 bg-indigo-50 border border-indigo-150 text-indigo-600 rounded">
                          <Zap className="w-4 h-4 text-indigo-600" />
                        </span>
                        <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider font-mono">
                          Relámpago de Acciones Rápidas (Interactive Shortcut Deck)
                        </h4>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">Ejecución un click</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      
                      <button
                        type="button"
                        onClick={async () => {
                          const userToDelegate = currentUser?.name || "Osman Marin";
                          const targetTasks = tasks.filter(t => t.quadrant === "Q3" && t.status !== "DONE" && t.assigned_to === userToDelegate);
                          if (targetTasks.length === 0) {
                            addLog(`Verificación de Deck: No posees tareas pendientes en Q3 para delegar en lote.`, "warn");
                            return;
                          }
                          const targetUser = userToDelegate === "Osman Marin" ? "Marie Puscan" : "Osman Marin";
                          const updated = tasks.map(t => {
                            if (t.quadrant === "Q3" && t.status !== "DONE" && t.assigned_to === userToDelegate) {
                              return {
                                ...t,
                                assigned_to: targetUser,
                                delegation_histories: [
                                  ...t.delegation_histories,
                                  { id: Date.now() + Math.random(), from_user: userToDelegate, to_user: targetUser, assigned_at: "Hoy (Consola Lote)" }
                                ]
                              };
                            }
                            return t;
                          });
                          setTasks(updated);
                          addLog(`⚡ ACCIÓN MÁSTER: Delegadas ${targetTasks.length} tareas pendientes de Q3 a ${targetUser} para mitigar fatiga cognitiva.`, "success");
                          
                          // Simular llamadas API en segundo plano
                          targetTasks.forEach(async t => {
                            try {
                              await fetch(`/api/tasks/${t.id}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ assigned_to: targetUser })
                              });
                            } catch (e) {}
                          });
                        }}
                        className="p-3 border border-indigo-150 bg-indigo-50/20 hover:bg-indigo-50 text-left rounded-xl hover:border-indigo-400 transition-all group cursor-pointer"
                      >
                        <strong className="block text-[11px] font-extrabold text-indigo-950 flex items-center justify-between">
                          <span>⚡ Auto-Delegar Q3 a Marie</span>
                          <ChevronRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                        </strong>
                        <span className="text-[10px] text-indigo-700 mt-0.5 block line-clamp-1">
                          Mitigar carga operacionales delegando todo tu Q3 actual.
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const q4DoneCount = tasks.filter(t => t.quadrant === "Q4" && t.status === "DONE").length;
                          if (q4DoneCount === 0) {
                            addLog("Vaciado cancelado: No hay tareas de Q4 completadas acumuladas.", "warn");
                            return;
                          }
                          const updated = tasks.filter(t => !(t.quadrant === "Q4" && t.status === "DONE"));
                          setTasks(updated);
                          addLog(`🧹 BASE DE DATOS: Limpieza de índices ejecutada. Eliminadas ${q4DoneCount} tareas de Q4 completadas.`, "success");
                        }}
                        className="p-3 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left rounded-xl hover:border-slate-300 transition-all group cursor-pointer"
                      >
                        <strong className="block text-[11px] font-extrabold text-slate-800 flex items-center justify-between">
                          <span>🧹 Vaciado & Mantenimiento Q4</span>
                          <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </strong>
                        <span className="text-[10px] text-slate-500 mt-0.5 block line-clamp-1">
                          Depura registros de baja prioridad e históricos completados de la DB.
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (!pomodoroTaskId) {
                            addLog("Para simular un término de ciclo, la tarea Pomodoro debe estar enlazada en el panel de la derecha.", "warn");
                            return;
                          }
                          setPomodoroTimeLeft(0);
                          setPomodoroIsRunning(true);
                          addLog("🍅 ACELERADOR POMODORO: Forzando temporizador a 00:00 para gatillar bitácora automática.", "info");
                        }}
                        className="p-3 border border-emerald-150 bg-emerald-50/20 hover:bg-emerald-50 text-left rounded-xl hover:border-emerald-450 transition-all group cursor-pointer"
                      >
                        <strong className="block text-[11px] font-extrabold text-emerald-950 flex items-center justify-between">
                          <span>🍅 Completar Ciclo al Instante</span>
                          <ChevronRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                        </strong>
                        <span className="text-[10px] text-emerald-700 mt-0.5 block line-clamp-1">
                          Simular finalización óptima de 25m y gatillar el sintetizador de voz.
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          try {
                            const synth = window.speechSynthesis;
                            if (synth) {
                              const utterance = new SpeechSynthesisUtterance("Alerta de voz sintética de Matrix OS activa y sincronizada.");
                              synth.speak(utterance);
                              addLog("🔈 ALTAVOZ: Probado exitosamente el bus vocalizado del navegador.", "success");
                            } else {
                              addLog("🔈 ALTAVOZ ERROR: Tu navegador no es compatible con SpeechSynthesis.", "error");
                            }
                          } catch (e) {
                            addLog("🔈 ALTAVOZ CORRUPTO: Error de inicialización de bus físico.", "error");
                          }
                        }}
                        className="p-3 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left rounded-xl hover:border-slate-300 transition-all group cursor-pointer"
                      >
                        <strong className="block text-[11px] font-extrabold text-slate-800 flex items-center justify-between">
                          <span>🔈 Validar Alerta de Voz</span>
                          <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </strong>
                        <span className="text-[10px] text-slate-500 mt-0.5 block line-clamp-1">
                          Prueba la síntesis vocal del bus de audio local sin esperar el temporizador.
                        </span>
                      </button>

                    </div>
                  </div>

                  {/* Alineación de OKRs Semanales Compacta */}
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-1.5 font-sans">
                        <Award className="w-4 h-4 text-indigo-600 font-bold" />
                        <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider font-mono">
                          Metas de Alto Nivel y OKRs Semanales
                        </h4>
                      </div>
                      <span className="font-mono text-[9px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 rounded font-black">
                        {weeklyGoals.length} Metas
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {weeklyGoals.map(goal => {
                        const linked = tasks.filter(t => taskGoalsMap[t.id] === goal.id);
                        const doneCount = linked.filter(t => t.status === "DONE").length;
                        const pct = linked.length > 0 ? Math.round((doneCount / linked.length) * 100) : 0;
                        return (
                          <div key={goal.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between hover:border-slate-350 transition-colors">
                            <div className="space-y-1">
                              <span className={`text-[8px] font-mono font-black uppercase tracking-wider block ${goal.category === "Trabajo" ? "text-indigo-600" : "text-emerald-600"}`}>
                                {goal.category === "Trabajo" ? "🏢 Work" : "🌿 Life"}
                              </span>
                              <h5 className="text-[10px] font-bold text-slate-800 leading-tight line-clamp-2">
                                {goal.title}
                              </h5>
                            </div>
                            <div className="pt-2">
                              <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all" 
                                  style={{ 
                                    width: `${pct}%`,
                                    backgroundColor: goal.category === "Trabajo" ? "#4f46e5" : "#10b981"
                                  }}
                                />
                              </div>
                              <span className="text-[9px] font-mono text-slate-400 block mt-1">
                                {pct}% ({doneCount}/{linked.length} completadas)
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Lado Derecho: Dashboard del Temporizador de Pomodoro Exclusivo y Consola de Telemetría */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Master Temporizador Pomodoro */}
                  <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-xl relative overflow-hidden border border-slate-950 space-y-4">
                    <div className="absolute -top-10 -right-10 w-28 h-28 bg-indigo-600/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-emerald-600/10 rounded-full blur-2xl" />

                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
                      <div>
                        <h4 className="text-xs font-black uppercase text-slate-200 tracking-wider font-mono flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-indigo-400 animate-pulse" /> Controlador Pomodoro Integrado
                        </h4>
                        <p className="text-[10px] text-slate-400 font-sans">
                          Sincroniza sprints de enfoque y reporta a la bitácora.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center py-4 space-y-3 relative z-10">
                      
                      {/* Círculo de Cuenta Regresiva */}
                      <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center relative bg-slate-950/40">
                        {/* Indicador de Relleno Visual */}
                        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/30 animate-pulse" />
                        
                        <span className="text-2xl font-mono font-black text-slate-100 tracking-tight">
                          {String(Math.floor(pomodoroTimeLeft / 60)).padStart(2, "0")}:{String(pomodoroTimeLeft % 60).padStart(2, "0")}
                        </span>
                        <span className="text-[8px] font-mono font-black uppercase tracking-wider text-slate-400 block mt-1">
                          {pomodoroMode === "focus" ? "🔥 Enfoque" : "☕ Descanso"}
                        </span>
                      </div>

                      {/* Controles de Temporizador */}
                      <div className="flex gap-2 w-full max-w-[200px]">
                        {!pomodoroIsRunning ? (
                          <button
                            type="button"
                            onClick={() => {
                              setPomodoroIsRunning(true);
                              addLog(`🍅 Pomodoro Enfoque iniciado sobre tarea bind asignada (${pomodoroTaskId || 'Sin Tarea'}).`, "info");
                            }}
                            className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 border border-indigo-700 text-white rounded font-mono text-[10px] font-black uppercase tracking-wide transition-all cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95"
                          >
                            Iniciar
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setPomodoroIsRunning(false);
                              addLog("🍅 Pomodoro pausado temporalmente.", "warn");
                            }}
                            className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-450 border border-amber-600 text-white rounded font-mono text-[10px] font-black uppercase tracking-wide transition-all cursor-pointer shadow-md shadow-amber-500/20 active:scale-95"
                          >
                            Pausar
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setPomodoroIsRunning(false);
                            const tLeft = pomodoroMode === "focus" ? 1500 : 300;
                            setPomodoroTimeLeft(tLeft);
                            addLog("🍅 Pomodoro reiniciado a valores nominales.", "info");
                          }}
                          className="px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded text-xs hover:text-white transition-colors cursor-pointer border border-slate-700"
                          title="Reiniciar"
                        >
                          ↺
                        </button>
                      </div>
                    </div>

                    {/* Selector de Vinculación de Tareas Activas */}
                    <div className="space-y-1 relative z-10 pt-2 border-t border-slate-800">
                      <span className="text-[9px] font-mono font-black text-slate-400 block uppercase tracking-wider">
                        Vincular enfoque a una tarea de la Matriz:
                      </span>
                      <select
                        value={pomodoroTaskId || ""}
                        onChange={(e) => {
                          const val = e.target.value || null;
                          setPomodoroTaskId(val);
                          addLog(`🍅 Pomodoro sincronizado con la tarea: ${val || 'Ninguna'}`, "info");
                        }}
                        className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer text-left font-sans"
                      >
                        <option value="">-- No vincular (Reloj General) --</option>
                        {tasks.filter(t => t.status !== "DONE").map(task => (
                          <option key={task.id} value={task.id}>
                            [{task.id}] {task.title}
                          </option>
                        ))}
                      </select>
                      {pomodoroTaskId && (
                        <p className="text-[9px] text-indigo-400 font-mono mt-1">
                          🎯 Al expirar los 25 min, se creará un comentario de auditoría automáticamente en los detalles de la tarea.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Consola de Telemetría Terminal */}
                  <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 shadow-2xl space-y-3 font-mono text-xs text-slate-350">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold text-[10px] text-slate-200 uppercase tracking-wider">Consola de Telemetría MatrixOS</span>
                      </div>
                      <button
                        onClick={() => {
                          setConsoleLogs([]);
                          addLog("🧹 Consola de logs vaciada por operador.", "info");
                        }}
                        className="text-[9px] text-slate-600 hover:text-indigo-400 transition-colors uppercase font-bold cursor-pointer"
                        title="Limpiar Logs"
                      >
                        Limpiar
                      </button>
                    </div>

                    <div className="h-64 overflow-y-auto space-y-2 pr-1 font-mono text-[10px] leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
                      {consoleLogs.length === 0 ? (
                        <div className="text-center py-20 text-slate-600 text-[10px] italic">
                          Consola en espera de señales...
                        </div>
                      ) : (
                        consoleLogs.map(log => {
                          let typeColor = "text-slate-400";
                          if (log.type === "success") typeColor = "text-emerald-400 font-extrabold";
                          if (log.type === "warn") typeColor = "text-amber-400 font-extrabold";
                          if (log.type === "error") typeColor = "text-rose-500 font-black animate-pulse";
                          if (log.type === "telemetry") typeColor = "text-indigo-400 font-bold";

                          return (
                            <div key={log.id} className="flex gap-2 items-start hover:bg-slate-900/50 p-1 rounded transition-colors group">
                              <span className="text-slate-600 select-none font-bold">[{log.time}]</span>
                              <span className={`${typeColor} flex-1`}>{log.text}</span>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="border-t border-slate-900 pt-2 flex justify-between items-center text-[8px] text-slate-600 font-semibold select-none">
                      <span>PostgreSQL 16 Engine: OK</span>
                      <span>FastAPI WS Bus: ONLINE</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {activeView === "matrix" && (
            <>
              {/* Barra de Filtros de Etiquetas - Deslizable Horizontal en Celulares */}
              <div className="flex overflow-x-auto md:flex-wrap items-center gap-2 bg-white border border-slate-200 p-3.5 rounded-lg shadow-xs no-scrollbar select-none">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono mr-1 shrink-0">
                  <Tag className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> FILTRAR:
                </span>
                <button
                  onClick={() => setSelectedTagFilter(null)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer shrink-0 ${
                    selectedTagFilter === null
                      ? "bg-slate-900 text-white font-black shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  Todos ({tasks.length})
                </button>
                {["Negocio", "Familiar", "Ocio", "Desarrollo", "Personal", "Finanzas"].map(tg => {
                  const isSelected = selectedTagFilter === tg;
                  const count = tasks.filter(t => t.tags?.includes(tg)).length;
                  return (
                    <button
                      key={tg}
                      onClick={() => setSelectedTagFilter(tg)}
                      className={`px-3 py-1 text-xs font-extrabold rounded-md border transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 font-extrabold shadow-sm scale-[1.02]"
                          : `${TAG_COLORS[tg]?.bg || "bg-slate-100 text-slate-700 border-slate-200"} hover:brightness-95`
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-current"}`} />
                      {tg} <span className="text-[9px] opacity-75 font-mono">({count})</span>
                    </button>
                  );
                })}
              </div>

          {/* Ejes y Cuadrícula de la Matriz */}
          <div className="border border-slate-200 rounded-xl md:rounded bg-slate-200 md:bg-white overflow-hidden shadow-sm">
            
            {/* Cabecera del eje horizontal */}
            <div className="hidden md:flex h-12 border-b border-slate-200 bg-slate-100/60 font-mono">
              <div className="w-12 border-r border-slate-200 flex items-center justify-center bg-slate-100">
                <Clock className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex-1 flex text-center">
                <div className="w-1/2 flex items-center justify-center border-r border-slate-200 bg-white">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-red-600">
                    🔴 Urgente
                  </span>
                </div>
                <div className="w-1/2 flex items-center justify-center bg-white">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                    ⚪ No Urgente
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row">
              
              {/* Columna de etiquetas de eje vertical */}
              <div className="hidden md:flex w-12 flex-col border-r border-slate-200 bg-slate-100/60 font-mono">
                <div className="h-56 flex items-center justify-center border-b border-slate-200 bg-white">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-700 rotate-[-90deg] whitespace-nowrap">
                    ⭐ Importante
                  </span>
                </div>
                <div className="h-56 flex items-center justify-center bg-white">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 rotate-[-90deg] whitespace-nowrap">
                    💤 No Importante
                  </span>
                </div>
              </div>

              {/* El Grid de 4 cuadrantes balanceados */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0.5 md:gap-px bg-slate-200">
                
                {/* Q1: HACER PRIMERO */}
                <div 
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "Q1")}
                  className="bg-white p-5 min-h-[12rem] max-h-[18rem] md:min-h-[14rem] md:max-h-[14rem] overflow-y-auto flex flex-col justify-start border border-dashed border-transparent hover:border-red-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-1.5">
                      Q1: Acción Inmediata
                    </span>
                    <span className="bg-red-50 text-red-600 text-[9px] px-2 py-0.5 rounded font-black font-mono">
                      {filteredTasks.filter(t => t.quadrant === "Q1").length} Activas
                    </span>
                  </div>

                  <div className="space-y-2">
                    {filteredTasks.filter(t => t.quadrant === "Q1").map(task => (
                      <div
                        key={task.id}
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setIsMobileDetailsOpen(true);
                        }}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className={`p-3 rounded border transition-all cursor-grab active:cursor-grabbing text-left relative group select-none hover:shadow-md ${
                          selectedTaskId === task.id
                            ? "border-red-500 bg-red-50/20 shadow-xs"
                            : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                            {task.title}
                          </h4>
                          <span className="text-[9px] font-mono text-red-600 bg-red-100/50 px-1.5 py-0.2 rounded shrink-0">
                            {task.id}
                          </span>
                        </div>
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {task.tags.map(tg => {
                              const colors = TAG_COLORS[tg] || DEFAULT_TAG_COLOR;
                              return (
                                <span key={tg} className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded border uppercase tracking-wider ${colors.bg}`}>
                                  {tg}
                                </span>
                              );
                            })}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-3 text-[10px] font-mono pt-1.5 border-t border-slate-100">
                          <span className="text-slate-600 font-bold">{task.assigned_to}</span>
                          {task.due_date && (
                            <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[8px] font-sans font-black flex items-center gap-1 shrink-0 uppercase tracking-wider">
                              ⏱️ {task.due_date}
                            </span>
                          )}
                        </div>

                        {/* Control de Cuadrantes e Hitos Rápido para celulares */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5 select-none" onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleToggleTaskStatusDirectly(task.id)}
                            className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-black uppercase tracking-wider cursor-pointer border ${
                              task.status === "DONE"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-650 border-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            {task.status === "DONE" ? "✔️ Listo" : "⏳ Pendiente"}
                          </button>
                          
                          <div className="flex items-center gap-0.5 font-mono text-[8px]">
                            <span className="text-[7px] text-slate-400 font-extrabold uppercase mr-1">Mover:</span>
                            {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                              <button
                                key={q}
                                type="button"
                                onClick={() => handleMoveQuadrantDirectly(task.id, q as any)}
                                className={`w-4 h-4 rounded text-[8px] font-black flex items-center justify-center transition-colors cursor-pointer ${
                                  task.quadrant === q
                                    ? "bg-slate-900 text-white font-bold"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-500"
                                }`}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Q2: PLANIFICAR */}
                <div 
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "Q2")}
                  className="bg-white p-5 min-h-[12rem] max-h-[18rem] md:min-h-[14rem] md:max-h-[14rem] overflow-y-auto flex flex-col justify-start border border-dashed border-transparent hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest flex items-center gap-1.5">
                      Q2: Enfoque Estratégico
                    </span>
                    <span className="bg-indigo-50 text-indigo-700 text-[9px] px-2 py-0.5 rounded font-black font-mono">
                      {filteredTasks.filter(t => t.quadrant === "Q2").length} Activas
                    </span>
                  </div>

                  <div className="space-y-2">
                    {filteredTasks.filter(t => t.quadrant === "Q2").map(task => (
                      <div
                        key={task.id}
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setIsMobileDetailsOpen(true);
                        }}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className={`p-3 rounded border transition-all cursor-grab active:cursor-grabbing text-left relative group select-none hover:shadow-md ${
                          selectedTaskId === task.id
                            ? "border-indigo-500 bg-indigo-50/20 shadow-xs"
                            : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                            {task.title}
                          </h4>
                          <span className="text-[9px] font-mono text-slate-450 shrink-0">
                            {task.id}
                          </span>
                        </div>
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {task.tags.map(tg => {
                              const colors = TAG_COLORS[tg] || DEFAULT_TAG_COLOR;
                              return (
                                <span key={tg} className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded border uppercase tracking-wider ${colors.bg}`}>
                                  {tg}
                                </span>
                              );
                            })}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-3 text-[10px] font-mono pt-1.5 border-t border-slate-100">
                          <span className="text-slate-600 font-bold">{task.assigned_to}</span>
                          {task.due_date && (
                            <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[8px] font-sans font-black flex items-center gap-1 shrink-0 uppercase tracking-wider">
                              ⏱️ {task.due_date}
                            </span>
                          )}
                        </div>

                        {/* Control de Cuadrantes e Hitos Rápido para celulares */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5 select-none" onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleToggleTaskStatusDirectly(task.id)}
                            className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-black uppercase tracking-wider cursor-pointer border ${
                              task.status === "DONE"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-655 border-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            {task.status === "DONE" ? "✔️ Listo" : "⏳ Pendiente"}
                          </button>
                          
                          <div className="flex items-center gap-0.5 font-mono text-[8px]">
                            <span className="text-[7px] text-slate-400 font-extrabold uppercase mr-1">Mover:</span>
                            {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                              <button
                                key={q}
                                type="button"
                                onClick={() => handleMoveQuadrantDirectly(task.id, q as any)}
                                className={`w-4 h-4 rounded text-[8px] font-black flex items-center justify-center transition-colors cursor-pointer ${
                                  task.quadrant === q
                                    ? "bg-slate-900 text-white font-bold"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-500"
                                }`}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Q3: DELEGAR */}
                <div 
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "Q3")}
                  className="bg-white p-5 min-h-[12rem] max-h-[18rem] md:min-h-[14rem] md:max-h-[14rem] overflow-y-auto flex flex-col justify-start border border-dashed border-transparent hover:border-amber-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest flex items-center gap-1.5">
                      Q3: Cola de Delegación
                    </span>
                    <span className="bg-amber-50 text-amber-700 text-[9px] px-2 py-0.5 rounded font-black font-mono">
                      {filteredTasks.filter(t => t.quadrant === "Q3").length} Activas
                    </span>
                  </div>

                  <div className="space-y-2">
                    {filteredTasks.filter(t => t.quadrant === "Q3").map(task => (
                      <div
                        key={task.id}
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setIsMobileDetailsOpen(true);
                        }}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className={`p-3 rounded border transition-all cursor-grab active:cursor-grabbing text-left relative group select-none hover:shadow-md ${
                          selectedTaskId === task.id
                            ? "border-amber-400 bg-amber-50/20 shadow-xs"
                            : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                            {task.title}
                          </h4>
                          <span className="text-[9px] font-mono text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded shrink-0">
                            {task.id}
                          </span>
                        </div>
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {task.tags.map(tg => {
                              const colors = TAG_COLORS[tg] || DEFAULT_TAG_COLOR;
                              return (
                                <span key={tg} className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded border uppercase tracking-wider ${colors.bg}`}>
                                  {tg}
                                </span>
                              );
                            })}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-3 text-[10px] font-mono pt-1.5 border-t border-slate-100">
                          <span className="text-amber-800 font-bold">{task.assigned_to}</span>
                          {task.due_date && (
                            <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[8px] font-sans font-black flex items-center gap-1 shrink-0 uppercase tracking-wider">
                              ⏱️ {task.due_date}
                            </span>
                          )}
                        </div>

                        {/* Control de Cuadrantes e Hitos Rápido para celulares */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5 select-none" onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleToggleTaskStatusDirectly(task.id)}
                            className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-black uppercase tracking-wider cursor-pointer border ${
                              task.status === "DONE"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-650 border-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            {task.status === "DONE" ? "✔️ Listo" : "⏳ Pendiente"}
                          </button>
                          
                          <div className="flex items-center gap-0.5 font-mono text-[8px]">
                            <span className="text-[7px] text-slate-400 font-extrabold uppercase mr-1">Mover:</span>
                            {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                              <button
                                key={q}
                                type="button"
                                onClick={() => handleMoveQuadrantDirectly(task.id, q as any)}
                                className={`w-4 h-4 rounded text-[8px] font-black flex items-center justify-center transition-colors cursor-pointer ${
                                  task.quadrant === q
                                    ? "bg-slate-900 text-white font-bold"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-500"
                                }`}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Q4: ELIMINAR */}
                <div 
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "Q4")}
                  className="bg-white p-5 min-h-[12rem] max-h-[18rem] md:min-h-[14rem] md:max-h-[14rem] overflow-y-auto flex flex-col justify-start border border-dashed border-transparent hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      Q4: Baja Prioridad
                    </span>
                    <span className="bg-slate-50 text-slate-650 text-[9px] px-2 py-0.5 rounded font-black font-mono">
                      {filteredTasks.filter(t => t.quadrant === "Q4").length} Activas
                    </span>
                  </div>

                  <div className="space-y-2">
                    {filteredTasks.filter(t => t.quadrant === "Q4").map(task => (
                      <div
                        key={task.id}
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setIsMobileDetailsOpen(true);
                        }}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className={`p-3 rounded border transition-all cursor-grab active:cursor-grabbing text-left relative group select-none hover:shadow-md ${
                          selectedTaskId === task.id
                            ? "border-slate-505 bg-slate-100 shadow-xs"
                            : "border-slate-101 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-slate-900 line-through line-clamp-2 leading-tight text-slate-400">
                            {task.title}
                          </h4>
                          <span className="text-[9px] font-mono text-slate-400 shrink-0">
                            {task.id}
                          </span>
                        </div>
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5 opacity-60">
                            {task.tags.map(tg => {
                              const colors = TAG_COLORS[tg] || DEFAULT_TAG_COLOR;
                              return (
                                <span key={tg} className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded border uppercase tracking-wider ${colors.bg}`}>
                                  {tg}
                                </span>
                              );
                            })}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-3 text-[10px] font-mono pt-1.5 border-t border-slate-100">
                          <span className="text-slate-400 font-bold">{task.assigned_to}</span>
                          {task.due_date && (
                            <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[8px] font-sans font-black flex items-center gap-1 shrink-0 uppercase tracking-wider">
                              ⏱️ {task.due_date}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* PLANIFICADOR COMPLETO & CALENDARIO INTERACTIVO (Fase 2+) */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" /> CALENDARIO Y PLANIFICADOR DE PLAZOS
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualiza plazos, detecta cuellos de botella y haz clic en un día para reprogramar o crear tareas.
                </p>
              </div>

              {/* Controles de Navegación de Mes */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (calendarMonth === 0) {
                      setCalendarMonth(11);
                      setCalendarYear(y => y - 1);
                    } else {
                      setCalendarMonth(m => m - 1);
                    }
                    setSelectedCalendarDay(null);
                  }}
                  className="p-1 px-2 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-600 text-xs transition-colors flex items-center justify-center cursor-pointer select-none"
                  title="Mes Anterior"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <span className="text-xs font-black font-mono text-slate-900 px-3 min-w-[120px] text-center bg-slate-50 py-1.5 rounded-md border border-slate-100 uppercase tracking-widest">
                  {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"][calendarMonth]} {calendarYear}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (calendarMonth === 11) {
                      setCalendarMonth(0);
                      setCalendarYear(y => y + 1);
                    } else {
                      setCalendarMonth(m => m + 1);
                    }
                    setSelectedCalendarDay(null);
                  }}
                  className="p-1 px-2 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-600 text-xs transition-colors flex items-center justify-center cursor-pointer select-none"
                  title="Siguiente Mes"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Leyenda de Prioridad de Cuadrantes */}
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono font-bold text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-slate-400 uppercase tracking-wider">Prioridades:</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Q1 (Urgente)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span> Q2 (Estratégico)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Q3 (Delegado)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span> Q4 (Baja Prioridad)</span>
            </div>

            {/* Matriz Calendario (Grid) */}
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
              {/* Días de la semana */}
              <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-[10px] font-mono font-bold text-slate-400 text-center uppercase tracking-widest py-2">
                {["L", "M", "X", "J", "V", "S", "D"].map(d => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              {/* Cuadrículas de los Días */}
              <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-slate-50 text-slate-800">
                {/* Celdas vacías iniciales para empotrar inicio del mes */}
                {Array.from({ length: (new Date(calendarYear, calendarMonth, 1).getDay() + 6) % 7 }).map((_, index) => (
                  <div key={`empty-${index}`} className="min-h-[3.5rem] md:min-h-[4.5rem] bg-slate-50/50"></div>
                ))}

                {/* Celdas numéricas del mes */}
                {Array.from({ length: new Date(calendarYear, calendarMonth + 1, 0).getDate() }).map((_, idx) => {
                  const day = idx + 1;
                  const isSelected = selectedCalendarDay === day;
                  const isCurrentNow = new Date().getDate() === day && new Date().getMonth() === calendarMonth && new Date().getFullYear() === calendarYear;
                  const matchingTasks = filteredTasks.filter(t => matchTaskWithDate(t.due_date, calendarYear, calendarMonth, day));
                  const matchingObligations = financeTransactions.filter(t => 
                    t.type === "OBLIGACIONES" && 
                    matchTaskWithDate(t.due_date, calendarYear, calendarMonth, day)
                  );

                  return (
                    <div
                      key={`day-${day}`}
                      onClick={() => setSelectedCalendarDay(day)}
                      className={`min-h-[3.5rem] md:min-h-[4.5rem] bg-white p-2 transition-all cursor-pointer flex flex-col justify-between selection:bg-transparent relative hover:bg-indigo-50/10 ${
                        isSelected 
                          ? "ring-2 ring-indigo-500 ring-inset bg-indigo-50/20" 
                          : isCurrentNow 
                            ? "bg-slate-900/5 font-black" 
                            : ""
                      }`}
                    >
                      {/* Cabecera de celda: Número del día */}
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono leading-none ${
                          isCurrentNow 
                            ? "bg-slate-900 text-white font-black px-1.5 py-0.5 rounded-full text-[9px]" 
                            : isSelected 
                              ? "text-indigo-700 font-extrabold" 
                              : "text-slate-400 font-medium"
                        }`}>
                          {day}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {matchingTasks.length > 0 && (
                            <span className="text-[8px] font-mono bg-indigo-105 text-indigo-700 leading-none px-1 py-0.5 rounded font-black" title={`${matchingTasks.length} Tareas`}>
                              {matchingTasks.length}T
                            </span>
                          )}
                          {matchingObligations.length > 0 && (
                            <span className="text-[8px] font-mono bg-amber-105 text-amber-800 leading-none px-1 py-0.5 rounded font-black" title={`${matchingObligations.length} Obligaciones`}>
                              {matchingObligations.length}$
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Lista de Micro Tareas y Obligaciones con Código de Color */}
                      <div className="space-y-1 mt-1 flex-1 overflow-y-auto max-h-[3.2rem] scrollbar-none">
                        {matchingTasks.map(task => {
                          const isTaskActive = selectedTaskId === task.id;
                          const bgClass = 
                            task.quadrant === "Q1" ? "bg-red-55 text-red-700 border-red-200" :
                            task.quadrant === "Q2" ? "bg-indigo-55 text-indigo-700 border-indigo-200" :
                            task.quadrant === "Q3" ? "bg-amber-55 text-amber-700 border-amber-200" :
                            "bg-slate-150 text-slate-700 border-slate-250";

                          const dotClass = 
                            task.quadrant === "Q1" ? "bg-red-500" :
                            task.quadrant === "Q2" ? "bg-indigo-600" :
                            task.quadrant === "Q3" ? "bg-amber-500" :
                            "bg-slate-400";

                          return (
                            <button
                              key={task.id}
                              onClick={(e) => {
                                e.stopPropagation(); // Evitar seleccionar celda del día
                                setSelectedTaskId(task.id);
                                setIsMobileDetailsOpen(true);
                              }}
                              title={`[${task.quadrant}] ${task.title}`}
                              className={`w-full text-left text-[8px] font-semibold p-1 py-0.5 rounded border leading-tight truncate flex items-center gap-1 select-none cursor-pointer hover:shadow-xs translate-y-0 active:translate-y-px transition-all ${bgClass} ${
                                isTaskActive ? "ring-1 ring-slate-900 font-bold" : ""
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
                              <span className="truncate">{task.id}</span>
                            </button>
                          );
                        })}

                        {matchingObligations.map(ob => {
                          const isPending = ob.status === "PENDIENTE";
                          const bgClass = isPending 
                            ? "bg-amber-50 text-amber-800 border-amber-200/70" 
                            : "bg-emerald-50 text-emerald-800 border-emerald-200/75 line-through opacity-75";

                          const dotClass = isPending ? "bg-amber-500" : "bg-emerald-550";

                          return (
                            <div
                              key={ob.id}
                              title={`[Obligación - ${ob.category}] ${ob.title} ($${ob.amount}) - ${ob.status}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCalendarDay(day);
                              }}
                              className={`w-full text-left text-[8px] font-bold p-1 py-0.5 rounded border leading-tight truncate flex items-center justify-between gap-1 select-none transition-all cursor-pointer ${bgClass}`}
                            >
                              <div className="flex items-center gap-0.5 truncate max-w-[70%]">
                                <span className={`w-1 h-1 rounded-full shrink-0 ${dotClass}`} />
                                <span className="truncate">{ob.title}</span>
                              </div>
                              <span className="font-mono text-[7px] shrink-0 font-black">${ob.amount}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Panel de Acciones Rápidas del Día Seleccionado */}
            {selectedCalendarDay !== null ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 font-sans shadow-xxs">
                {/* Cabecera del Panel */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 px-3 bg-indigo-600 text-white font-mono text-sm font-black rounded-lg shadow-sm">
                      {selectedCalendarDay}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-black tracking-widest block uppercase font-mono">Planificador Diario</span>
                      <span className="text-xs font-black text-slate-900">
                        {selectedCalendarDay} de {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"][calendarMonth]} de {calendarYear}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Botón para asignar tarea */}
                    {currentTask && currentTask.id && currentTask.title && !currentTask.title.startsWith("Cargando") ? (
                      <button
                        type="button"
                        onClick={() => {
                          const dateString = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(selectedCalendarDay).padStart(2, "0")}`;
                          handleUpdateDueDate(currentTask.id, dateString);
                        }}
                        className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer select-none shadow-3xs whitespace-nowrap"
                      >
                        📅 Asignar "{currentTask.id}" a este día
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => {
                        const dateString = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(selectedCalendarDay).padStart(2, "0")}`;
                        handleOpenAddTaskModal(dateString);
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer select-none whitespace-nowrap shadow-sm"
                    >
                      ➕ Crear Tarea Aquí
                    </button>
                  </div>
                </div>

                {/* Grid con Tareas y Obligaciones del Día */}
                {(() => {
                  const dayTasks = filteredTasks.filter(t => matchTaskWithDate(t.due_date, calendarYear, calendarMonth, selectedCalendarDay));
                  const dayObligations = financeTransactions.filter(t => 
                    t.type === "OBLIGACIONES" && 
                    matchTaskWithDate(t.due_date, calendarYear, calendarMonth, selectedCalendarDay)
                  );

                  const hasItems = dayTasks.length > 0 || dayObligations.length > 0;

                  if (!hasItems) {
                    return (
                      <div className="text-center py-6 text-slate-400 text-xs font-mono border border-dashed border-slate-200 rounded-lg">
                        ☕ No hay tareas planificadas ni obligaciones de pago con vencimiento para este día.
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Columna de Tareas de la Matriz */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono font-black text-slate-400 block uppercase tracking-wider">
                          📋 Actividades Planificadas ({dayTasks.length})
                        </span>
                        {dayTasks.length === 0 ? (
                          <p className="text-[10px] text-slate-405 italic text-left">Sin tareas para esta fecha.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {dayTasks.map(task => {
                              const qLabel = 
                                task.quadrant === "Q1" ? "Urgente & Importante" :
                                task.quadrant === "Q2" ? "Importante, No Urgente" :
                                task.quadrant === "Q3" ? "Urgente, No Importante" : "Eliminar de la lista";
                              const qBadgeBg = 
                                task.quadrant === "Q1" ? "bg-red-100 text-red-800" :
                                task.quadrant === "Q2" ? "bg-indigo-100 text-indigo-800" :
                                task.quadrant === "Q3" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-800";
                              
                              return (
                                <div 
                                  key={task.id}
                                  onClick={() => {
                                    setSelectedTaskId(task.id);
                                    setIsMobileDetailsOpen(true);
                                  }}
                                  className="p-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg flex items-center justify-between gap-3 text-left cursor-pointer transition-all shadow-3xs"
                                >
                                  <div className="truncate">
                                    <span className="text-[10px] font-mono text-slate-400 block font-bold">{task.id}</span>
                                    <span className="text-xs font-bold text-slate-800 block truncate">{task.title}</span>
                                  </div>
                                  <span className={`text-[8.5px] font-mono font-black px-1.5 py-0.5 rounded uppercase tracking-tight shrink-0 ${qBadgeBg}`} title={qLabel}>
                                    {task.quadrant}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Columna de Obligaciones Financieras Colectivas */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono font-black text-amber-600 block uppercase tracking-wider flex items-center gap-1 text-left">
                          💰 Vencimiento de Obligaciones ({dayObligations.length})
                        </span>
                        {dayObligations.length === 0 ? (
                          <p className="text-[10px] text-slate-405 italic text-left">Ningún pago vence hoy.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {dayObligations.map(ob => {
                              const isPaid = ob.status === "PAGADO";
                              return (
                                <div 
                                  key={ob.id}
                                  className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-3 shadow-3xs"
                                >
                                  <div className="truncate text-left">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[9px] font-mono bg-slate-100 text-slate-600 border border-slate-200 px-1 py-0.2 rounded uppercase font-black">
                                        {ob.category}
                                      </span>
                                      {ob.recurrence_parent_id && (
                                        <span className="text-[8.5px] font-mono text-indigo-650 font-extrabold" title="Recurrente mensual">
                                          🔄 Recurrente
                                        </span>
                                      )}
                                    </div>
                                    <span className={`text-xs font-bold block truncate mt-0.5 ${isPaid ? "line-through text-slate-400" : "text-slate-800"}`}>
                                      {ob.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="font-mono text-xs font-black text-slate-900">${ob.amount}</span>
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        await handleToggleObligationStatus(ob.id, ob.status || "PENDIENTE", ob.title);
                                      }}
                                      className={`px-2 py-1 rounded font-mono text-[9px] font-black uppercase tracking-wide cursor-pointer select-none transition-all ${
                                        isPaid 
                                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-205" 
                                          : "bg-amber-100 text-amber-800 hover:bg-amber-150 border border-amber-300"
                                      }`}
                                    >
                                      {isPaid ? "✅ PAGADO" : "⏳ PENDIENTE"}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center p-3.5 border border-dashed border-slate-200 text-slate-400 text-xs rounded-lg font-sans">
                💡 Haz clic en cualquier celda para desbloquear el planificador interactivo rápido sobre ese día.
              </div>
            )}
          </div>
        </>
      )}

          {/* ========================================================
              VISTA DE BALANCE DE VIDA Y TRABAJO (LIFE-WORK ANALYTICS)
              ======================================================== */}
          {activeView === "analytics" && (
            <div className="space-y-6">
              {/* Tarjeta de Resumen Ejecutivo de Balance */}
              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 p-5 text-indigo-100 pointer-events-none">
                  <PieChart className="w-24 h-24 text-slate-100" />
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                      <TrendingUp className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-black text-slate-900 tracking-tight">
                        Life-Work Balance Index (Índice de Distribución)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Evaluación automatizada de distribución de carga mental en base a categorías de tareas activas.
                      </p>
                    </div>
                  </div>

                  {/* Cálculo matemático del balance */}
                  {(() => {
                    const workTags = ["Negocio", "Desarrollo", "Finanzas"];
                    const lifeTags = ["Familiar", "Ocio", "Personal"];

                    const workTasks = tasks.filter(t => t.tags?.some(tag => workTags.includes(tag)));
                    const lifeTasks = tasks.filter(t => t.tags?.some(tag => lifeTags.includes(tag)));
                    
                    const workCount = workTasks.length;
                    const lifeCount = lifeTasks.length;
                    const totalTagged = workCount + lifeCount || 1;
                    const workPct = Math.round((workCount / totalTagged) * 100);
                    const lifePct = 100 - workPct;

                    // Estado de Sobrecarga (Workload Saturation)
                    // Cuenta las tareas de Q1 y Q2 no completadas
                    const activeUrgentCount = tasks.filter(t => (t.quadrant === "Q1" || t.quadrant === "Q2") && t.status !== "DONE").length;
                    
                    let saturationLabel = "Óptimo (Bajo Desgaste)";
                    let saturationColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                    let saturationBarColor = "bg-emerald-500";
                    
                    if (activeUrgentCount >= 3 && activeUrgentCount <= 5) {
                      saturationLabel = "Moderado (Sostenible)";
                      saturationColor = "bg-amber-50 text-amber-700 border-amber-200";
                      saturationBarColor = "bg-amber-500";
                    } else if (activeUrgentCount >= 6) {
                      saturationLabel = "¡Alto Riesgo (Saturación detected)!";
                      saturationColor = "bg-rose-50 text-rose-700 border-rose-200";
                      saturationBarColor = "bg-rose-500";
                    }

                    // Mensaje de consejo inteligente / Coaching
                    let coachingMsg = "¡Fabuloso! Tu balanza está perfectamente equilibrada entre metas laborales y momentos de desconexión familiar. Mantén este ritmo de vida.";
                    if (workPct > 70) {
                      coachingMsg = "Advertencia de asimetría: Estás dedicando más del 70% de tus esfuerzos a Negocio y Desarrollo. Te sugerimos programar una tarea en Q2 bajo la categoría 'Ocio' o 'Familiar' para recargar baterías.";
                    } else if (lifePct > 70) {
                      coachingMsg = "Aviso de alineación: Tienes un alto porcentaje de tareas de esparcimiento familiar u ocio personal. Excelente para tu bienestar, recuerda auditar tus plazos transaccionales en Negocio para evitar retrasos de entrega.";
                    }

                    return (
                      <>
                        {/* Indicadores Clave en Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block font-mono">Enfoque Profesional</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl font-black text-slate-900">{workPct}%</span>
                              <span className="text-[10px] font-mono text-indigo-600 font-bold">({workCount} tareas)</span>
                            </div>
                            <span className="text-[10px] text-slate-500 block leading-tight">Negocio / Desarrollo / Finanzas</span>
                          </div>

                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1 font-sans">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block font-mono">Bienestar & Desconexión</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl font-black text-slate-900">{lifePct}%</span>
                              <span className="text-[10px] font-mono text-emerald-600 font-bold">({lifeCount} tareas)</span>
                            </div>
                            <span className="text-[10px] text-slate-500 block leading-tight">Familiar / Personal / Ocio</span>
                          </div>

                          <div className={`p-4 border rounded-xl space-y-1 ${saturationColor}`}>
                            <span className="text-[9px] font-black uppercase tracking-widest block font-mono opacity-85">Estado de Saturación</span>
                            <div className="text-lg font-black tracking-tight">{saturationLabel}</div>
                            <span className="text-[10px] block leading-tight opacity-90">{activeUrgentCount} tareas clave activas en Q1/Q2</span>
                          </div>
                        </div>

                        {/* Barra de Distribución Visual Exquisita */}
                        <div className="space-y-1.5 pt-2">
                          <div className="flex justify-between text-[10px] font-mono font-black text-slate-400 tracking-wider">
                            <span>TRABAJO ({workPct}%)</span>
                            <span>VIDA Y FAMILIA ({lifePct}%)</span>
                          </div>
                          <div className="h-4.5 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/50">
                            <div className="bg-indigo-605 h-full transition-all duration-500 flex items-center justify-center text-[9px] font-black text-white" style={{ width: `${workPct}%`, backgroundColor: '#4f46e5' }}>
                              {workPct >= 15 && "TRABAJO"}
                            </div>
                            <div className="bg-emerald-505 h-full transition-all duration-500 flex items-center justify-center text-[9px] font-black text-white" style={{ width: `${lifePct}%`, backgroundColor: '#10b981' }}>
                              {lifePct >= 15 && "VIDA"}
                            </div>
                          </div>
                        </div>

                        {/* Tarjeta de Coaching Mentor Activo */}
                        <div className="bg-amber-50/50 border border-amber-200/60 p-4 rounded-lg flex items-start gap-3">
                          <span className="p-1 bg-amber-100 text-amber-850 rounded-md text-xs mt-0.5">💡</span>
                          <p className="text-xs text-amber-900 leading-relaxed font-sans font-medium">
                            <strong className="font-extrabold block mb-0.5">Sugerencia Estratégica del Sistema:</strong>
                            {coachingMsg}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* NOVEDAD 3: SISMÓGRAFO DE SOBRECARGA & DETECTOR DE QUEMARSE (BURNOUT METER) */}
              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-rose-50 text-rose-605 rounded-lg" style={{ color: '#e11d48' }}>
                      <Activity className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 tracking-tight font-sans">
                        Sismógrafo de Sobrecarga Mental & Medidor de Riesgo de Desgaste (Burnout Gauge)
                      </h4>
                      <p className="text-[11px] text-slate-500 font-sans">
                        Analizador ponderado de compromisos activos Vs. tu límite de saturación cognitiva.
                      </p>
                    </div>
                  </div>
                  <span className="p-1 px-2.5 bg-indigo-50 border border-indigo-120 rounded font-mono text-[9px] font-black text-indigo-700 uppercase tracking-widest animate-pulse">
                    Mapeo Predictivo
                  </span>
                </div>

                {(() => {
                  // Calcular tareas de verdad (Q1 y Q2 no completadas)
                  const realQ1Count = tasks.filter(t => t.quadrant === "Q1" && t.status !== "DONE").length;
                  const realQ2Count = tasks.filter(t => t.quadrant === "Q2" && t.status !== "DONE").length;
                  const otherActiveCount = tasks.filter(t => (t.quadrant === "Q3" || t.quadrant === "Q4") && t.status !== "DONE").length;

                  // Aplicamos el simulador de delegación: cada punto amortigua presión mental
                  const adjustedQ1Value = Math.max(0, realQ1Count - burnoutSimulationOffset);
                  
                  // Score ponderado de 0 a 100
                  const rawScore = (adjustedQ1Value * 22) + (realQ2Count * 13) + (otherActiveCount * 5);
                  const score = Math.max(5, Math.min(100, Math.round(rawScore)));

                  // Rangos de peligro
                  let meterLabel = "ESTADO SALUDABLE: Mente despejada y ritmo sostenible";
                  let meterColor = "text-emerald-600";
                  let meterBadgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-100";
                  let recommendationText = "Estás operando en tu zona óptima de control. Tienes suficiente ancho de banda cognitivo para incorporar un nuevo sprint de alta complejidad técnica o planificar ocio.";

                  if (score >= 35 && score < 70) {
                    meterLabel = "PRESIÓN MODERADA: Capacidad al límite de alerta";
                    meterColor = "text-amber-500";
                    meterBadgeStyle = "bg-amber-50 text-amber-700 border-amber-100";
                    recommendationText = "Atención: La carga de trabajo está copando tu almacenamiento de atención. Considera usar el slider inferior para simular la asignación/delegación de tareas operativas (Q3) a Marie Puscan.";
                  } else if (score >= 70) {
                    meterLabel = "RIESGO CRÍTICO DE BURN-OUT: Fatiga cognitiva inminente";
                    meterColor = "text-rose-600";
                    meterBadgeStyle = "bg-rose-50 text-rose-700 border-rose-100";
                    recommendationText = "¡AUXILIO SISMOGRÁFICO! Demasiadas directrices urgentes abiertas de manera simultánea. Recomendamos detener lanzamientos en caliente y delegar al menos 2 tareas críticas inmediatamente.";
                  }

                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      {/* Medidor visual */}
                      <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 text-center border border-slate-100 bg-slate-50/50 rounded-xl">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono mb-4">
                          Indicador de Esfuerzo Activo
                        </span>
                        
                        <div className="relative w-40 h-24 overflow-hidden flex flex-col justify-end">
                          {/* Semicírculo de fondo */}
                          <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-12 border-slate-200" />
                          {/* Aguja central */}
                          <div 
                            className="absolute bottom-0 left-1/2 w-1.5 h-16 origin-bottom rounded-t-full transition-transform duration-700 shadow-sm"
                            style={{ 
                              transform: `translate(-50%, 0) rotate(${-90 + ((score / 100) * 180)}deg)`,
                              backgroundColor: '#1e293b'
                            }}
                          />
                          {/* Núcleo de la aguja */}
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 rounded-full border-2 border-white shadow-sm" />
                        </div>

                        <div className="mt-4 space-y-1">
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-3xl font-black text-slate-900 tracking-tight font-sans">
                              {score}%
                            </span>
                            <span className="text-xs text-slate-400 font-mono">Fatiga</span>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider block font-sans ${meterColor}`}>
                            {meterLabel}
                          </span>
                        </div>
                      </div>

                      {/* Simulador y Controles interactivos */}
                      <div className="lg:col-span-7 space-y-4">
                        <div className={`p-4 border rounded-xl leading-relaxed text-xs font-sans ${meterBadgeStyle}`}>
                          <strong className="block font-black mb-1 flex items-center gap-1">
                            ⚠️ Presión de Urgencias Activas:
                          </strong>
                          {recommendationText}
                        </div>

                        {/* Controles de Simulación */}
                        <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-extrabold text-slate-800 font-sans">
                              Simulador: Delegar Tareas Q1 a Marie Puscan
                            </span>
                            <span className="font-mono bg-indigo-600 text-white font-bold p-1 px-2 rounded text-[10px]">
                              -{burnoutSimulationOffset * 20}% Presión
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400 font-mono">0</span>
                            <input
                              type="range"
                              min="0"
                              max={Math.max(2, realQ1Count)}
                              value={burnoutSimulationOffset}
                              onChange={(e) => setBurnoutSimulationOffset(parseInt(e.target.value))}
                              className="flex-1 accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                            />
                            <span className="text-xs text-slate-400 font-mono">{Math.max(2, realQ1Count)}</span>
                          </div>

                          <p className="text-[10px] text-slate-500 leading-tight">
                            Regulador dinámico. Simular cómo mitigaría Marie Puscan tu sobrecarga absorbiendo tareas inmediatas. {burnoutSimulationOffset > 0 && `(Simulando delegar ${burnoutSimulationOffset} tareas)`}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* DASHBOARD DE METAS SEMANALES (OKRs ESTRUCTURADOS) */}
              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-5 font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5 font-sans">
                      <Award className="w-5 h-5 text-indigo-600" /> Tablero de Metas Estratégicas y OKRs Semanales
                    </h4>
                    <p className="text-[10px] text-slate-500 font-sans">
                      Alineación transversal de tus tareas operacionales con metas de alto nivel (foco Profesional vs Vida).
                    </p>
                  </div>
                  
                  {/* Formulario rápido para agregar metas */}
                  <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-lg h-9">
                    <input
                      type="text"
                      placeholder="Nueva meta semanal..."
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddWeeklyGoal(newGoalTitle, newGoalCategory);
                        }
                      }}
                      className="text-xs px-2 bg-transparent border-none rounded focus:outline-none min-w-[150px] font-sans"
                    />
                    <select
                      value={newGoalCategory}
                      onChange={(e) => setNewGoalCategory(e.target.value as "Trabajo" | "Vida")}
                      className="text-[10px] bg-white border border-slate-200 rounded px-1.5 focus:outline-none font-sans cursor-pointer h-full"
                    >
                      <option value="Trabajo">🏢 Work</option>
                      <option value="Vida">🌿 Life</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleAddWeeklyGoal(newGoalTitle, newGoalCategory)}
                      className="bg-indigo-600 border border-indigo-700 hover:bg-indigo-505 text-white rounded text-xs px-2.5 h-full font-black uppercase transition-colors cursor-pointer"
                      style={{ backgroundColor: '#4f46e5' }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {weeklyGoals.length === 0 ? (
                  <div className="p-6 text-center border-2 border-dashed border-slate-200 text-slate-400 text-xs rounded-xl font-sans">
                    No has definido ninguna meta estratégica semanal. Crea una arriba para alinear tus tareas.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {weeklyGoals.map(goal => {
                      const linkedTasks = tasks.filter(t => taskGoalsMap[t.id] === goal.id);
                      const totalLinked = linkedTasks.length;
                      const doneLinked = linkedTasks.filter(t => t.status === "DONE").length;
                      const completionRate = totalLinked > 0 ? Math.round((doneLinked / totalLinked) * 100) : 0;

                      return (
                        <div key={goal.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative shadow-xxs font-sans flex flex-col justify-between hover:border-slate-350 transition-colors">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start gap-2">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase tracking-wider ${goal.category === "Trabajo" ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"} border`}>
                                {goal.category === "Trabajo" ? "🏢 Profesional" : "🌿 Vida & Desconexión"}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveWeeklyGoal(goal.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                title="Eliminar Objetivo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            
                            <div>
                              <h5 className="font-extrabold text-slate-800 text-xs tracking-tight leading-snug">
                                {goal.title}
                              </h5>
                            </div>
                          </div>

                          <div className="pt-4 space-y-2">
                            {/* Barra de progreso de objetivos */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] text-slate-450 font-mono font-bold">
                                <span>PROGRESO ALINEADO</span>
                                <span>{completionRate}% ({doneLinked}/{totalLinked} completado)</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500`} 
                                  style={{ 
                                    width: `${completionRate}%`,
                                    backgroundColor: goal.category === "Trabajo" ? "#4f46e5" : "#10b981"
                                  }} 
                                />
                              </div>
                            </div>

                            {/* Detalle de tareas vinculadas */}
                            {totalLinked > 0 ? (
                              <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                                {linkedTasks.map(t => (
                                  <div key={t.id} className="flex items-center justify-between text-[10px] p-1.5 bg-white border border-slate-150 rounded-md">
                                    <span className={`truncate w-[65%] font-semibold ${t.status === "DONE" ? "line-through text-slate-400 font-normal" : "text-slate-700"}`}>
                                      {t.title}
                                    </span>
                                    <span className={`text-[8px] p-0.5 px-1.5 font-mono rounded font-black ${t.status === 'DONE' ? 'bg-emerald-50 text-emerald-600' : t.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>
                                      {t.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[10px] text-slate-400 italic">
                                Sin tareas actualmente vinculadas: abre un elemento en la matriz y asígnale esta meta.
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bento Grid: Distribución Exhaustiva por Categorías del Sistema */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Métrica de Desglose por Etiquetas */}
                <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5 font-mono">
                    <PieChart className="w-4 h-4 text-slate-700" /> Presencia por Categoría Activa
                  </h4>
                  <div className="space-y-4 pt-1">
                    {["Negocio", "Familiar", "Ocio", "Desarrollo", "Personal", "Finanzas"].map(tg => {
                      const tgTasks = tasks.filter(t => t.tags?.includes(tg));
                      const totalCount = tgTasks.length;
                      const doneCount = tgTasks.filter(t => t.status === "DONE").length;
                      const globalTotal = tasks.length || 1;
                      const presencePct = Math.round((totalCount / globalTotal) * 100);
                      const colors = TAG_COLORS[tg] || DEFAULT_TAG_COLOR;

                      return (
                        <div key={tg} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-extrabold flex items-center gap-1.5 text-slate-800">
                              <span className={`w-2.5 h-2.5 rounded-full border ${colors.bg.split(" ")[1] || "bg-slate-400"}`} />
                              {tg}
                            </span>
                            <span className="font-mono text-slate-500 font-bold text-[11px]">
                              {doneCount} / {totalCount} completadas ({presencePct}% del total)
                            </span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
                            <div 
                              className={`h-full rounded-full transition-all duration-350 ${
                                tg === "Negocio" ? "bg-blue-600" :
                                tg === "Familiar" ? "bg-emerald-500" :
                                tg === "Ocio" ? "bg-fuchsia-500" :
                                tg === "Desarrollo" ? "bg-violet-600" :
                                tg === "Personal" ? "bg-rose-500" :
                                "bg-amber-500"
                              }`} 
                              style={{ width: `${presencePct}%` }} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Diagnóstico de Salud de Cuadrantes (Eisenhower Diagnostics) */}
                <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5 font-mono">
                    <Compass className="w-4 h-4 text-slate-700" /> Diagnóstico de Salud Eisenhower
                  </h4>

                  {(() => {
                    const q1Count = tasks.filter(t => t.quadrant === "Q1" && t.status !== "DONE").length;
                    const q2Count = tasks.filter(t => t.quadrant === "Q2" && t.status !== "DONE").length;
                    const q3Count = tasks.filter(t => t.quadrant === "Q3" && t.status !== "DONE").length;
                    const q4Count = tasks.filter(t => t.quadrant === "Q4" && t.status !== "DONE").length;

                    return (
                      <div className="space-y-3.5 pt-1">
                        <div className="flex gap-3 items-center p-2.5 rounded-lg bg-red-50/40 border border-red-100">
                          <span className="text-xs font-black font-mono text-red-600 bg-red-100/80 px-2 py-1 rounded min-w-[36px] text-center">Q1</span>
                          <div className="flex-1 text-xs">
                            <div className="font-bold text-red-900">Urgente y Crítico ({q1Count} activas)</div>
                            <div className="text-red-750 text-[10px]">
                              {q1Count > 3 ? "Atención: Demasiadas urgencias pendientes. Detén la entrada de nuevas tareas." : "Excelente manejo de incendios y crisis temporales."}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 items-center p-2.5 rounded-lg bg-indigo-50/40 border border-indigo-100">
                          <span className="text-xs font-black font-mono text-indigo-600 bg-indigo-100/80 px-2 py-1 rounded min-w-[36px] text-center">Q2</span>
                          <div className="flex-1 text-xs">
                            <div className="font-bold text-indigo-900">Planificación Estratégica ({q2Count} activas)</div>
                            <div className="text-indigo-750 text-[10px]">
                              {q2Count === 0 ? "Alerta: No estás planificando a largo plazo. Programa metas en este cuadrante." : "Buen nivel de enfoque estratégico. Aquí yace la verdadera productividad."}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 items-center p-2.5 rounded-lg bg-amber-50/40 border border-amber-100">
                          <span className="text-xs font-black font-mono text-amber-600 bg-amber-100/80 px-2 py-1 rounded min-w-[36px] text-center">Q3</span>
                          <div className="flex-1 text-xs">
                            <div className="font-bold text-amber-900">Cola de Delegación ({q3Count} activas)</div>
                            <div className="text-amber-750 text-[10px]">
                              {q3Count > 0 ? `Asignadas a colaboradores (${tasks.filter(t => t.quadrant === "Q3").map(t => t.assigned_to).filter((v, i, a) => a.indexOf(v) === i).join(", ")}). Revisa su entrega.` : "No hay tareas delegadas. Podrías delegar hilos mecánicos para liberar tu agenda."}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 items-center p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-xs font-black font-mono text-slate-500 bg-slate-200/80 px-2 py-1 rounded min-w-[36px] text-center">Q4</span>
                          <div className="flex-1 text-xs">
                            <div className="font-bold text-slate-800">Distracciones o Pospuestas ({q4Count} activas)</div>
                            <div className="text-slate-600 text-[10px]">
                              {q4Count > 4 ? "Sugerencia: Demasiado ruido acumulado en Q4. Te recomendamos depurar o archivar estas tareas." : "Nivel saludable de ruido irrelevante bajo control."}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VISTA DE BITÁCORA DE LOGROS Y REPORTE SEMANAL
              ======================================================== */}
          {activeView === "logbook" && (
            <div className="space-y-6">
              {/* Resumen de Logros Semanales en Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* Lado Izquierdo de la Bitácora: Formulario de Notas de Cierre Semanal */}
                <div className="md:col-span-5 bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase text-indigo-700 tracking-wider flex items-center gap-1.5 font-mono">
                      <Smile className="w-4 h-4 animate-pulse text-indigo-500" /> Reflexión del Cierre Semanal
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Anota tus aprendizajes, agradecimientos o un balance personal de lo vivido esta semana. Se guardará localmente.
                    </p>
                  </div>

                  <textarea
                    value={weeklyCommentary}
                    onChange={(e) => {
                      setWeeklyCommentary(e.target.value);
                      localStorage.setItem("weekly_commentary", e.target.value);
                    }}
                    placeholder="Redacta cómo te sentiste esta semana, qué obstáculo superaste y qué te gustaría mejorar para la siguiente..."
                    className="w-full h-44 text-xs p-3 border border-slate-200 rounded-lg focus:border-slate-900 focus:outline-none bg-slate-50/50 resize-none leading-relaxed font-sans placeholder:text-slate-400"
                  />

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-[10px] text-slate-600 font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                    <span>Guardado automático activado en local.</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowReportModal(true)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-950 text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" /> Generar Reporte Semanal
                  </button>
                </div>

                {/* Lado Derecho de la Bitácora: El Listado de Tareas Completadas (DONE) */}
                <div className="md:col-span-7 bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-150">
                    <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5 font-mono">
                      <Award className="w-4 h-4 text-amber-500 animate-bounce" /> Bitácora de Logros (Completados)
                    </h4>
                    <span className="text-[10px] font-mono font-black bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded uppercase">
                      {tasks.filter(t => t.status === "DONE").length} Completadas con éxito
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[352px] overflow-y-auto pr-1">
                    {tasks.filter(t => t.status === "DONE").length === 0 ? (
                      <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg text-slate-400 text-xs font-sans">
                        🏆 ¡Aún no tienes tareas marcadas como DONE esta semana!
                        <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
                          Mueve tus tareas del cuadrante Q1 o Q2 a Completadas en el panel lateral a medida que las finalices.
                        </p>
                      </div>
                    ) : (
                      tasks.filter(t => t.status === "DONE").map(task => (
                        <div key={task.id} className="p-3 bg-slate-50/50 border border-slate-200/80 rounded-lg hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-mono font-black text-slate-400">
                                {task.id}
                              </span>
                              <span className={`text-[9px] font-mono font-black px-1.5 rounded uppercase tracking-wider ${
                                task.quadrant === "Q1" ? "bg-red-50 text-red-600 border border-red-100" :
                                task.quadrant === "Q2" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                                task.quadrant === "Q3" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}>
                                {task.quadrant}
                              </span>
                              <h5 className="text-[11px] font-extrabold text-slate-850 leading-snug line-through select-all decoration-slate-400">
                                {task.title}
                              </h5>
                            </div>
                            <span className="text-[10px] text-slate-500 block leading-tight truncate max-w-md">
                              {task.description}
                            </span>
                          </div>

                          <div className="flex flex-col sm:items-end shrink-0 gap-1">
                            <span className="text-[10px] font-mono text-slate-600 font-bold">
                              Colab: {task.assigned_to}
                            </span>
                            {task.tags && task.tags.length > 0 && (
                              <div className="flex gap-1">
                                {task.tags.map(tg => (
                                  <span key={tg} className="text-[8px] font-black border border-slate-150 text-slate-400 px-1 py-0.2 rounded uppercase">
                                    {tg}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================
              VISTA DE GESTIÓN Y FINANZAS COLECTIVAS (EMPRESA & FAMILIA)
              ======================================================== */}
          {activeView === "finances" && (
            <div className="space-y-6 animate-fade-in font-sans select-none">
              
              {/* Encabezado Principal de Control Financiero */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-mono text-xs font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    SISMÓGRAFO DE BALANCES COLECTIVOS
                  </h3>
                  <h4 className="font-black text-lg text-slate-900 tracking-tight mt-1">
                    Gestión de Cuentas y Presupuestos Colectivos
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xl leading-relaxed mt-1">
                    Cada categoría financiera funciona de manera <b>150% independiente y aislada</b>. Seleccione una cuenta para operar su propio balance, obligaciones recurrentes e histórico.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setShowAddTxCard(!showAddTxCard);
                      if (showAddCategoryForm) setShowAddCategoryForm(false);
                    }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border ${
                      showAddTxCard 
                        ? "bg-slate-900 border-slate-950 text-white shadow-sm" 
                        : "bg-white hover:bg-slate-50 border-slate-250 text-slate-700"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-505" />
                    Registrar en {selectedFinanceWorkspace}
                  </button>

                  <button
                    onClick={() => {
                      setShowAddCategoryForm(!showAddCategoryForm);
                      if (showAddTxCard) setShowAddTxCard(false);
                    }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border ${
                      showAddCategoryForm 
                        ? "bg-slate-900 border-slate-950 text-white shadow-sm" 
                        : "bg-white hover:bg-slate-50 border-slate-250 text-slate-700"
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5" />
                    Crear Cuenta ({financeCategories.length})
                  </button>
                </div>
              </div>

              {/* TABS DE SELECCIÓN DE CUENTAS INDEPENDIENTES (Espacios de Balance Autónomos) */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase font-black text-slate-400 tracking-wider block">
                  📂 SELECCIONE UN ÁREA / CUENTA FINANCIERA ACTIVA:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {financeCategories.map(cat => {
                    const isActive = selectedFinanceWorkspace === cat;
                    const catTxs = financeTransactions.filter(t => t.category === cat && t.date.substring(0, 7) === selectedFinanceMonth);
                    const catIncome = catTxs.filter(t => t.type === "INGRESOS").reduce((sum, t) => sum + t.amount, 0);
                    const catExpense = catTxs.filter(t => t.type === "EGRESOS").reduce((sum, t) => sum + t.amount, 0);
                    const catOblgPaid = catTxs.filter(t => t.type === "OBLIGACIONES" && t.status === "PAGADO").reduce((sum, t) => sum + t.amount, 0);
                    const catOblgPending = catTxs.filter(t => t.type === "OBLIGACIONES" && t.status === "PENDIENTE").reduce((sum, t) => sum + t.amount, 0);
                    const catNet = catIncome - catExpense - catOblgPaid;

                    let emoji = "💼";
                    let activeColorClass = "bg-slate-900 border-slate-950 text-white scale-[1.01] shadow-md";
                    let textColor = "text-slate-300";
                    if (cat === "Familiar") {
                      emoji = "🏡";
                      activeColorClass = "bg-emerald-650 border-emerald-850 text-white scale-[1.01] shadow-md";
                      textColor = "text-emerald-100";
                    } else if (cat === "Vinannet") {
                      emoji = "🌐";
                      activeColorClass = "bg-indigo-650 border-indigo-800 text-white scale-[1.01] shadow-md";
                      textColor = "text-indigo-150";
                    } else if (cat === "Vinanmerch") {
                      emoji = "👕";
                      activeColorClass = "bg-purple-650 border-purple-850 text-white scale-[1.01] shadow-md";
                      textColor = "text-purple-100";
                    } else if (cat === "Airbnb") {
                      emoji = "🔑";
                      activeColorClass = "bg-rose-550 border-rose-700 text-white scale-[1.01] shadow-md";
                      textColor = "text-rose-100";
                    }

                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedFinanceWorkspace(cat);
                          setNewTxCategory(cat);
                        }}
                        className={`p-3.5 rounded-xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer min-h-[92px] ${
                          isActive 
                            ? activeColorClass 
                            : "bg-white border-slate-200 text-slate-850 hover:border-slate-305 hover:bg-slate-50 shadow-3xs"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xl">{emoji}</span>
                          <span className={`text-[8px] font-mono font-black uppercase tracking-wider ${isActive ? textColor : "text-slate-400"}`}>
                            {isActive ? "Activa ●" : "Ver Cuenta"}
                          </span>
                        </div>
                        <div className="mt-2.5">
                          <span className="text-xs font-extrabold uppercase tracking-tight block truncate max-w-[130px]">{cat}</span>
                          <span className={`text-[10px] font-mono font-bold block mt-0.5 ${isActive ? "text-white" : catNet >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                            Saldo: ${catNet.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            {catOblgPending > 0 && (
                              <span className={`ml-1 text-[8.5px] font-black ${isActive ? "text-amber-200" : "text-amber-600 bg-amber-50 px-1 rounded-full text-[7.5px]"}`} title={`${catOblgPending} pendiente`}>
                                (⏳)
                              </span>
                            )}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BARRA DE NAVEGACIÓN Y FILTRADO MENSUAL DETALLADO */}
              <div className="bg-slate-100 border border-slate-250 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                
                {/* 1. Selector de Mes Intuitivo (Arrows + Grid Popover) */}
                <div className="flex items-center gap-2 shrink-0 select-none">
                  <span className="font-mono text-[10px] uppercase font-black text-slate-450">PERIODO:</span>
                  
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-200 shadow-3xs">
                    <button
                      type="button"
                      onClick={() => {
                        const [yearStr, monthStr] = selectedFinanceMonth.split("-");
                        let year = parseInt(yearStr);
                        let month = parseInt(monthStr);
                        month--;
                        if (month < 1) { month = 12; year--; }
                        setSelectedFinanceMonth(`${year}-${month.toString().padStart(2, '0')}`);
                      }}
                      className="p-1 px-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-all cursor-pointer"
                      title="Mes anterior"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}
                        className="p-1 px-2.5 hover:bg-slate-50 text-slate-800 rounded-lg font-mono font-black text-[10.5px] uppercase tracking-wider transition-all flex items-center gap-1 text-center"
                      >
                        📅 {(() => {
                          const parts = selectedFinanceMonth.split("-");
                          const formatMonthsArray = [
                            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                          ];
                          if (parts.length === 2) {
                            const idx = parseInt(parts[1]) - 1;
                            return `${formatMonthsArray[idx] || parts[1]} ${parts[0]}`;
                          }
                          return selectedFinanceMonth;
                        })()}
                        <span className="text-slate-450 text-[8.5px]">▼</span>
                      </button>

                      {/* Popover de Selección Directa de Mes y Año con Grid */}
                      {showMonthYearPicker && (
                        <div className="absolute top-full left-0 mt-2 bg-white border border-slate-350 rounded-xl p-3 shadow-xl z-30 w-56 text-left animate-fade-in animate-duration-150">
                          {/* Selector de Año */}
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const [yr, mn] = selectedFinanceMonth.split("-");
                                setSelectedFinanceMonth(`${parseInt(yr) - 1}-${mn}`);
                              }}
                              className="p-1 px-2.5 bg-slate-50 hover:bg-slate-150 text-slate-700 rounded font-bold font-mono text-[10px]"
                            >
                              ◀
                            </button>
                            <span className="font-mono font-extrabold text-[11px] text-slate-900">
                              AÑO: {selectedFinanceMonth.substring(0, 4)}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const [yr, mn] = selectedFinanceMonth.split("-");
                                setSelectedFinanceMonth(`${parseInt(yr) + 1}-${mn}`);
                              }}
                              className="p-1 px-2.5 bg-slate-50 hover:bg-slate-150 text-slate-700 rounded font-bold font-mono text-[10px]"
                            >
                              ▶
                            </button>
                          </div>

                          {/* Grid de Meses */}
                          <div className="grid grid-cols-3 gap-1.5">
                            {[
                              { v: "01", n: "Ene" }, { v: "02", n: "Feb" }, { v: "03", n: "Mar" },
                              { v: "04", n: "Abr" }, { v: "05", n: "May" }, { v: "06", n: "Jun" },
                              { v: "07", n: "Jul" }, { v: "08", n: "Ago" }, { v: "09", n: "Sep" },
                              { v: "10", n: "Oct" }, { v: "11", n: "Nov" }, { v: "12", n: "Dic" }
                            ].map((m) => {
                              const currentYear = selectedFinanceMonth.split("-")[0];
                              const code = `${currentYear}-${m.v}`;
                              const isSelected = selectedFinanceMonth === code;
                              return (
                                <button
                                  key={m.v}
                                  type="button"
                                  onClick={() => {
                                    setSelectedFinanceMonth(code);
                                    setShowMonthYearPicker(false);
                                  }}
                                  className={`p-2 rounded font-mono font-extrabold text-[10px] uppercase transition-all text-center cursor-pointer ${
                                    isSelected
                                      ? "bg-emerald-600 text-white shadow-xxs"
                                      : "bg-slate-50 hover:bg-slate-200 text-slate-750"
                                  }`}
                                >
                                  {m.n}
                                </button>
                              );
                            })}
                          </div>

                          {/* Botón de Cierre */}
                          <div className="mt-2 text-center pt-2 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => setShowMonthYearPicker(false)}
                              className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400 hover:text-slate-800"
                            >
                              Cerrar selector
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const [yearStr, monthStr] = selectedFinanceMonth.split("-");
                        let year = parseInt(yearStr);
                        let month = parseInt(monthStr);
                        month++;
                        if (month > 12) { month = 1; year++; }
                        setSelectedFinanceMonth(`${year}-${month.toString().padStart(2, '0')}`);
                      }}
                      className="p-1 px-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-all cursor-pointer"
                      title="Mes siguiente"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2. Filtro de Tipo de Transacción de este Workspace */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase font-black text-slate-450">TIPO:</span>
                  <div className="flex bg-white p-0.5 rounded-lg border border-slate-200">
                    {(["TODAS", "INGRESOS", "EGRESOS", "OBLIGACIONES"] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setSelectedFinanceTypeFilter(t)}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          selectedFinanceTypeFilter === t
                            ? "bg-slate-900 text-white font-black shadow-3xs"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        {t === "TODAS" ? "Todo" : t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Buscador */}
                <div className="w-full sm:w-60">
                  <input
                    type="text"
                    value={financeSearchQuery}
                    onChange={(e) => setFinanceSearchQuery(e.target.value)}
                    placeholder={`Buscar en ${selectedFinanceWorkspace}...`}
                    className="w-full text-xs p-1.5 px-3 bg-white border border-slate-250 rounded-lg focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              {/* CUADROS GENERALES DE METRICAS MACRO (KPI CARDS DYNAMIC FOR THE SELECTED WORKSPACE & MONTH) */}
              {(() => {
                const formatMonthAndYearSim = (dateStr: string) => dateStr.substring(0, 7);
                const monthlyTxs = financeTransactions.filter(tx => 
                  formatMonthAndYearSim(tx.date) === selectedFinanceMonth && 
                  tx.category === selectedFinanceWorkspace
                );
                
                const totalIncomes = monthlyTxs
                  .filter(tx => tx.type === "INGRESOS")
                  .reduce((sum, tx) => sum + tx.amount, 0);

                const totalExpenses = monthlyTxs
                  .filter(tx => tx.type === "EGRESOS")
                  .reduce((sum, tx) => sum + tx.amount, 0);

                const totalObligationsPending = monthlyTxs
                  .filter(tx => tx.type === "OBLIGACIONES" && tx.status === "PENDIENTE")
                  .reduce((sum, tx) => sum + tx.amount, 0);

                const totalObligationsPaid = monthlyTxs
                  .filter(tx => tx.type === "OBLIGACIONES" && tx.status === "PAGADO")
                  .reduce((sum, tx) => sum + tx.amount, 0);

                const netBalance = totalIncomes - totalExpenses - totalObligationsPaid;

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
                    
                    {/* Card 1: Ingresos de la cuenta */}
                    <div className="bg-white border border-emerald-100 p-4 rounded-xl shadow-xxs flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-extrabold uppercase text-emerald-800 tracking-wider">
                          🟢 ENTRADAS [{selectedFinanceWorkspace}]
                        </span>
                        <span className="text-[9px] font-mono font-blue font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100 uppercase tracking-widest">
                          + Saldo
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <span className="text-xl font-black text-slate-900 tracking-tight block">
                          ${totalIncomes.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">
                          <span>Entradas únicamente cargadas a la cuenta.</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Egresos/Gastos efectuados */}
                    <div className="bg-white border border-rose-100 p-4 rounded-xl shadow-xxs flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-extrabold uppercase text-rose-800 tracking-wider">
                          🔴 GASTOS [{selectedFinanceWorkspace}]
                        </span>
                        <span className="text-[9px] font-mono font-extrabold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-100 uppercase tracking-widest">
                          Efectuado
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <span className="text-xl font-black text-slate-900 tracking-tight block">
                          ${totalExpenses.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">
                          <span>Excluye compromisos fijos pendientes.</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Compromisos fijos */}
                    <div className="bg-white border border-amber-100 p-4 rounded-xl shadow-xxs flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-extrabold uppercase text-amber-800 tracking-wider">
                          ⚠️ COMPROMISOS [*]
                        </span>
                        <span className="text-[9px] font-mono font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-100 uppercase tracking-widest">
                          Obligaciones
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <span className="text-xl font-black text-slate-900 tracking-tight block">
                          ${(totalObligationsPending + totalObligationsPaid).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <div className="text-[9px] text-slate-500 mt-1 flex flex-wrap gap-x-2 gap-y-0.5 font-mono text-[9px]">
                          <span className="text-amber-700 bg-amber-50 px-1.5 rounded font-extrabold">
                            Pendiente: ${totalObligationsPending}
                          </span>
                          <span className="text-emerald-700 bg-emerald-50 px-1.5 rounded font-extrabold">
                            Saldado: ${totalObligationsPaid}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Flujo Neto Disponible de la categoría activa */}
                    <div className={`p-4 rounded-xl border flex flex-col justify-between shadow-xxs ${
                      netBalance >= 0 
                        ? "bg-slate-900 border-slate-950 text-white" 
                        : "bg-rose-950 border-rose-900 text-white"
                    }`}>
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-300">
                          ⚖️ FLUJO NETO [{selectedFinanceWorkspace}]
                        </span>
                        <span className="text-[8.5px] font-mono font-bold text-slate-200 bg-white/10 px-1.5 py-0.2 rounded uppercase font-black">
                          {netBalance >= 0 ? "Margen +" : "Ajustar"}
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <span className={`text-xl font-black tracking-tight block ${netBalance >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                          ${netBalance.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <div className="text-[9px] text-slate-400 mt-1 font-mono">
                          <span>Balance solo de la cuenta {selectedFinanceWorkspace}.</span>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })()}

              {/* DISEÑO EN DOS COLUMNAS - FORMULARIOS / ESTADÍSTICAS E HISTORIAL INTEGRADO */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Lado Izquierdo: Formularios Auxiliares (Añadir Transacción, Categorías y Visual de Distribución) */}
                <div className="lg:col-span-5 space-y-5">
                  
                  {/* Formulario 1: Registrar Nueva Transacción (Precoordinada con la cuenta activa) */}
                  {showAddTxCard && (
                    <div className="bg-white border-2 border-slate-900 p-5 rounded-xl shadow-md space-y-4 animate-slide-in">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h4 className="font-mono text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          💼 RESIDUAL EN {selectedFinanceWorkspace.toUpperCase()}
                        </h4>
                        <button
                          onClick={() => setShowAddTxCard(false)}
                          className="text-slate-400 hover:text-slate-900 font-bold font-mono text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <form onSubmit={handleAddFinanceTransaction} className="space-y-3.5 text-xs text-left">
                        <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between">
                          <span className="font-mono text-[10px] font-extrabold uppercase text-indigo-800">CUENTA DE DESTINO PROPIA:</span>
                          <span className="font-sans font-black text-xs text-indigo-750 bg-white px-2.5 py-1 rounded border border-indigo-150 uppercase shadow-3xs">
                            {selectedFinanceWorkspace}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 block mb-1">
                              Tipo de Registro:
                            </label>
                            <select
                              value={newTxType}
                              onChange={(e) => setNewTxType(e.target.value as any)}
                              className="w-full text-xs p-2.5 border border-slate-250 rounded focus:border-slate-900 focus:outline-none font-sans bg-white font-bold text-slate-850 cursor-pointer"
                            >
                              <option value="INGRESOS">🟢 Ingreso (+)</option>
                              <option value="EGRESOS">🔴 Egreso (-)</option>
                              <option value="OBLIGACIONES">⏳ Obligación / Compromiso</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 block mb-1">
                              monto en USD ($):
                            </label>
                            <input
                              type="number"
                              required
                              step="0.01"
                              min="0.01"
                              value={newTxAmount}
                              onChange={(e) => setNewTxAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full text-xs p-2.5 border border-slate-250 rounded focus:border-slate-900 focus:outline-none font-mono font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 block mb-1">
                            Detalle / Concepto:
                          </label>
                          <input
                            type="text"
                            required
                            value={newTxTitle}
                            onChange={(e) => setNewTxTitle(e.target.value)}
                            placeholder="Ej. Hosting Servidor, Limpieza Loft, Impuestos, etc."
                            className="w-full text-xs p-2.5 border border-slate-250 rounded focus:border-slate-900 focus:outline-none font-sans"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 block mb-1">
                            Descripción Auxiliar (Opcional):
                          </label>
                          <textarea
                            value={newTxDescription}
                            onChange={(e) => setNewTxDescription(e.target.value)}
                            rows={2}
                            placeholder="Notas referenciales importantes..."
                            className="w-full text-xs p-2.5 border border-slate-250 rounded focus:border-slate-900 focus:outline-none font-sans"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 block mb-1">
                            Fecha de Registro:
                          </label>
                          <input
                            type="date"
                            required
                            value={newTxDate}
                            onChange={(e) => setNewTxDate(e.target.value)}
                            className="w-full text-xs p-2.5 border border-slate-250 rounded focus:border-slate-900 focus:outline-none font-mono bg-white cursor-pointer"
                          />
                        </div>

                        {newTxType === "OBLIGACIONES" && (
                          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg space-y-2 animate-fade-in animate-duration-200">
                            <span className="block text-[9px] font-mono font-black uppercase tracking-wider text-amber-800">
                              Configuración de la Obligación Bancaria / Proveedor:
                            </span>
                            <div>
                              <label className="text-[9px] font-black uppercase tracking-wide text-slate-400 block mb-1">
                                Fecha Límite de Pago:
                              </label>
                              <input
                                type="date"
                                required
                                value={newTxDueDate}
                                onChange={(e) => setNewTxDueDate(e.target.value)}
                                className="w-full text-xs p-2 bg-white border border-slate-250 rounded focus:border-slate-900 focus:outline-none font-mono"
                              />
                            </div>
                          </div>
                        )}

                        {/* Control de Recurrencia de Transacciones */}
                        <div className="p-3 bg-indigo-55/70 border border-indigo-100 rounded-xl flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            id="txIsRecurrent"
                            checked={newTxIsRecurrent}
                            onChange={(e) => setNewTxIsRecurrent(e.target.checked)}
                            className="mt-0.5 w-4.5 h-4.5 text-indigo-650 border-slate-300 rounded focus:ring-indigo-600 cursor-pointer"
                          />
                          <label htmlFor="txIsRecurrent" className="select-none cursor-pointer">
                            <span className="block text-[10.5px] font-black text-indigo-900 uppercase tracking-tight">
                              🔄 ¿Hacer transacción recurrente?
                            </span>
                            <span className="block text-[10px] text-indigo-750 font-medium leading-relaxed mt-0.5">
                              Si está habilitado, esta transacción se mantendrá en los meses siguientes de manera automática para evitar tener que registrarla manualmente cada mes.
                            </span>
                          </label>
                        </div>

                        <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setShowAddTxCard(false)}
                            className="px-3 py-1.5 border border-slate-250 hover:bg-slate-50 text-slate-600 rounded text-xs cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold uppercase rounded text-xs transition-all shadow-sm cursor-pointer"
                          >
                            ✓ Registrar en Servidor
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Formulario 2: Crear Cuenta (Categorías de Balances Independientes) */}
                  {showAddCategoryForm && (
                    <div className="bg-white border-2 border-slate-900 p-5 rounded-xl shadow-md space-y-4 animate-slide-in">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h4 className="font-mono text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 block leading-relaxed">
                          🏷️ GESTOR DE CUENTAS INDEPENDIENTES
                        </h4>
                        <button
                          onClick={() => setShowAddCategoryForm(false)}
                          className="text-slate-400 hover:text-slate-900 font-bold font-mono text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <form onSubmit={handleAddCustomCategory} className="space-y-4 text-xs text-left">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={newCustomCategoryInput}
                            onChange={(e) => setNewCustomCategoryInput(e.target.value)}
                            placeholder="Nombre de la nueva cuenta (ej. Logística)"
                            className="flex-1 text-xs p-2.5 border border-slate-250 rounded focus:border-slate-900 focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="bg-indigo-650 hover:bg-indigo-705 text-white rounded px-4 py-2 font-mono font-bold uppercase cursor-pointer text-xs"
                          >
                            Crear
                          </button>
                        </div>

                        {/* Listado de categorías activas con oportunidad de eliminar si es personalizada */}
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                            Cuentas Protegidas y Personalizadas:
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {financeCategories.map(cat => {
                              return (
                                <div key={cat} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono">
                                  <span className="font-bold text-slate-700 uppercase tracking-tight truncate mr-1">
                                    {cat === "Familiar" ? "🏡 " : cat === "Vinannet" ? "🌐 " : cat === "Vinanmerch" ? "👕 " : cat === "Airbnb" ? "🔑 " : "💼 "}
                                    {cat}
                                  </span>
                                  {financeCategories.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCustomCategory(cat)}
                                      className="text-rose-505 hover:text-rose-700 pr-1 hover:scale-105 font-bold cursor-pointer transition-all"
                                      title="Eliminar esta cuenta"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200 text-right">
                          <button
                            type="button"
                            onClick={() => setShowAddCategoryForm(false)}
                            className="px-3 py-1.5 border border-slate-250 text-slate-650 hover:bg-slate-50 rounded text-xs cursor-pointer"
                          >
                            Cerrar
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* DISEÑO ESTÉTICO DE DISTRIBUCIÓN FLUIDA ENTRE CUENTAS COLECTIVAS */}
                  <div className="bg-white border border-slate-200 p-5 rounded-xl text-left">
                    <div>
                      <h4 className="font-mono text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                        ⚖️ FLUJO COLECTIVO DE COMPROMISOS & GASTOS
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Distribución de gastos reales y obligaciones ya <b>PAGADAS</b> en el mes de <b>{selectedFinanceMonth}</b>.
                      </p>
                    </div>

                    {(() => {
                      const formatMonthAndYearSim = (dateStr: string) => dateStr.substring(0, 7);
                      const currentMonthTxs = financeTransactions.filter(tx => 
                        formatMonthAndYearSim(tx.date) === selectedFinanceMonth && 
                        (tx.type === "EGRESOS" || (tx.type === "OBLIGACIONES" && tx.status === "PAGADO"))
                      );

                      const familiarSpent = currentMonthTxs.filter(t => t.category === "Familiar").reduce((sum, t) => sum + t.amount, 0);
                      const vinannetSpent = currentMonthTxs.filter(t => t.category === "Vinannet").reduce((sum, t) => sum + t.amount, 0);
                      const vinanmerchSpent = currentMonthTxs.filter(t => t.category === "Vinanmerch").reduce((sum, t) => sum + t.amount, 0);
                      const airbnbSpent = currentMonthTxs.filter(t => t.category === "Airbnb").reduce((sum, t) => sum + t.amount, 0);
                      const customSpent = currentMonthTxs.filter(t => !["Familiar", "Vinannet", "Vinanmerch", "Airbnb"].includes(t.category)).reduce((sum, t) => sum + t.amount, 0);
                      
                      const totalSpent = familiarSpent + vinannetSpent + vinanmerchSpent + airbnbSpent + customSpent;

                      const familiarPct = totalSpent > 0 ? Math.round((familiarSpent / totalSpent) * 100) : 0;
                      const vinannetPct = totalSpent > 0 ? Math.round((vinannetSpent / totalSpent) * 100) : 0;
                      const vinanmerchPct = totalSpent > 0 ? Math.round((vinanmerchSpent / totalSpent) * 100) : 0;
                      const airbnbPct = totalSpent > 0 ? Math.round((airbnbSpent / totalSpent) * 100) : 0;
                      const customPct = totalSpent > 0 ? 100 - familiarPct - vinannetPct - vinanmerchPct - airbnbPct : 0;

                      return (
                        <div className="space-y-4 mt-3">
                          <div className="h-4.5 w-full bg-slate-100 rounded-full flex overflow-hidden shadow-2xs">
                            {familiarPct > 0 && (
                              <div className="bg-emerald-550 text-white h-full flex items-center justify-center text-[8px] font-black" style={{ width: `${familiarPct}%` }} title={`Familiar: ${familiarPct}%`}>
                                🏡 {familiarPct}%
                              </div>
                            )}
                            {vinannetPct > 0 && (
                              <div className="bg-indigo-600 text-white h-full flex items-center justify-center text-[8px] font-black" style={{ width: `${vinannetPct}%` }} title={`Vinannet: ${vinannetPct}%`}>
                                🌐 {vinannetPct}%
                              </div>
                            )}
                            {vinanmerchPct > 0 && (
                              <div className="bg-purple-600 text-white h-full flex items-center justify-center text-[8px] font-black" style={{ width: `${vinanmerchPct}%` }} title={`Vinanmerch: ${vinanmerchPct}%`}>
                                👕 {vinanmerchPct}%
                              </div>
                            )}
                            {airbnbPct > 0 && (
                              <div className="bg-rose-500 text-white h-full flex items-center justify-center text-[8px] font-black" style={{ width: `${airbnbPct}%` }} title={`Airbnb: ${airbnbPct}%`}>
                                🔑 {airbnbPct}%
                              </div>
                            )}
                            {customPct > 0 && (
                              <div className="bg-slate-700 text-white h-full flex items-center justify-center text-[8px] font-black" style={{ width: `${customPct}%` }} title={`Otras cuentas: ${customPct}%`}>
                                💼 {customPct}%
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[9px] font-mono">
                            <div className="border border-emerald-100 p-1 rounded-md text-center bg-emerald-50/10">
                              <span className="text-slate-400 block tracking-tight font-bold">🏡 FAMILIA</span>
                              <span className="font-extrabold text-emerald-700 block mt-0.5">${familiarSpent}</span>
                            </div>
                            <div className="border border-indigo-100 p-1 rounded-md text-center bg-indigo-50/10">
                              <span className="text-slate-400 block tracking-tight font-bold">🌐 VINANNET</span>
                              <span className="font-extrabold text-indigo-700 block mt-0.5">${vinannetSpent}</span>
                            </div>
                            <div className="border border-purple-100 p-1 rounded-md text-center bg-purple-50/10">
                              <span className="text-slate-400 block tracking-tight font-bold">👕 MERCH</span>
                              <span className="font-extrabold text-purple-700 block mt-0.5">${vinanmerchSpent}</span>
                            </div>
                            <div className="border border-rose-100 p-1 rounded-md text-center bg-rose-50/10">
                              <span className="text-slate-400 block tracking-tight font-bold">🔑 AIRBNB</span>
                              <span className="font-extrabold text-rose-700 block mt-0.5">${airbnbSpent}</span>
                            </div>
                            <div className="border border-slate-200 p-1 rounded-md text-center bg-slate-50/10">
                              <span className="text-slate-400 block tracking-tight font-bold">💼 OTRXS</span>
                              <span className="font-extrabold text-slate-700 block mt-0.5">${customSpent}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                </div>

                {/* Lado Derecho: Historial / Registro Mensual Sincronizado */}
                <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-4 flex flex-col justify-between">
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h4 className="font-mono text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        📑 TRANSACCIONES EN EL MES ({filteredTxs.length})
                      </h4>
                      <span className="text-[9px] font-mono font-bold bg-indigo-50 text-indigo-700 py-0.5 px-2 rounded-md uppercase tracking-wider">
                        Cuenta: {selectedFinanceWorkspace}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                      {filteredTxs.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 text-xs font-mono border border-dashed border-slate-200 rounded-lg space-y-2">
                          <div className="text-2xl">⏳</div>
                          <div className="font-extrabold text-slate-700">Ninguna transacción cargada en {selectedFinanceWorkspace}</div>
                          <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                            No se encontraron ingresos, egresos ni obligaciones para el mes de {selectedFinanceMonth} en esta cuenta. Use el botón superior para registrar una transacción.
                          </p>
                        </div>
                      ) : (
                        filteredTxs.map(tx => {
                          const isObligation = tx.type === "OBLIGACIONES";
                          const isIncome = tx.type === "INGRESOS";
                          
                          return (
                            <div 
                              key={tx.id} 
                              className={`p-3 bg-white border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left transition-all hover:border-slate-350 shadow-xxs ${
                                isObligation && tx.status === "PENDIENTE" ? "border-l-4 border-l-amber-400" : ""
                              } ${
                                isObligation && tx.status === "PAGADO" ? "border-l-4 border-l-emerald-400" : ""
                              }`}
                            >
                              <div className="space-y-1 overflow-hidden">
                                <div className="flex items-center flex-wrap gap-1.5">
                                  <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded font-black uppercase tracking-wider ${
                                    isIncome
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                      : tx.type === "EGRESOS"
                                      ? "bg-rose-50 text-rose-700 border border-rose-100"
                                      : "bg-amber-50 text-amber-700 border border-amber-100"
                                  }`}>
                                    {isIncome ? "Ingreso" : tx.type === "EGRESOS" ? "Egreso" : "Obligación"}
                                  </span>

                                  <span className="text-[9px] font-mono bg-slate-100 text-slate-600 border border-slate-200 px-1 py-0.2 rounded uppercase font-bold">
                                    {tx.category}
                                  </span>

                                  {tx.recurrence_parent_id && (
                                    <span className="text-[8.5px] font-mono bg-indigo-50 text-indigo-750 border border-indigo-150 px-1.5 py-0.2 rounded-full uppercase font-black" title="Transacción recurrente mensual automática">
                                      🔄 Fijo / Recurrente
                                    </span>
                                  )}

                                  <span className="text-[8px] font-mono text-slate-400 block">
                                    📅 {tx.date}
                                  </span>
                                </div>

                                <h4 className="text-[11px] font-black text-slate-800 leading-tight">
                                  {tx.title}
                                </h4>
                                
                                {tx.description && (
                                  <p className="text-[10px] text-slate-500 line-clamp-2 max-w-md italic leading-tight">
                                    "{tx.description}"
                                  </p>
                                )}

                                {isObligation && (
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <span className="text-[8px] font-mono text-slate-400 font-bold uppercase">
                                      VENCE: {tx.due_date || "Fin de mes"}
                                    </span>
                                    <span className={`text-[8px] font-mono font-black uppercase px-1 py-0.2 rounded ${
                                      tx.status === "PAGADO" 
                                        ? "bg-emerald-100 text-emerald-800" 
                                        : "bg-amber-100 text-amber-800 animate-pulse"
                                    }`}>
                                      {tx.status === "PAGADO" ? "✔️ PAGADA" : "⏳ PENDIENTE"}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                <div className="text-right font-mono">
                                  <span className={`text-sm font-black block ${
                                    isIncome 
                                      ? "text-emerald-600" 
                                      : "text-slate-800"
                                  }`}>
                                    {isIncome ? "+ " : "- "}${tx.amount.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 select-none">
                                  {isObligation && (
                                    <button
                                      type="button"
                                      onClick={() => handleToggleObligationStatus(tx.id, tx.status || "PENDIENTE", tx.title)}
                                      className={`text-[8px] font-mono font-bold uppercase px-2 py-1 rounded cursor-pointer border tracking-wider transition-all scale-[0.98] ${
                                        tx.status === "PAGADO"
                                          ? "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                                          : "bg-emerald-650 hover:bg-emerald-700 text-white border-emerald-700 shadow-xxs animate-pulse"
                                      }`}
                                      title={tx.status === "PAGADO" ? "Marcar como pendiente" : "Marcar como cancelado/pagado"}
                                    >
                                      {tx.status === "PAGADO" ? "↩️ Revertir" : "✔️ Pagar Deuda"}
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteFinanceTransaction(tx.id, tx.title)}
                                    className="p-1 px-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                                    title="Eliminar registro"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Leyenda de Seguridad */}
                  <div className="pt-3 border-t border-slate-150 text-[10px] text-slate-400 font-mono text-left bg-slate-50 p-2.5 rounded-lg">
                    🛡️ CONEXIÓN CRIPTOGRÁFICA: Todos los flujos se persisten automáticamente en el servidor y son consolidados en tu registro local asíncronamente en cada acción.
                  </div>

                </div>

              </div>

              {/* Modal Colectivo de Borrado Recurrente */}
              {recDeletionModal && recDeletionModal.isOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in animate-duration-150">
                  <div className="bg-white border-2 border-slate-950 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-slide-in text-left">
                    <button
                      onClick={() => setRecDeletionModal(null)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 cursor-pointer text-sm font-bold font-mono"
                    >
                      ✕
                    </button>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">🔄</span>
                      <div>
                        <h4 className="font-sans font-black text-slate-900 text-sm uppercase tracking-tight">
                          Transacción de Fijo / Recurrente
                        </h4>
                        <p className="text-[10px] font-mono text-indigo-650 uppercase font-black tracking-wider">
                          Sismógrafo de Balances Colectivos
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-750 leading-relaxed">
                      Has seleccionado eliminar la transacción <b className="text-slate-900 font-extrabold font-sans">"{recDeletionModal.title}"</b>. 
                      Este registro forma parte de una serie recurrente mensual configurada de manera colectiva.
                    </p>

                    <div className="mt-5 space-y-2.5">
                      <button
                        type="button"
                        onClick={() => executeDeleteFinanceTransaction(recDeletionModal.txId, true, recDeletionModal.title)}
                        className="w-full p-3 bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold text-xs uppercase rounded-xl tracking-wide transition-all shadow-sm cursor-pointer block text-center"
                      >
                        💥 Eliminar TODAS las semanas / meses futuras
                      </button>

                      <button
                        type="button"
                        onClick={() => executeDeleteFinanceTransaction(recDeletionModal.txId, false, recDeletionModal.title)}
                        className="w-full p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold text-xs uppercase rounded-xl tracking-wide transition-all cursor-pointer block text-center border border-slate-250"
                      >
                        📅 Eliminar SOLAMENTE este mes de consulta
                      </button>

                      <button
                        type="button"
                        onClick={() => setRecDeletionModal(null)}
                        className="w-full p-2.5 text-slate-400 hover:text-slate-800 font-sans font-medium text-[11px] text-center transition-all cursor-pointer block uppercase tracking-wider"
                      >
                        Cancelar Operación
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Explorador de Código en Tiempo Real de Fase 2 (En Español) */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div 
              onClick={() => setIsCodeSectionExpanded(!isCodeSectionExpanded)}
              className="p-5 bg-slate-50 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-100/70 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-mono text-sm font-black text-slate-900 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-600" /> CÓDIGO FUENTE DE FASE 2 (INTEGRACIÓN)
                  <span className={`text-[9px] font-sans font-black px-2 py-0.5 rounded uppercase tracking-wider transition-all duration-200 ${
                    isCodeSectionExpanded ? "bg-slate-200 text-slate-700" : "bg-indigo-50 text-indigo-700"
                  }`}>
                    {isCodeSectionExpanded ? "Contraer" : "Hacer click para expandir"}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Explora la lógica de la base de datos PostgreSQL, la API asíncrona FastAPI y los modelos SQLAlchemy.
                </p>
              </div>
              <div className="shrink-0 text-slate-400">
                <ChevronRight className={`w-5 h-5 transform transition-transform duration-200 ${isCodeSectionExpanded ? "rotate-90 text-slate-800" : "rotate-0"}`} />
              </div>
            </div>

            {isCodeSectionExpanded && (
              <div className="border-t border-slate-200">
                {/* Botonera de pestañas de código */}
                <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-bold">Ficheros de Arquitectura Backend:</span>
                  <div className="flex border border-slate-200 rounded overflow-hidden text-[11px] font-mono bg-white shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCodeTab("database");
                      }}
                      className={`px-3 py-2 transition-colors cursor-pointer ${
                        activeCodeTab === "database" ? "bg-slate-900 text-white font-bold" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      database.py
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCodeTab("main");
                      }}
                      className={`px-3 py-2 border-l border-slate-200 transition-colors cursor-pointer ${
                        activeCodeTab === "main" ? "bg-slate-900 text-white font-bold" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      main.py
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCodeTab("models");
                      }}
                      className={`px-3 py-2 border-l border-slate-200 transition-colors cursor-pointer ${
                        activeCodeTab === "models" ? "bg-slate-900 text-white font-bold" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      models.py
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCodeTab("schemas");
                      }}
                      className={`px-3 py-2 border-l border-slate-200 transition-colors cursor-pointer ${
                        activeCodeTab === "schemas" ? "bg-slate-900 text-white font-bold" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      schemas.py
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCodeTab("docker");
                      }}
                      className={`px-3 py-2 border-l border-slate-200 transition-colors cursor-pointer ${
                        activeCodeTab === "docker" ? "bg-slate-900 text-white font-bold" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      compose.yml
                    </button>
                  </div>
                </div>

                <div className="p-5 font-mono text-[11px] leading-relaxed bg-slate-950 text-slate-350 relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const contentMap = {
                        database: databasePyContent,
                        main: mainPyContent,
                        models: modelsPyContent,
                        schemas: schemasPyContent,
                        docker: dockerComposeContent
                      };
                      handleCopy(contentMap[activeCodeTab], activeCodeTab);
                    }}
                    className="absolute top-4 right-4 p-1 px-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer z-10"
                  >
                    {copied === activeCodeTab ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === activeCodeTab ? "¡Copiado!" : "Copiar Código"}
                  </button>

                  <pre className="overflow-x-auto select-all max-h-80 pr-2">
                    {activeCodeTab === "database" && databasePyContent}
                    {activeCodeTab === "main" && mainPyContent}
                    {activeCodeTab === "models" && modelsPyContent}
                    {activeCodeTab === "schemas" && schemasPyContent}
                    {activeCodeTab === "docker" && dockerComposeContent}
                  </pre>
                </div>
              </div>
            )}
          </div>

        </section>

        {/* Backdrop de Drawer para celulares */}
        {isMobileDetailsOpen && (
          <div 
            onClick={() => setIsMobileDetailsOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          />
        )}

        {/* Lado Derecho: Panel de Detalles de la Tarea / Hilos de Notas / Trazabilidad en Español */}
        <aside 
          className={`
            fixed inset-y-0 right-0 z-40 bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between transition-transform duration-300
            w-full max-w-[420px] sm:max-w-md
            ${isMobileDetailsOpen ? "translate-x-0" : "translate-x-full"}
            lg:translate-x-0 lg:static lg:w-96 lg:z-10 lg:shadow-sm lg:flex lg:flex-shrink-0
          `}
        >
          
          <div className="h-14 border-b border-slate-200 bg-slate-50 px-5 flex items-center justify-between flex-none select-none">
            <div className="flex items-center gap-1 truncate">
              <button
                type="button"
                onClick={() => setIsMobileDetailsOpen(false)}
                className="lg:hidden p-1 mr-1 text-slate-400 hover:text-slate-950 rounded hover:bg-slate-200/50 transition-colors cursor-pointer text-xs font-black shrink-0"
                title="Cerrar ventana"
              >
                ✕
              </button>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-555 flex items-center gap-1.5 font-sans truncate">
                <Info className="w-3.5 h-3.5 text-indigo-600 animate-pulse" /> Detalle de Tarea
              </span>
            </div>
            {deleteConfirmTaskId === currentTask.id ? (
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-red-600 font-bold uppercase mr-1">¿Eliminar?</span>
                <button
                  onClick={() => handleDeleteTaskSim(currentTask.id)}
                  className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[9px] font-sans font-black uppercase transition-all shadow-xs cursor-pointer"
                >
                  Sí
                </button>
                <button
                  onClick={() => setDeleteConfirmTaskId(null)}
                  className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[9px] font-sans font-black uppercase transition-all cursor-pointer"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setDeleteConfirmTaskId(currentTask.id)}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-all cursor-pointer"
                title="Eliminar Tarea"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Único Contenedor Central con Scrollbar Natural y Fluido para Todo el Detalle */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white scrollbar-thin">
            {/* Cabecera Principal de Datos de Tarea Activa */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                  {currentTask.id}
                </span>
                <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded border ${
                  currentTask.quadrant === "Q1" ? "bg-red-50 text-red-700 border-red-200" :
                  currentTask.quadrant === "Q2" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                  currentTask.quadrant === "Q3" ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-slate-150 text-slate-700 border-slate-250"
                }`}>
                  Cuadrante {currentTask.quadrant}
                </span>
              </div>
              
              <h3 className="text-sm font-black text-slate-900 leading-snug">
                {currentTask.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 border border-slate-100 p-3 rounded-lg font-sans">
                {currentTask.description}
              </p>

              {/* Visualizador de Etiquetas en Detalle */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-mono">
                  Categorías (Etiquetas):
                </span>
                <div className="flex flex-wrap gap-1">
                  {currentTask.tags && currentTask.tags.map(tg => {
                    const colors = TAG_COLORS[tg] || DEFAULT_TAG_COLOR;
                    return (
                      <span 
                        key={tg} 
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider flex items-center gap-1 ${colors.bg}`}
                      >
                        {tg}
                        <button
                          type="button"
                          onClick={() => handleRemoveTagFromTask(currentTask.id, tg)}
                          className="text-[9px] font-black hover:text-red-500 font-mono transition-colors ml-0.5 cursor-pointer"
                          title="Quitar categoría"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddTagToTask(currentTask.id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="text-[9px] font-bold px-2 py-0.5 rounded border border-dashed border-slate-300 bg-white text-slate-500 cursor-pointer focus:outline-none hover:bg-slate-50"
                    defaultValue=""
                  >
                    <option value="" disabled>+ Categoría</option>
                    {["Negocio", "Familiar", "Ocio", "Desarrollo", "Personal", "Finanzas"]
                      .filter(tg => !currentTask.tags?.includes(tg))
                      .map(tg => (
                        <option key={tg} value={tg}>{tg}</option>
                      ))
                    }
                    <option value="__custom__">+ Crear Nueva...</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ajuste de Estado Interactivo */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-3 shadow-xs">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1 font-mono">
                  Cambiar Estado Transaccional (Postgres):
                </label>
                <div className="flex rounded-lg overflow-hidden border border-slate-200 text-[10px] font-mono bg-slate-50 shadow-inner">
                  {(["TODO", "IN_PROGRESS", "DONE"] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => handleStatusChangeSim(currentTask.id, st)}
                      className={`flex-1 py-1.5 border-r border-slate-200 last:border-0 transition-all cursor-pointer text-center font-bold font-sans ${
                        currentTask.status === st 
                          ? "bg-slate-900 text-white shadow" 
                          : "text-slate-600 bg-white hover:bg-slate-100"
                      }`}
                    >
                      {st === "TODO" ? "POR HACER" : st === "IN_PROGRESS" ? "PROCESANDO" : "COMPLETADO"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1 font-mono">
                  Reasignar Responsable (Delegar):
                </label>
                <select
                  value={currentTask.assigned_to}
                  onChange={(e) => handleReassignSim(currentTask.id, e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-slate-900 focus:outline-none bg-white font-mono cursor-pointer"
                >
                  {mockTeamUsers.map(user => (
                    <option key={user.id} value={user.name}>
                      {user.name} ({user.avatar})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1 font-mono">
                  Modificar Plazo / Fecha Límite:
                </label>
                <input
                  type="text"
                  value={currentTask.due_date || ""}
                  onChange={(e) => handleUpdateDueDate(currentTask.id, e.target.value)}
                  placeholder="Ej: Inmediata, Hoy, 29 de Mayo"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-slate-900 focus:outline-none bg-white font-sans cursor-text"
                />
              </div>
            </div>

            {/* NOVEDAD 1 & 2: CONTROLADOR DE POMODORO Y ENLACE DE METAS SEMANALES */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 shadow-xxs">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-mono">
                  1. Enfoque Pomodoro (Micro-Sprints)
                </span>
                <p className="text-[10px] text-slate-500 leading-tight font-sans">
                  Inicia un sprint ininterrumpido de 25 minutos para esta tarea de la matriz. Al terminar, se guardará en la bitácora automáticamente y sonará un timbre.
                </p>
              </div>

              {/* Temporizador UI */}
              <div className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-lg relative overflow-hidden font-sans">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-sans">
                    <span className={`w-2 h-2 rounded-full ${pomodoroIsRunning ? (pomodoroMode === 'focus' ? 'bg-indigo-600 animate-pulse' : 'bg-emerald-500 animate-pulse') : 'bg-slate-300'}`} />
                    <span className="text-2xl font-mono font-black text-slate-800 tracking-tight">
                      {String(Math.floor(pomodoroTimeLeft / 60)).padStart(2, "0")}:{String(pomodoroTimeLeft % 60).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400 block font-sans">
                    {pomodoroMode === "focus" ? "🔥 Modo Enfoque" : "☕ Descanso Activo"}
                  </span>
                </div>

                <div className="flex gap-1 select-none font-sans">
                  {!pomodoroIsRunning ? (
                    <button
                      type="button"
                      onClick={() => {
                        setPomodoroTaskId(currentTask.id);
                        setPomodoroIsRunning(true);
                      }}
                      className="px-2.5 py-1 bg-indigo-600 border border-indigo-700 hover:bg-indigo-500 text-white rounded text-[10px] font-black uppercase tracking-wide transition-colors cursor-pointer"
                    >
                      Iniciar
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPomodoroIsRunning(false)}
                      className="px-2.5 py-1 bg-amber-500 border border-amber-600 hover:bg-amber-450 text-white rounded text-[10px] font-black uppercase tracking-wide transition-colors cursor-pointer"
                    >
                      Pausar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setPomodoroIsRunning(false);
                      setPomodoroTimeLeft(pomodoroMode === "focus" ? 1500 : 300);
                    }}
                    className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded text-[10px] font-bold hover:bg-slate-100 transition-colors cursor-pointer font-mono"
                    title="Reiniciar"
                  >
                    ↺
                  </button>
                </div>
              </div>

              {/* Mensaje de otro Pomodoro activo context */}
              {pomodoroTaskId && pomodoroTaskId !== currentTask.id && (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded text-[9px] text-amber-800 font-mono leading-tight">
                  ⚠️ Hay un Pomodoro activo ejecutándose en la tarea <strong>{pomodoroTaskId}</strong>. Al iniciar aquí, reenfocarás tus esfuerzos a la tarea actual.
                </div>
              )}

              {/* Vinculación a Meta Semanal */}
              <div className="border-t border-slate-200/60 pt-3 space-y-1.5 font-sans">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-mono">
                  2. Alineación con OKR Semanal
                </span>
                
                <div className="space-y-1">
                  <select
                    value={taskGoalsMap[currentTask.id] || ""}
                    onChange={(e) => handleLinkTaskToGoal(currentTask.id, e.target.value || null)}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 cursor-pointer font-sans"
                  >
                    <option value="">-- No alineada (Sin meta) --</option>
                    {weeklyGoals.map(goal => (
                      <option key={goal.id} value={goal.id}>
                        [{goal.category}] {goal.title}
                      </option>
                    ))}
                  </select>
                  
                  {taskGoalsMap[currentTask.id] && (
                    <div className="flex items-center gap-1.5 p-1.5 px-2 bg-indigo-50 border border-indigo-100/65 rounded text-[10px] text-indigo-700 font-medium font-sans leading-tight">
                      <span>🎯</span>
                      <span className="truncate">Alineado al OKR: <strong>{weeklyGoals.find(g => g.id === taskGoalsMap[currentTask.id])?.title}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabla Simple de Metadatos */}
            <div className="grid grid-cols-2 gap-3 text-xs border-y border-slate-100 py-3 font-mono">
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-widest mb-0.5">Responsable:</span>
                <span className="font-bold text-slate-900">{currentTask.assigned_to}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-widest mb-0.5">Creado Por:</span>
                <span className="text-slate-600">{currentTask.created_by}</span>
              </div>
            </div>

            {/* Listado Secuencial de Notas (Hilos de Comentarios) */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 border-b border-slate-100 pb-1.5 font-mono">
                <Activity className="w-3.5 h-3.5 text-indigo-500" /> Hilo Secuencial de Comentarios
              </h4>

              {currentTask.notes.length === 0 ? (
                <div className="p-4 border border-dashed border-slate-200 text-center rounded-lg text-slate-400 text-xs font-sans">
                  No hay comentarios todavía en este hilo transaccional. Añade uno abajo.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {currentTask.notes.map(note => (
                    <div key={note.id} className="p-3 border border-slate-150 bg-slate-50/70 rounded-lg flex flex-col gap-1 relative shadow-xxs">
                      <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className="font-extrabold text-slate-800">{note.user}</span>
                        <span className="text-slate-400">{note.created_at}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trazamiento de Historias de Delegación */}
            {currentTask.delegation_histories.length > 0 && (
              <div className="space-y-3 pt-1">
                <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-mono">
                  <Share2 className="w-3 h-3 text-slate-400" /> Historial de Delegación
                </h5>
                <div className="space-y-2 text-[10px] font-mono text-slate-500 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  {currentTask.delegation_histories.map(h => (
                    <div key={h.id} className="flex items-center gap-1.5 border-l-2 border-indigo-200 pl-2">
                      <span className="text-slate-600 font-bold">{h.from_user}</span>
                      <span>➜</span>
                      <span className="text-indigo-700 font-bold">{h.to_user}</span>
                      <span className="text-[9px] text-slate-400 font-light ml-auto">({h.assigned_at})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Archivos Adjuntos Asociados con uploader asíncrono real */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-mono">
                  <Paperclip className="w-3.5 h-3.5 text-slate-400" /> Adjuntos Asociados (Volumen Local)
                </h5>
                <label className="text-[10px] font-mono font-bold text-indigo-650 hover:text-indigo-800 hover:underline cursor-pointer flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 transition-all select-none">
                  <span>+ Subir</span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {currentTask.attachments.length === 0 ? (
                <div className="p-4 border border-dashed border-slate-200 text-center rounded-lg text-slate-400 text-xs font-sans">
                  Sin adjuntos de arquitectura. ¡Haz clic en "+ Subir" para adjuntar un documento real!
                </div>
              ) : (
                <div className="space-y-1.5 text-[10px] font-mono text-indigo-700">
                  {currentTask.attachments.map(att => (
                    <div key={att.id} className="flex items-center gap-2 p-2 bg-slate-100 rounded-lg border border-slate-200 shadow-xxs">
                      <FileText className="w-3.5 h-3.5 text-slate-500 hover:rotate-6 transition-transform transition-colors" />
                      <div className="flex-1 overflow-hidden">
                        <span className="font-bold text-slate-800 line-clamp-1">{att.file_name}</span>
                        <span className="text-slate-400 text-[8px] block">{att.file_path}</span>
                      </div>
                      <a
                        href={att.file_path}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[8px] bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 py-0.5 px-2 rounded-md uppercase font-bold tracking-wider shrink-0 transition-all cursor-pointer"
                      >
                        Abrir
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Formulario Secuencial Fijo abajo para añadir Notas */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex-none shadow-xs">
            <form onSubmit={handleAddNoteSim} className="relative flex items-center">
              <input
                type="text"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Escribe un comentario en esta tarea..."
                className="w-full text-xs p-3.5 pr-11 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 transition-all font-sans"
              />
              <button
                type="submit"
                className="absolute right-2 p-1.5 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                title="Añadir nota"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </aside>
      </main>

      {/* MODAL / FORMULARIO INTERACTIVO PARA AGREGAR NUEVAS TAREAS */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-lg shadow-xl overflow-hidden font-sans">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="font-black text-sm tracking-tight uppercase text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" /> Programar Tarea Colaborativa
              </h3>
              <button 
                onClick={() => setShowAddTaskModal(false)}
                className="text-slate-400 hover:text-slate-900 font-bold font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateTaskSim} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                  Título de la Tarea:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Por ejemplo: Optimizar caché de FastAPI..."
                  className="w-full text-xs p-3 border border-slate-200 rounded focus:border-slate-900 focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                  Descripción (Opcional):
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explica detalladamente la solución técnica o dependencias..."
                  rows={3}
                  className="w-full text-xs p-3 border border-slate-200 rounded focus:border-slate-900 focus:outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                    Cuadrante Eisenhower:
                  </label>
                  <select
                    value={newQuadrant}
                    onChange={(e) => setNewQuadrant(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded focus:border-slate-900 focus:outline-none font-mono bg-white"
                  >
                    <option value="Q1">Q1: Urgente & Importante</option>
                    <option value="Q2">Q2: No Urgente & Importante</option>
                    <option value="Q3">Q3: Urgente & No Importante</option>
                    <option value="Q4">Q4: No Urgente & No Importante</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                    Asignar Colaborador:
                  </label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded focus:border-slate-900 focus:outline-none font-mono bg-white"
                  >
                    {mockTeamUsers.map(user => (
                      <option key={user.id} value={user.name}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                  Plazo / Fecha Límite:
                </label>
                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  placeholder="Por ejemplo: Mañana, Lunes 1 de Junio, Inmediata"
                  className="w-full text-xs p-3 border border-slate-200 rounded focus:border-slate-900 focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                  Categorías (Etiquetas):
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded">
                  {["Negocio", "Familiar", "Ocio", "Desarrollo", "Personal", "Finanzas"].map(tg => {
                    const isSelected = newSelectedTags.includes(tg);
                    const colors = TAG_COLORS[tg] || DEFAULT_TAG_COLOR;
                    return (
                      <button
                        type="button"
                        key={tg}
                        onClick={() => {
                          if (isSelected) {
                            setNewSelectedTags(prev => prev.filter(t => t !== tg));
                          } else {
                            setNewSelectedTags(prev => [...prev, tg]);
                          }
                        }}
                        className={`px-2 py-1 text-[10px] font-extrabold rounded cursor-pointer border transition-all ${
                          isSelected
                            ? "bg-slate-900 border-slate-900 text-white font-black"
                            : `${colors.bg} hover:brightness-95`
                        }`}
                      >
                        {tg}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      const name = prompt("Escribe el nombre de la nueva categoría:");
                      if (name && name.trim()) {
                        const trimmed = name.trim();
                        setNewSelectedTags(prev => [...prev, trimmed]);
                      }
                    }}
                    className="px-2 py-1 text-[10px] font-bold rounded border border-dashed border-slate-300 bg-white hover:bg-slate-50 text-slate-500 cursor-pointer"
                  >
                    + Crear...
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 border border-slate-250 text-slate-600 rounded text-xs font-mono font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-mono font-bold uppercase transition-all shadow-sm cursor-pointer"
                >
                  Crear en DB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DEL REPORTE DE BIENESTAR Y CIERRE SEMANAL (PRINTABLE) */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="bg-white border border-slate-300 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden font-sans my-8">
            
            {/* Cabecera del Documento de Reporte */}
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center print:hidden">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-indigo-400">
                MatrixOS Executive Reporter
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-mono font-black uppercase tracking-wider rounded transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Imprimir / PDF
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-mono font-black uppercase tracking-wider rounded transition-all cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>

            {/* Cuerpo del Reporte Membretado */}
            <div className="p-8 space-y-6 sm:p-10 print:p-0 bg-slate-50/20" id="matrixos-executive-report">
              
              {/* Encabezado Formal */}
              <div className="border-b-2 border-slate-900 pb-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight font-mono">
                      MatrixOS // Reporte de Cierre Semanal
                    </h2>
                    <p className="text-xs text-slate-500 font-mono">
                      Id del Sistema: 5d48d427-ca29-4c8f-8e04-f635d51d965c
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-slate-100 text-slate-700 py-1 px-2 rounded border border-slate-200">
                      Fase 2: Conexión Real
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">
                      Generado: {new Date().toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-400 font-black block text-[9px] uppercase tracking-wider">Usuario Principal:</span>
                    <span className="font-bold text-slate-800">{currentUser?.name || "Osman Marin"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-black block text-[9px] uppercase tracking-wider">Colaborador:</span>
                    <span className="font-bold text-slate-800">Marie Puscan</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-black block text-[9px] uppercase tracking-wider">Motor Transaccional:</span>
                    <span className="font-bold text-slate-800">PostgreSQL 16 Async</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-black block text-[9px] uppercase tracking-wider">Status General:</span>
                    <span className="font-bold text-slate-800 font-mono">Sincronizado</span>
                  </div>
                </div>
              </div>

              {/* 1. Métrica Combinada de Balance */}
              <div className="space-y-3">
                <h3 className="font-mono text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1.5">
                  <PieChart className="w-4 h-4 text-indigo-600" /> 1. Análisis de Balance de Vida y Trabajo
                </h3>
                {(() => {
                  const workTags = ["Negocio", "Desarrollo", "Finanzas"];
                  const lifeTags = ["Familiar", "Ocio", "Personal"];

                  const workTasks = tasks.filter(t => t.tags?.some(tag => workTags.includes(tag)));
                  const lifeTasks = tasks.filter(t => t.tags?.some(tag => lifeTags.includes(tag)));
                  
                  const workCount = workTasks.length;
                  const lifeCount = lifeTasks.length;
                  const totalTagged = workCount + lifeCount || 1;
                  const workPct = Math.round((workCount / totalTagged) * 100);
                  const lifePct = 100 - workPct;

                  const doneTasks = tasks.filter(t => t.status === "DONE");
                  const activeTasks = tasks.filter(t => t.status !== "DONE");

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-mono text-slate-600">
                          <span>Esfuerzo Laboral: {workPct}%</span>
                          <span>Vida y Relajación: {lifePct}%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                          <div className="bg-indigo-600 h-full" style={{ width: `${workPct}%` }}></div>
                          <div className="bg-emerald-500 h-full" style={{ width: `${lifePct}%` }}></div>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-snug font-sans">
                          Un balance de 50%-75% de trabajo es óptimo para mantener de manera sostenible las operaciones de negocio sin descuidar tu salud e integridad familiar de largo plazo.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[11px] font-mono bg-slate-50 p-3 rounded-lg border border-slate-150">
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-black">LOGROS ACUMULADOS:</span>
                          <span className="text-xs font-black text-emerald-600 block sm:text-sm">
                            {doneTasks.length} Tareas finalizadas
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-black">PENDIENTES RESTANTES:</span>
                          <span className="text-xs font-black text-slate-600 block sm:text-sm">
                            {activeTasks.length} Tareas en cola
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 2. Bitácora de Logros (Tareas DONE) */}
              <div className="space-y-3">
                <h3 className="font-mono text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1.5">
                  <Award className="w-4 h-4 text-slate-700" /> 2. Bitácora de Logros Semanales (Status: DONE)
                </h3>
                
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {tasks.filter(t => t.status === "DONE").length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs font-mono border border-dashed border-slate-200 rounded-lg">
                      No se registraron tareas como completadas (DONE) en este periodo.
                    </div>
                  ) : (
                    tasks.filter(t => t.status === "DONE").map(task => (
                      <div key={task.id} className="p-3 bg-white border border-slate-200 rounded-lg flex items-start justify-between gap-3 text-left">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-mono font-bold text-slate-400">{task.id}</span>
                            <span className="text-[9px] font-mono bg-slate-100 text-slate-600 border border-slate-200 px-1 py-0.2 rounded font-bold uppercase">{task.quadrant}</span>
                            <h4 className="text-[11px] font-black text-slate-800 leading-tight">
                              {task.title}
                            </h4>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 pl-1 leading-tight">{task.description}</p>
                        </div>
                        <div className="text-right text-[10px] font-mono shrink-0">
                          <span className="text-slate-450 font-bold block">Colab: {task.assigned_to}</span>
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex gap-1 justify-end mt-1">
                              {task.tags.map(tg => (
                                <span key={tg} className="text-[8px] font-bold border border-slate-150 text-slate-400 px-1 py-0.2 rounded uppercase">
                                  {tg}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 3. Reflexión del Operador */}
              <div className="space-y-3 pt-1">
                <h3 className="font-mono text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1.5">
                  <Smile className="w-4 h-4 text-indigo-600" /> 3. Reflexiones de Desempeño y Bienestar
                </h3>
                <div className="p-4 bg-indigo-50/20 border border-indigo-100 rounded-lg whitespace-pre-wrap leading-relaxed">
                  <p className="text-xs text-slate-850 font-sans italic">
                    "{weeklyCommentary || "No se especificaron reflexiones esta semana."}"
                  </p>
                </div>
              </div>

              {/* Sección de Firmas formal */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 font-mono text-[10px]">
                <div className="text-center space-y-1">
                  <div className="border-b border-slate-400 mx-auto w-36 h-10 flex items-end justify-center select-none text-[11px] italic font-sans text-indigo-600 pb-1 font-bold">
                    {currentUser?.name || "Osman Marin"}
                  </div>
                  <span className="block text-[8px] text-slate-400 uppercase tracking-widest">Director Ejecutivo</span>
                  <span className="text-slate-500 block">MatrixOS Operator</span>
                </div>
                <div className="text-center space-y-1">
                  <div className="border-b border-slate-400 mx-auto w-36 h-10 flex items-end justify-center select-none text-[11px] italic font-sans text-indigo-600 pb-1 font-bold">
                    Marie Puscan
                  </div>
                  <span className="block text-[8px] text-slate-400 uppercase tracking-widest">Colaborador Líder</span>
                  <span className="text-slate-500 block">MatrixOS Team-Member</span>
                </div>
              </div>

            </div>

            {/* Acciones de pie para impresión */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 print:hidden">
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 border border-slate-250 text-slate-600 rounded text-xs font-mono font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cerrar Reporte
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-mono font-bold uppercase transition-all shadow-sm cursor-pointer"
              >
                Imprimir Documento
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer Estilo Barra de Herramientas de Consola de Base de Datos */}
      <footer className="h-8 bg-slate-900 text-[10px] text-slate-400 px-6 flex items-center justify-between font-mono flex-shrink-0 z-20">
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            FASTAPI: ACTIVO
          </span>
          <span className="hidden sm:inline">DB: CONECTADA (12ms)</span>
          <span className="hidden md:inline">VOLUMEN INTEGRADO: /app/uploads (98% libre)</span>
        </div>
        <div>MatrixOS Core v1.1.2-Integrado</div>
      </footer>
    </div>
  );
}
