//import type { CrearComentarioPayload } from "@/features/tareas/types/comentarios";
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
/* 
export const eliminarAdjuntoPorId = async (id: number): Promise<number> => {
  return Adjunto.destroy({ where: { id } });
};
 */
