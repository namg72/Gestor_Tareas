export type CrearAdjuntoPayload = {
  tarea_id: number;
  nombre_original: string;
  ruta_archivo: string;
  tipo_mime: string;
  tamano_bytes: number;
};

export type Adjunto = {
  id: number;
  tarea_id: number;
  nombre_original: string;
  tipo_mime: string;
  tamano_bytes: number;
  creado_en: string;
  url: string;
};
