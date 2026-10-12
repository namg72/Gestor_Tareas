import type { CrearAdjuntoPayload } from "@/features/tareas/types/adjuntos";
import { Adjunto } from "../modelos";
import { agregarAdjunto } from "../repositorios/adjuntosRepositorio";

export const crearAdjunto = async (
  payload: CrearAdjuntoPayload,
): Promise<Adjunto> => {
  const adjuntoCreado = await agregarAdjunto(payload);

  return adjuntoCreado;
};
