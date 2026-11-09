import {
  actualizarComentario,
  eliminarComentario,
} from "@/server/servicios/comentarioServicio";

export const PATCH = async (
  request: Request,
  context: RouteContext<"/api/comentarios/[id]">,
) => {
  try {
    const { id } = await context.params;
    const comentarioId = Number(id);

    if (!Number.isInteger(comentarioId) || comentarioId <= 0) {
      return Response.json(
        { mensaje: "El identificador del comentario no es valido" },
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

    const comentarioActualizado = await actualizarComentario(
      comentarioId,
      contenido,
    );

    if (!comentarioActualizado) {
      return Response.json(
        {
          mensage: "El identificador del comentario no es valido",
        },
        { status: 404 },
      );
    }

    return Response.json(comentarioActualizado, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { mensaje: "Error al actualizar el comentairo" },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  _request: Request,
  context: RouteContext<"/api/comentarios/[id]">,
) => {
  try {
    const { id } = await context.params;

    const comentarioId = Number(id);

    if (!Number.isInteger(comentarioId) || comentarioId <= 0) {
      return Response.json(
        {
          mensage: "El id no es correcto",
        },
        { status: 400 },
      );
    }

    const eliminado = await eliminarComentario(comentarioId);

    if (!eliminado) {
      return Response.json(
        {
          mensaje: "No se ha encontrdo el comentario",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        mensage: "El comentario se ha eliminado correctamente",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        mensage: "No ha sido posible borrar el comentario",
      },
      { status: 500 },
    );
  }
};
