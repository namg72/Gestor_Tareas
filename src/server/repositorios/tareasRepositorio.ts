import type { CrearTareaPayload } from "@/features/tareas/types/tarea";
import { Tarea } from "../modelos/Tarea";

export const obtenerTareas = async (): Promise<Tarea[]> => {
  return await Tarea.findAll();
};

export const agregarTarea = async (
  payload: CrearTareaPayload,
): Promise<Tarea> => {
  const tareaCreada = await Tarea.create(payload);

  return tareaCreada;
};
