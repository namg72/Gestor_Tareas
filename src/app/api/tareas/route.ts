import type { CrearTareaPayload } from "@/features/tareas/types/tarea";
import {
  crearTarea,
  listarTareas,
} from "@/server/servicios/tareasServicio";

export const GET = async () => {
  try {
    const tareas = await listarTareas();

    return Response.json(tareas, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { mensaje: "No se pudo conectar a la base de datos" },
      { status: 500 },
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const payload = (await request.json()) as CrearTareaPayload;

    if (typeof payload.titulo !== "string" || payload.titulo.trim() === "") {
      return Response.json(
        { mensaje: "El título es obligatorio" },
        { status: 400 },
      );
    }

    const tareaCreada = await crearTarea(payload);

    return Response.json(tareaCreada, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { mensaje: "No se ha podido crear la tarea" },
      { status: 500 },
    );
  }
};
