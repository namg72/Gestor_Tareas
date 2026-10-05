import { listarTareas } from "@/server/servicios/tareasServicio";

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
