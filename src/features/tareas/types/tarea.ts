import type { Adjunto } from "./adjuntos";
import type { Comentario } from "./comentarios";

export type Estado = "pendiente" | "en_curso" | "terminada" | "bloqueada";
export type Prioridad = "baja" | "media" | "alta";

export type Tarea = {
  id: number;
  titulo: string;
  descripcion: string | null;
  estado: Estado;
  prioridad: Prioridad;
  fecha_limite: string | null;
  adjuntos?: Adjunto[];
  comentarios?: Comentario[];
};

export type CrearTareaPayload = {
  titulo: string;
  descripcion?: string | null;
  estado?: Estado;
  prioridad?: Prioridad;
  fecha_limite?: string | null;
};
export type ActualizarTareaPayload = {
  titulo?: string;
  descripcion?: string | null;
  estado?: Estado;
  prioridad?: Prioridad;
  fecha_limite?: string | null;
};

export type MensajeResult = {
  tipo: "exito" | "error" | "info";
  mensaje: string;
};
