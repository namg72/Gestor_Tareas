import { FileText, X } from "lucide-react";
import { AppButton } from "@/components/atomos/buttons/AppButton";
import { ZonaAdjuntos } from "@/components/organismos/ZonaAdjuntos";
import type { Adjunto } from "../types/adjuntos";

type AdjuntosDetalleTareaProps = {
  adjuntos: Adjunto[];
  adjuntosAEliminar: number[];
  archivosNuevos: File[];
  guardando: boolean;
  mostrarZonaAdjuntos: boolean;
  zonaAdjuntos: () => void;
  cancelarSubida: () => void;
  abrirAdjunto: (adjunto: Adjunto) => void;
  solicitarEliminarAdjunto: (adjunto: Adjunto) => void;
  visualizarArchivoNuevo: (archivo: File) => void;
  archivosAdjuntados: (archivos: File[]) => void;
  eliminarArchivoNuevo: (indice: number) => void;
};

const formatearTamano = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function AdjuntosDetalleTarea({
  adjuntos,
  adjuntosAEliminar,
  archivosNuevos,
  guardando,
  mostrarZonaAdjuntos,
  zonaAdjuntos,
  cancelarSubida,
  abrirAdjunto,
  solicitarEliminarAdjunto,
  visualizarArchivoNuevo,
  archivosAdjuntados,
  eliminarArchivoNuevo,
}: Readonly<AdjuntosDetalleTareaProps>) {
  const adjuntosVisibles = adjuntos.filter((adjunto) => !adjuntosAEliminar.includes(adjunto.id));

  return (
    <>
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-slate-900">
            Archivos adjuntos
            <span className="ml-2">
              (
              {adjuntosVisibles.length}
              )
            </span>
          </h3>

          {!mostrarZonaAdjuntos ? (
            <AppButton
              type={"button"}
              texto="Añadir adjunto"
              onClick={zonaAdjuntos}
            />
          ) : (
            <AppButton
              type={"button"}
              texto="Ocultar zona de subida"
              colorFondo="neutral"
              onClick={cancelarSubida}
            />
          )}
        </div>

        {adjuntosVisibles.length > 0 ? (
          <ul className="space-y-2">
            {adjuntosVisibles.map((adjunto) => {
                return (
                  <li
                    key={adjunto.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
                  >
                    <button
                      type="button"
                      onClick={() => abrirAdjunto(adjunto)}
                      aria-label={`Abrir ${adjunto.nombre_original}`}
                      className="flex min-w-0 flex-1 items-center gap-3 rounded text-left transition-colors hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-blue-500"
                    >
                      <FileText
                        className="size-5 shrink-0 text-slate-500"
                        aria-hidden="true"
                      />

                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate text-sm font-medium text-slate-800"
                          title={adjunto.nombre_original}
                        >
                          {adjunto.nombre_original}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatearTamano(adjunto.tamano_bytes)}
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      disabled={guardando}
                      aria-label={`Eliminar ${adjunto.nombre_original}`}
                      onClick={() => solicitarEliminarAdjunto(adjunto)}
                      className="shrink-0 rounded-md p-1 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                      <X aria-hidden="true" className="size-4" />
                    </button>
                  </li>
                );
              })}
          </ul>
        ) : archivosNuevos.length === 0 ? (
          <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <div className="space-y-2 text-slate-500">
              <FileText
                className="mx-auto size-8 text-slate-400"
                aria-hidden="true"
              />
              <p className="text-sm">Esta tarea no tiene adjuntos.</p>
            </div>
          </div>
        ) : null}
      </section>
      {mostrarZonaAdjuntos && (
        <ZonaAdjuntos
          visualizarArchivo={visualizarArchivoNuevo}
          archivos={archivosNuevos}
          archivosAdjuntados={archivosAdjuntados}
          eliminarArchivo={eliminarArchivoNuevo}
        />
      )}
    </>
  );
}
