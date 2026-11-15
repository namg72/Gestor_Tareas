import { z } from "zod";
import { moverTareaPorId } from "@/server/repositorios/tareasRepositorio";

const destinoSchema = z.object({
  estado: z.enum(["pendiente", "en_curso", "bloqueada", "terminada"]),
  referenciaId: z.number().int().positive().nullable(),
  lado: z.enum(["antes", "despues"]),
});

export const PATCH = async (
  request: Request,
  context: RouteContext<"/api/tareas/[id]/mover">,
) => {
  const id = Number((await context.params).id);
  const destino = destinoSchema.safeParse(await request.json().catch(() => null));
  if (!Number.isSafeInteger(id) || id <= 0 || !destino.success || destino.data.referenciaId === id) {
    return Response.json({ mensaje: "El destino de la tarea no es válido" }, { status: 400 });
  }

  try {
    const posiciones = await moverTareaPorId(id, destino.data);
    if (!posiciones) {
      return Response.json({ mensaje: "La tarea o su posición ya no están disponibles" }, { status: 409 });
    }
    return Response.json(posiciones);
  } catch (error) {
    console.error(error);
    return Response.json({ mensaje: "No se pudo mover la tarea" }, { status: 500 });
  }
};
