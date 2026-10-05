import { Tarea } from "../modelos/Tarea";

export const obtenerTareas = async (): Promise<Tarea[]> => {
  return await Tarea.findAll();
};
