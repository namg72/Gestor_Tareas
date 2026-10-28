export type CrearComentarioPayload = {
  tarea_id: number;
  contenido: string;
};

export type Comentario = {
  id: number;
  tarea_id: number;
  contenido: string;
  creado_en: string;
  actualizado_en: string | null;
};
