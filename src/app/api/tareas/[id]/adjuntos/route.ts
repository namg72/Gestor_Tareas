import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { CrearAdjuntoPayload } from "@/features/tareas/types/adjuntos";
import { crearAdjunto } from "@/server/servicios/adjuntoServicio";

export const runtime = "nodejs";

const TAMANO_MAXIMO = 5 * 1024 * 1024;

const EXTENSIONES_PERMITIDAS: Record<string, string> = {
  "application/pdf": ".pdf",
  "text/plain": ".txt",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export const POST = async (
  request: Request,
  context: RouteContext<"/api/tareas/[id]/adjuntos">,
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

    const datos = await request.formData();
    const archivo = datos.get("archivo");

    if (!(archivo instanceof File)) {
      return Response.json(
        { mensaje: "No se ha enviado ningún archivo válido" },
        { status: 400 },
      );
    }

    const extension = EXTENSIONES_PERMITIDAS[archivo.type];

    if (!extension) {
      return Response.json(
        { mensaje: "El tipo de archivo no está permitido" },
        { status: 415 },
      );
    }

    if (archivo.size === 0 || archivo.size > TAMANO_MAXIMO) {
      return Response.json(
        { mensaje: "El archivo debe ocupar entre 1 byte y 5 MB" },
        { status: 400 },
      );
    }

    const nombreGuardado = `${randomUUID()}${extension}`;
    const rutaRelativa = join("storage", "adjuntos", String(tareaId), nombreGuardado);
    const directorio = join(
      process.cwd(),
      "storage",
      "adjuntos",
      String(tareaId),
    );
    const rutaAbsoluta = join(directorio, nombreGuardado);

    await mkdir(directorio, { recursive: true });
    await writeFile(rutaAbsoluta, Buffer.from(await archivo.arrayBuffer()));

    const payload: CrearAdjuntoPayload = {
      tarea_id: tareaId,
      nombre_original: archivo.name,
      ruta_archivo: rutaRelativa,
      tipo_mime: archivo.type,
      tamano_bytes: archivo.size,
    };

    try {
      const adjuntoCreado = await crearAdjunto(payload);

      return Response.json(adjuntoCreado, { status: 201 });
    } catch (error) {
      await unlink(rutaAbsoluta).catch(() => undefined);
      throw error;
    }
  } catch (error) {
    console.error(error);
    return Response.json(
      { mensaje: "No se ha podido cargar el adjunto" },
      { status: 500 },
    );
  }
};
