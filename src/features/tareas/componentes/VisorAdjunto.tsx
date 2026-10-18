"use client";

import { Download, X } from "lucide-react";
import Image from "next/image";
import type { Adjunto } from "../types/adjuntos";

type VisorAdjuntoProps = {
  adjunto: Adjunto;
  cerrarVisor: () => void;
};

export const VisorAdjunto = ({
  adjunto,
  cerrarVisor,
}: VisorAdjuntoProps) => {
  const urlAdjunto = `/api/adjuntos/${adjunto.id}`;

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
            {adjunto.nombre_original}
          </p>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={`${urlAdjunto}?descargar=1`}
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
          {adjunto.tipo_mime.startsWith("image/") ? (
            <Image
              src={urlAdjunto}
              alt={adjunto.nombre_original}
              fill
              sizes="90vw"
              unoptimized
              className="object-contain p-4"
            />
          ) : (
            <iframe
              src={urlAdjunto}
              title={`Vista previa de ${adjunto.nombre_original}`}
              className="size-full border-0 bg-white"
            />
          )}
        </div>
      </div>
    </div>
  );
};
