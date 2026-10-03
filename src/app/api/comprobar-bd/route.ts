import { conexion } from "@/server/db/conexion";

export const GET = async () => {
  try {
    await conexion.authenticate();

    return Response.json(
      {
        mensaje: "Conexión correcta",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { mensaje: "No se pudo conectar a la base de datos" },
      { status: 500 },
    );
  }
};
