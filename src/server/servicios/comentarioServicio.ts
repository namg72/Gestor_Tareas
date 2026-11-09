import { CrearComentarioPayload } from "@/features/tareas/types/comentarios";
import { Comentario } from "../modelos";
import {
  actualizarComentarioPorId,
  agregarComentario,
  borrarComentarioPorId,
  obtenerComentPorId,
} from "../repositorios/comentariosRepositorio";

export const getComentarioById = async (
  id: number,
): Promise<Comentario | null> => {
  return await obtenerComentPorId(id);
};

export const crearComentario = async (
  comentario: CrearComentarioPayload,
): Promise<Comentario> => {
  return await agregarComentario(comentario);
};

export const actualizarComentario = async (
  id: number,
  contenido: string,
): Promise<Comentario | null> => {
  return await actualizarComentarioPorId(id, contenido);
};

export const eliminarComentario = async (id: number): Promise<boolean> => {
  return await borrarComentarioPorId(id);
};
