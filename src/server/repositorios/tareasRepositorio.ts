import type { CrearTareaPayload } from "@/features/tareas/types/tarea";
import { Adjunto, Tarea } from "../modelos";

export const obtenerTareas = async (): Promise<Tarea[]> => {
  return await Tarea.findAll();
};
export const obtenerTareasbyId = async (id: number): Promise<Tarea | null> => {
  return await Tarea.findByPk(id, {
    include: [
      {
        model: Adjunto,
        as: "adjuntos",
      },
    ],
  });
};

export const agregarTarea = async (
  payload: CrearTareaPayload,
): Promise<Tarea> => {
  const tareaCreada = await Tarea.create(payload);

  return tareaCreada;
};

export const eliminarTareaPorId = async (id: number): Promise<number> => {
  return await Tarea.destroy({
    where: { id },
  });
};
