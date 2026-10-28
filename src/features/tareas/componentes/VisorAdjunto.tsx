"use client";

import { Download, X } from "lucide-react";
import Image from "next/image";
import type { Adjunto } from "../types/adjuntos";

type VisorAdjuntoProps = ({ adjunto: Adjunto } | { archivo: File; url: string }) & {
  cerrarVisor: () => void;
};

export const VisorAdjunto = (props: VisorAdjuntoProps) => {
  const { cerrarVisor } = props;
  const guardado = "adjunto" in props;
  const urlAdjunto = guardado ? `/api/adjuntos/${props.adjunto.id}` : props.url;
  const nombre = guardado ? props.adjunto.nombre_original : props.archivo.name;
  const tipo = guardado ? props.adjunto.tipo_mime : props.archivo.type;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <button
        type="button"
        aria-label="Cerrar vista previa"
        className="absolute inset-0 cursor-default"
        onClick={cerrarVisor}
      />

      <div
        className="absolute inset-4 z-10 flex min-h-0 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:inset-8"
      >
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-3">
          <p className="min-w-0 truncate font-semibold text-slate-900">
            {nombre}
          </p>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={guardado ? `${urlAdjunto}?descargar=1` : urlAdjunto}
              download={guardado ? undefined : nombre}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <Download className="size-4" aria-hidden="true" />
              Descargar
            </a>

            <button
              type="button"
              aria-label="Cerrar vista previa"
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              onClick={cerrarVisor}
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="relative min-h-0 flex-1 bg-slate-100">
          {tipo.startsWith("image/") ? (
            <Image
              src={urlAdjunto}
              alt={nombre}
              fill
              sizes="90vw"
              unoptimized
              className="object-contain p-4"
            />
          ) : (
            <iframe
              src={urlAdjunto}
              title={`Vista previa de ${nombre}`}
              className="size-full border-0 bg-white"
            />
          )}
        </div>
      </div>
    </div>
  );
};
