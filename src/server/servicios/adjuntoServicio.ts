import type { CrearAdjuntoPayload } from "@/features/tareas/types/adjuntos";
import { readFile, rm, writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { Adjunto } from "../modelos";
import {
  agregarAdjunto,
  eliminarAdjuntoPorId,
  obtenerAdjuntoPorId,
} from "../repositorios/adjuntosRepositorio";

export const crearAdjunto = async (
  payload: CrearAdjuntoPayload,
): Promise<Adjunto> => {
  const adjuntoCreado = await agregarAdjunto(payload);

  return adjuntoCreado;
};

export const getAdjuntoById = async (id: number): Promise<Adjunto | null> => {
  return await obtenerAdjuntoPorId(id);
};

export const eliminarAdjunto = async (id: number): Promise<boolean> => {
  const adjunto = await obtenerAdjuntoPorId(id);
  if (!adjunto) return false;

  const directorio = resolve(process.cwd(), "storage", "adjuntos");
  const ruta = resolve(process.cwd(), adjunto.ruta_archivo);
  const rutaRelativa = relative(directorio, ruta);
  if (
    !rutaRelativa ||
    rutaRelativa.startsWith("..") ||
    isAbsolute(rutaRelativa)
  ) {
    throw new Error("La ruta del adjunto no es válida");
  }

  const contenido = await readFile(ruta).catch(
    (error: NodeJS.ErrnoException) => {
      if (error.code === "ENOENT") return null;
      throw error;
    },
  );
  await rm(ruta, { force: true });

  try {
    await eliminarAdjuntoPorId(id);
  } catch (error) {
    if (contenido !== null) await writeFile(ruta, contenido);
    throw error;
  }

  return true;
};
