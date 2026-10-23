import { rm } from "node:fs/promises";
import { join } from "node:path";
import type {
  ActualizarTareaPayload,
  CrearTareaPayload,
} from "@/features/tareas/types/tarea";
import { Tarea } from "../modelos";
import {
  actualizarTareaPorId,
  agregarTarea,
  eliminarTareaPorId,
  obtenerTareas,
  obtenerTareasbyId,
} from "../repositorios/tareasRepositorio";

export const listarTareas = async () => {
  const tareas: Tarea[] = await obtenerTareas();

  return tareas;
};

export const getTareasbyId = async (id: number) => {
  return await obtenerTareasbyId(id);
};

export const crearTarea = async (
  payload: CrearTareaPayload,
): Promise<Tarea> => {
  const tareaCreada = await agregarTarea(payload);

  return tareaCreada;
};

export const eliminarTarea = async (id: number): Promise<void> => {
  await eliminarTareaPorId(id);

  const rutaAdjuntos = join(process.cwd(), "storage", "adjuntos", String(id));

  await rm(rutaAdjuntos, {
    recursive: true,
    force: true,
  });
};

export const actualizarTarea = async (
  id: number,
  payload: ActualizarTareaPayload,
): Promise<Tarea | null> => {
  const tareaActualizada = await actualizarTareaPorId(id, payload);

  return tareaActualizada;
};
