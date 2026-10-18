"use client";

import {
  CalendarDays,
  FileImage,
  FileText,
  LoaderCircle,
  X,
} from "lucide-react";
import Image from "next/image";
import type { Tarea } from "../types/tarea";
import type { Adjunto } from "../types/adjuntos";
import { useEffect, useState } from "react";
import { AppButton } from "../../../components/atomos/buttons/AppButton";
import { VisorAdjunto } from "./VisorAdjunto";
import { ZonaAdjuntos } from "@/components/organismos/ZonaAdjuntos";

type DetalleTareaProps = {
  id: number;
  closeModal: () => void;
};

const estilosEstado = {
  pendiente: "bg-red-50 text-red-700 ring-red-200",
  en_curso: "bg-amber-50 text-amber-700 ring-amber-200",
  bloqueada: "bg-purple-50 text-purple-700 ring-purple-200",
  terminada: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const estilosPrioridad = {
  baja: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  media: "bg-amber-50 text-amber-700 ring-amber-200",
  alta: "bg-red-50 text-red-700 ring-red-200",
};

const formatearTexto = (texto: string): string => texto.replace("_", " ");

const formatearFecha = (fecha: string | null): string => {
  if (!fecha) return "Sin fecha límite";

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${fecha}T00:00:00`));
};

const formatearTamano = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
type CampoEditable = "titulo" | "descripcion" | "estado" | "prioridad" | null;

export const DetalleTarea = ({ id, closeModal }: DetalleTareaProps) => {
  const [tarea, setTarea] = useState<Tarea | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campoEditando, setCampoEditando] = useState<CampoEditable>(null);
  const [borrador, setBorrador] = useState<Tarea | null>(null);
  const [adjuntoSeleccionado, setAdjuntoSeleccionado] =
    useState<Adjunto | null>(null);
  const [mostrarZonaAdjuntos, setMostrarZonaAdjuntos] = useState(false);
  const [archivosNuevos, setArchivosNuevos] = useState<File[]>([]);

  useEffect(() => {
    const cargarTarea = async (): Promise<void> => {
      try {
        setCargando(true);
        setError(null);

        const respuesta = await fetch(`/api/tareas/${id}`);

        if (!respuesta.ok) {
          throw new Error("No se pudo obtener la tarea");
        }

        const datos: Tarea = await respuesta.json();
        setTarea(datos);
        setBorrador(datos);
      } catch {
        setError("No se pudo cargar la tarea");
      } finally {
        setCargando(false);
      }
    };

    void cargarTarea();
  }, [id]);

  const cerrarDetalle = () => {
    closeModal();
  };

  const cancelarEdicion = (): void => {
    setBorrador(tarea);
    setCampoEditando(null);
    setArchivosNuevos([]);
    setMostrarZonaAdjuntos(false);
  };

  const guardarCambios = (): void => {
    if (!borrador) return;

    setTarea(borrador);
    setCampoEditando(null);
  };
  const zonaAdjuntos = (): void => {
    setMostrarZonaAdjuntos(true);
  };
  const cancelarSubida = (): void => {
    setMostrarZonaAdjuntos(false);
    setArchivosNuevos([]);
  };

  const archivosAdjuntados = (nuevos: File[]): void => {
    setArchivosNuevos((anteriores) => [...anteriores, ...nuevos]);
  };

  const eliminarArchivoNuevo = (indice: number): void => {
    setArchivosNuevos((anteriores) =>
      anteriores.filter((_, posicion) => posicion !== indice),
    );
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      {cargando ? (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-white px-8 py-6 shadow-xl">
          <LoaderCircle
            className="size-8 animate-spin text-blue-600"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-slate-600">
            Cargando tarea...
          </p>
        </div>
      ) : error || !tarea || !borrador ? (
        <div className="rounded-xl bg-white p-6 text-red-600 shadow-xl">
          {error ?? "La tarea no existe"}
        </div>
      ) : (
        <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300">
          <div className="flex justify-end p-4">
            <button
              type="button"
              aria-label="Cerrar detalle"
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              onClick={cerrarDetalle}
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <header className="flex items-start justify-between gap-6 border-b border-slate-200 px-6 py-5 sm:px-8">
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Tarea #{tarea!.id}
              </p>
              {campoEditando === "titulo" ? (
                <input
                  type="text"
                  value={borrador.titulo}
                  onChange={(evento) =>
                    setBorrador({ ...borrador, titulo: evento.target.value })
                  }
                  className="w-full rounded-lg border border-blue-400 px-3 py-2"
                />
              ) : (
                <button
                  type="button"
                  className="rounded-lg px-2 py-1 text-left text-2xl font-bold leading-tight text-slate-900 transition-colors hover:bg-slate-100 sm:text-3xl"
                  onClick={() => setCampoEditando("titulo")}
                >
                  {borrador.titulo}
                </button>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <CalendarDays className="size-4" aria-hidden="true" />
              <span>{formatearFecha(tarea!.fecha_limite)}</span>
            </div>
          </header>

          <div className="grid gap-8 px-6 py-6 sm:px-8 md:grid-cols-[minmax(0,1fr)_16rem]">
            <main className="min-w-0 space-y-8">
              <section className="space-y-3">
                <h3 className="text-base font-semibold text-slate-900">
                  Descripción
                </h3>
                {campoEditando === "descripcion" ? (
                  <textarea
                    rows={8}
                    value={borrador.descripcion ?? ""}
                    onChange={(evento) =>
                      setBorrador({
                        ...borrador,
                        descripcion: evento.target.value,
                      })
                    }
                    className="min-h-48 w-full resize-y rounded-xl border border-blue-400 bg-white p-4 text-left text-sm leading-6 text-slate-700 outline-none"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setCampoEditando("descripcion")}
                    className="flex min-h-48 w-full items-start justify-start whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm leading-6 text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50/40"
                  >
                    {borrador.descripcion || "Esta tarea no tiene descripción."}
                  </button>
                )}
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-semibold text-slate-900">
                    Archivos adjuntos
                    <span className="ml-2">({tarea.adjuntos?.length})</span>
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
                      texto="Cancelar subida"
                      colorFondo="neutral"
                      onClick={cancelarSubida}
                    />
                  )}
                </div>

                {tarea.adjuntos && tarea.adjuntos.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {tarea.adjuntos.map((adjunto) => {
                      const esImagen = adjunto.tipo_mime.startsWith("image/");
                      const IconoArchivo = esImagen ? FileImage : FileText;
                      const urlAdjunto = `/api/adjuntos/${adjunto.id}`;

                      return (
                        <button
                          type="button"
                          key={adjunto.id}
                          onClick={() => setAdjuntoSeleccionado(adjunto)}
                          className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/40"
                        >
                          <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white text-blue-600 shadow-sm ring-1 ring-slate-200">
                            {esImagen ? (
                              <Image
                                src={urlAdjunto}
                                alt={`Vista previa de ${adjunto.nombre_original}`}
                                fill
                                sizes="56px"
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <IconoArchivo
                                className="size-5"
                                aria-hidden="true"
                              />
                            )}
                          </div>

                          <div className="min-w-0">
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
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                    <div className="space-y-2 text-slate-500">
                      <FileText
                        className="mx-auto size-8 text-slate-400"
                        aria-hidden="true"
                      />
                      <p className="text-sm">Esta tarea no tiene adjuntos.</p>
                    </div>
                  </div>
                )}
              </section>
              {mostrarZonaAdjuntos && (
                <ZonaAdjuntos
                  archivos={archivosNuevos}
                  archivosAdjuntados={archivosAdjuntados}
                  eliminarArchivo={eliminarArchivoNuevo}
                />
              )}
            </main>

            <aside className="h-fit space-y-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Estado
                </p>
                {campoEditando === "estado" ? (
                  <select
                    value={borrador.estado}
                    onChange={(evento) =>
                      setBorrador({
                        ...borrador,
                        estado: evento.target.value as Tarea["estado"],
                      })
                    }
                    className="w-full rounded-lg border border-blue-400 bg-white px-3 py-2 text-sm"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_curso">En curso</option>
                    <option value="bloqueada">Bloqueada</option>
                    <option value="terminada">Terminada</option>
                  </select>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCampoEditando("estado")}
                    className={`inline-flex rounded-full px-3 py-1.5 text-sm font-semibold capitalize ring-1 ring-inset ${estilosEstado[borrador.estado]}`}
                  >
                    {formatearTexto(borrador.estado)}
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Prioridad
                </p>
                {campoEditando === "prioridad" ? (
                  <select
                    value={borrador.prioridad}
                    onChange={(evento) =>
                      setBorrador({
                        ...borrador,
                        prioridad: evento.target.value as Tarea["prioridad"],
                      })
                    }
                    className="w-full rounded-lg border border-blue-400 bg-white px-3 py-2 text-sm"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCampoEditando("prioridad")}
                    className={`inline-flex rounded-full px-3 py-1.5 text-sm font-semibold capitalize ring-1 ring-inset ${estilosPrioridad[borrador.prioridad]}`}
                  >
                    {borrador.prioridad}
                  </button>
                )}
              </div>
            </aside>
          </div>

          {(campoEditando !== null || archivosNuevos.length > 0) && (
            <div className="flex justify-end gap-4 p-4">
              <AppButton
                texto="Cancelar"
                colorFondo="neutral"
                onClick={cancelarEdicion}
              />

              <AppButton
                texto="Guardar"
                colorFondo="primary"
                onClick={guardarCambios}
              />
            </div>
          )}
        </div>
      )}

      {adjuntoSeleccionado && (
        <VisorAdjunto
          adjunto={adjuntoSeleccionado}
          cerrarVisor={() => setAdjuntoSeleccionado(null)}
        />
      )}
    </div>
  );
};
