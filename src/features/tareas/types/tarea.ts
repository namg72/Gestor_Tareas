export type Estado = "pendiente" | "en_curso" | "terminada";
export type Prioridad = "baja" | "media" | "alta";

export type Tarea = {
  id: number;
  titulo: string;
  descripcion: string | null;
  estado: Estado;
  prioridad: Prioridad;
  fecha_limite: string | null;
};

export type CrearTareaPayload = {
  titulo: string;
  descripcion?: string | null;
  estado?: Estado;
  prioridad?: Prioridad;
  fecha_limite?: string | null;
};

export type CrearAdjuntoPayload = {
  tarea_id: number;
  nombre_original: string;
  ruta_archivo: string;
  tipo_mime: string;
  tamano_bytes: number;
};
