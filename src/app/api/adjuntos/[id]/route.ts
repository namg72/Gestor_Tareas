import { readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { getAdjuntoById } from "@/server/servicios/adjuntoServicio";

export const runtime = "nodejs";

type ContextoRuta = {
  params: Promise<{ id: string }>;
};

export const GET = async (request: Request, context: ContextoRuta) => {
  try {
    const { id } = await context.params;
    const adjuntoId = Number(id);

    if (!Number.isInteger(adjuntoId) || adjuntoId <= 0) {
      return Response.json(
        { mensaje: "El identificador del adjunto no es válido" },
        { status: 400 },
      );
    }

    const adjunto = await getAdjuntoById(adjuntoId);

    if (!adjunto) {
      return Response.json({ mensaje: "El adjunto no existe" }, { status: 404 });
    }

    const directorioStorage = resolve(process.cwd(), "storage");
    const rutaArchivo = resolve(process.cwd(), adjunto.ruta_archivo);
    const rutaRelativa = relative(directorioStorage, rutaArchivo);

    if (rutaRelativa.startsWith("..") || isAbsolute(rutaRelativa)) {
      return Response.json(
        { mensaje: "La ruta del adjunto no es válida" },
        { status: 400 },
      );
    }

    const contenido = await readFile(rutaArchivo);
    const nombreCodificado = encodeURIComponent(adjunto.nombre_original);
    const descargar = new URL(request.url).searchParams.get("descargar") === "1";

    return new Response(new Uint8Array(contenido), {
      status: 200,
      headers: {
        "Content-Type": adjunto.tipo_mime,
        "Content-Length": String(contenido.byteLength),
        "Content-Disposition": `${descargar ? "attachment" : "inline"}; filename*=UTF-8''${nombreCodificado}`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { mensaje: "No se pudo abrir el archivo adjunto" },
      { status: 500 },
    );
  }
};
