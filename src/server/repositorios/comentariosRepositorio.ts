//import type { CrearComentarioPayload } from "@/features/tareas/types/comentarios";
import { CrearComentarioPayload } from "@/features/tareas/types/comentarios";
import { Comentario } from "../modelos";

/* export const agregarAdjunto = async (
  payload: CrearAdjuntoPayload,
): Promise<Adjunto> => {
  const adjuntoCreado = await Adjunto.create(payload);

  return adjuntoCreado;
}; */

export const obtenerComentPorId = async (
  id: number,
): Promise<Comentario | null> => {
  return await Comentario.findByPk(id);
};

export const agregarComentario = async (comentario: CrearComentarioPayload) => {
  return await Comentario.create(comentario);
};

export const actualizarComentarioPorId = async (
  id: number,
  contenido: string,
): Promise<Comentario | null> => {
  const comentario = await obtenerComentPorId(id);

  if (!comentario) {
    return null;
  }

  return await comentario.update({
    contenido,
    actualizado_en: new Date(),
  });
};

export const borrarComentarioPorId = async (id: number): Promise<boolean> => {
  const comentario = await obtenerComentPorId(id);

  if (!comentario) {
    return false;
  }

  await comentario.destroy();
  return true;
};
