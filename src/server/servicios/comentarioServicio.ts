import { Comentario } from "../modelos";
import { obtenerComentPorId } from "../repositorios/comentariosRepositorio copy";

export const getComentarioById = async (
  id: number,
): Promise<Comentario | null> => {
  return await obtenerComentPorId(id);
};
