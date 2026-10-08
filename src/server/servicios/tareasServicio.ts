import type { CrearTareaPayload } from "@/features/tareas/types/tarea";
import { Tarea } from "../modelos/Tarea";
import {
  agregarTarea,
  obtenerTareas,
} from "../repositorios/tareasRepositorio";

export const listarTareas = async () => {
  const tareas: Tarea[] = await obtenerTareas();

  return tareas;
};

export const crearTarea = async (payload: CrearTareaPayload): Promise<Tarea> => {
  const tareaCreada = await agregarTarea(payload);

  return tareaCreada;
};
