import {
  eliminarTarea,
  getTareasbyId,
} from "@/server/servicios/tareasServicio";

export const GET = async (
  _request: Request,
  context: RouteContext<"/api/tareas/[id]">,
) => {
  try {
    const { id } = await context.params;

    const tareaId = Number(id);

    if (!Number.isInteger(tareaId) || tareaId <= 0) {
      return Response.json(
        { mensaje: "El identificador de la tarea no es válido" },
        { status: 400 },
      );
    }

    const tarea = await getTareasbyId(tareaId);

    if (!tarea) {
      return Response.json({ mensaje: "La tarea no existe" }, { status: 404 });
    }

    return Response.json(tarea, { status: 200 });
  } catch (error) {
    console.error(error);

    return Response.json(
      { mensaje: "No se pudo conectar a la base de datos" },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  _request: Request,
  context: RouteContext<"/api/tareas/[id]">,
) => {
  try {
    const { id } = await context.params;

    const tareaId = Number(id);

    if (!Number.isInteger(tareaId) || tareaId <= 0) {
      return Response.json(
        { mensaje: "El identificador de la tarea no es válido" },
        { status: 400 },
      );
    }

    const tarea = await getTareasbyId(tareaId);

    if (!tarea) {
      return Response.json({ mensaje: "La tarea no existe" }, { status: 404 });
    }

    await eliminarTarea(tarea.id);
    return Response.json(
      { mensaje: "Tarea eliminada correctamente" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { mensaje: "No se pudo conectar a la base de datos" },
      { status: 500 },
    );
  }
};
