import type { CrearAdjuntoPayload } from "@/features/tareas/types/adjuntos";
import { Adjunto } from "../modelos";

export const agregarAdjunto = async (
  payload: CrearAdjuntoPayload,
): Promise<Adjunto> => {
  const adjuntoCreado = await Adjunto.create(payload);

  return adjuntoCreado;
};

export const obtenerAdjuntoPorId = async (
  id: number,
): Promise<Adjunto | null> => {
  return await Adjunto.findByPk(id);
};
