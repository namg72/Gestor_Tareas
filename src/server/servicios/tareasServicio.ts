import { Tarea } from "../modelos/Tarea";
import { obtenerTareas } from "../repositorios/tareasRepositorio";

export const listarTareas = async () => {
  let tareas: Tarea[] = await obtenerTareas();

  return tareas;
};
