import type { CrearComentarioPayload } from "@/features/tareas/types/comentarios";
import { crearComentario } from "@/server/servicios/comentarioServicio";

export const POST = async (
  request: Request,
  context: RouteContext<"/api/tareas/[id]/comentarios">,
) => {
  try {
    const { id } = await context.params;
    const tareaId = Number(id);

    if (!Number.isInteger(tareaId) || tareaId <= 0) {
      return Response.json(
        { mensaje: "El identificador de la tarea no es valido" },
        { status: 400 },
      );
    }

    const datos: unknown = await request.json();

    if (
      typeof datos !== "object" ||
      datos === null ||
      !("contenido" in datos) ||
      typeof datos.contenido !== "string"
    ) {
      return Response.json(
        { mensaje: "El contenido del comentario debe ser un texto" },
        { status: 400 },
      );
    }

    const contenido = datos.contenido.trim();

    if (contenido.length < 1 || contenido.length > 255) {
      return Response.json(
        { mensaje: "El comentario debe tener entre 1 y 255 caracteres" },
        { status: 400 },
      );
    }

    const payload: CrearComentarioPayload = {
      tarea_id: tareaId,
      contenido: contenido,
    };

    const comentarioCreado = await crearComentario(payload);
    return Response.json(comentarioCreado, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { mensaje: "Error al crear el comentairo" },
      { status: 500 },
    );
  }
};
