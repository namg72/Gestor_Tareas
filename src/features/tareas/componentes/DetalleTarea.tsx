"use client";

import { CalendarDays, LoaderCircle, X } from "lucide-react";
import type { Tarea } from "../types/tarea";
import type { Adjunto } from "../types/adjuntos";
import { useEffect, useState } from "react";
import { AppButton } from "../../../components/atomos/buttons/AppButton";
import { VisorAdjunto } from "./VisorAdjunto";
import { AdjuntosDetalleTarea } from "./AdjuntosDetalleTarea";
import { AppAlertDialog } from "@/components/moleculas/dialogoConfirmacion/AppAlertDialog";
import { ComentariosTarea } from "./ComentariosTarea";
import { useMutation } from "@tanstack/react-query";
import {
  actualizarComentario,
  borrarComentario,
  crearComentario,
} from "../peticiones/comentarios";
import type { Comentario } from "../types/comentarios";

type DetalleTareaProps = {
  id: number;
  closeModal: () => void;
  actualizarListaTareas: (tarea: Tarea) => void;
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

// Formato para la vista

// Sustituye el guion bajo por un espacio.
const formatearTexto = (texto: string): string => texto.replace("_", " ");

// Muestra la fecha límite en español.
const formatearFecha = (fecha: string | null): string => {
  if (!fecha) return "Sin fecha límite";

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${fecha}T00:00:00`));
};

type CampoEditable = "titulo" | "descripcion" | "estado" | "prioridad" | null;

export const DetalleTarea = ({
  id,
  closeModal,
  actualizarListaTareas,
}: DetalleTareaProps) => {
  // Estados
  const [tarea, setTarea] = useState<Tarea | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campoEditando, setCampoEditando] = useState<CampoEditable>(null);
  const [borrador, setBorrador] = useState<Tarea | null>(null);
  const [adjuntoSeleccionado, setAdjuntoSeleccionado] =
    useState<Adjunto | null>(null);
  const [mostrarZonaAdjuntos, setMostrarZonaAdjuntos] = useState(false);
  const [archivosNuevos, setArchivosNuevos] = useState<File[]>([]);
  const [archivoEnVista, setArchivoEnVista] = useState<{
    archivo: File;
    url: string;
  } | null>(null);
  const [comentarioAEliminar, setComentarioAEliminar] =
    useState<Comentario | null>(null);

  const [adjuntoAEliminar, setAdjuntoAEliminar] = useState<Adjunto | null>(
    null,
  );
  const [adjuntosAEliminar, setAdjuntosAEliminar] = useState<number[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState<string | null>(null);

  // Mutaciones de comentarios

  // Publica un comentario en la tarea abierta.
  const publicarComentarioMutation = useMutation({
    mutationFn: (contenido: string) => crearComentario(id, contenido),
  });

  // Guarda el texto editado de un comentario.
  const editarComentarioMutation = useMutation({
    mutationFn: ({
      comentarioId,
      contenido,
    }: {
      comentarioId: number;
      contenido: string;
    }) => actualizarComentario(comentarioId, contenido),
  });

  // Borra un comentario por su ID.
  const borrarComentarioMutation = useMutation({
    mutationFn: borrarComentario,
  });

  // Efectos

  // Carga la tarea y prepara su borrador.
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

  // Libera la URL temporal al cerrar o cambiar la vista previa.
  useEffect(() => {
    return () => {
      if (archivoEnVista) URL.revokeObjectURL(archivoEnVista.url);
    };
  }, [archivoEnVista]);

  // Acciones de edición

  // Restaura la tarea guardada y descarta los cambios pendientes.
  const cancelarEdicion = (): void => {
    setBorrador(tarea);
    setCampoEditando(null);
    setArchivosNuevos([]);
    setMostrarZonaAdjuntos(false);
    setAdjuntosAEliminar([]);
    setErrorGuardado(null);
  };

  // Guarda la tarea y aplica los cambios de adjuntos.
  const guardarCambios = async (): Promise<void> => {
    if (!borrador || guardando) return;
    let tareaActualizada: Tarea = { ...borrador };
    setGuardando(true);
    setErrorGuardado(null);

    try {
      const respuestaTarea = await fetch(`/api/tareas/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: borrador.titulo,
          descripcion: borrador.descripcion,
          estado: borrador.estado,
          prioridad: borrador.prioridad,
          fecha_limite: borrador.fecha_limite,
        }),
      });

      if (!respuestaTarea.ok) {
        throw new Error("No se ha podido actualizar la tarea");
      }

      setTarea({ ...tareaActualizada });

      for (const adjuntoId of adjuntosAEliminar) {
        const respuesta = await fetch(`/api/adjuntos/${adjuntoId}`, {
          method: "DELETE",
        });
        if (!respuesta.ok && respuesta.status !== 404) {
          throw new Error(
            "No se pudieron eliminar todos los adjuntos. Los eliminados anteriormente ya se han borrado; puedes reintentar los pendientes.",
          );
        }
        const quitarAdjunto = (actual: Tarea | null): Tarea | null =>
          actual
            ? {
                ...actual,
                adjuntos: actual.adjuntos?.filter(
                  (adjunto) => adjunto.id !== adjuntoId,
                ),
              }
            : actual;
        setTarea(quitarAdjunto);
        setBorrador(quitarAdjunto);
        setAdjuntosAEliminar((pendientes) =>
          pendientes.filter((pendiente) => pendiente !== adjuntoId),
        );
        tareaActualizada = {
          ...tareaActualizada,
          adjuntos: tareaActualizada.adjuntos?.filter(
            (adjunto) => adjunto.id !== adjuntoId,
          ),
        };
      }
      for (const archivo of archivosNuevos) {
        const datosArchivo = new FormData();
        datosArchivo.append("archivo", archivo);

        const respuestaAdjunto = await fetch(`/api/tareas/${id}/adjuntos`, {
          method: "POST",
          body: datosArchivo,
        });

        if (!respuestaAdjunto.ok) {
          throw new Error(
            `No se pudo subir "${archivo.name}". Los cambios anteriores ya están guardados; puedes reintentar los archivos pendientes.`,
          );
        }

        const adjuntoCreado: Adjunto = await respuestaAdjunto.json();
        tareaActualizada = {
          ...tareaActualizada,
          adjuntos: [...(tareaActualizada.adjuntos ?? []), adjuntoCreado],
        };
        const agregarAdjunto = (actual: Tarea | null): Tarea | null =>
          actual
            ? {
                ...actual,
                adjuntos: [...(actual.adjuntos ?? []), adjuntoCreado],
              }
            : actual;

        setTarea(agregarAdjunto);
        setBorrador(agregarAdjunto);
        setArchivosNuevos((pendientes) =>
          pendientes.filter((pendiente) => pendiente !== archivo),
        );
      }

      setCampoEditando(null);
      setMostrarZonaAdjuntos(false);
      actualizarListaTareas(tareaActualizada);
      closeModal();
    } catch (error) {
      setErrorGuardado(
        error instanceof Error
          ? error.message
          : "No se pudieron guardar los cambios",
      );
    } finally {
      setGuardando(false);
    }
  };

  // Acciones de comentarios

  // Publica el comentario y lo añade a la lista.
  const onPublicar = async (contenido: string): Promise<void> => {
    const comentarioCreado =
      await publicarComentarioMutation.mutateAsync(contenido);

    setTarea((tareaAnterior) => {
      if (tareaAnterior === null) return null;

      return {
        ...tareaAnterior,
        comentarios: [...(tareaAnterior.comentarios ?? []), comentarioCreado],
      };
    });
  };

  // Sustituye el comentario guardado en la vista y en el borrador.
  const onEditarComentario = async (
    comentarioId: number,
    contenido: string,
  ): Promise<void> => {
    const comentarioActualizado = await editarComentarioMutation.mutateAsync({
      comentarioId,
      contenido,
    });

    const reemplazarComentario = (actual: Tarea | null): Tarea | null => {
      if (!actual) return actual;

      const comentarios = actual.comentarios ?? [];

      return {
        ...actual,
        comentarios: comentarios.some((comentario) => comentario.id === comentarioId)
          ? comentarios.map((comentario) =>
              comentario.id === comentarioId ? comentarioActualizado : comentario,
            )
          : [...comentarios, comentarioActualizado],
      };
    };

    setTarea(reemplazarComentario);
    setBorrador(reemplazarComentario);
  };

  // Borra el comentario y lo retira de la lista.
  const onBorrarComentario = async (id: number): Promise<void> => {
    await borrarComentarioMutation.mutateAsync(id);

    setTarea((tareaAnterior) => {
      if (tareaAnterior === null) return null;

      return {
        ...tareaAnterior,
        comentarios: (tareaAnterior.comentarios ?? []).filter(
          (comentario) => comentario.id !== id,
        ),
      };
    });
  };

  // Borra el comentario seleccionado y cierra el diálogo.
  const confirmarBorradoComentario = async (): Promise<void> => {
    if (!comentarioAEliminar) return;

    await onBorrarComentario(comentarioAEliminar.id);
    setComentarioAEliminar(null);
  };

  // Acciones de adjuntos

  // Abre la vista previa de un archivo local.
  const visualizarArchivoNuevo = (archivo: File): void => {
    setArchivoEnVista({ archivo, url: URL.createObjectURL(archivo) });
  };

  // Marca el adjunto para borrarlo al guardar.
  const confirmarBorradoAdjunto = (): void => {
    if (!adjuntoAEliminar) return;
    setAdjuntosAEliminar((pendientes) => [
      ...new Set([...pendientes, adjuntoAEliminar.id]),
    ]);
    setAdjuntoAEliminar(null);
  };

  // Muestra la zona de subida.
  const mostrarSubidaAdjuntos = (): void => {
    setMostrarZonaAdjuntos(true);
  };

  // Oculta la zona de subida.
  const ocultarSubidaAdjuntos = (): void => {
    setMostrarZonaAdjuntos(false);
  };

  // Añade archivos a la lista pendiente de subir.
  const archivosAdjuntados = (nuevos: File[]): void => {
    setArchivosNuevos((anteriores) => [...anteriores, ...nuevos]);
  };

  // Quita un archivo de la lista pendiente.
  const eliminarArchivoNuevo = (indice: number): void => {
    setArchivosNuevos((anteriores) =>
      anteriores.filter((_, posicion) => posicion !== indice),
    );
  };

  // Vista del detalle
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
              disabled={guardando}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              onClick={closeModal}
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <header className="flex items-start justify-between gap-6 border-b border-slate-200 px-6 py-5 sm:px-8">
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Tarea #{tarea.id}
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
              <span>{formatearFecha(tarea.fecha_limite)}</span>
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

              <ComentariosTarea
                comentarios={tarea.comentarios ?? []}
                onPublicar={onPublicar}
                onEditar={onEditarComentario}
                onSolicitarEliminar={setComentarioAEliminar}
              />

              <AdjuntosDetalleTarea
                adjuntos={tarea.adjuntos ?? []}
                adjuntosAEliminar={adjuntosAEliminar}
                archivosNuevos={archivosNuevos}
                guardando={guardando}
                mostrarZonaAdjuntos={mostrarZonaAdjuntos}
                zonaAdjuntos={mostrarSubidaAdjuntos}
                cancelarSubida={ocultarSubidaAdjuntos}
                abrirAdjunto={setAdjuntoSeleccionado}
                solicitarEliminarAdjunto={setAdjuntoAEliminar}
                visualizarArchivoNuevo={visualizarArchivoNuevo}
                archivosAdjuntados={archivosAdjuntados}
                eliminarArchivoNuevo={eliminarArchivoNuevo}
              />
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

          {adjuntosAEliminar.length > 0 && (
            <p role="status" className="px-6 text-sm text-amber-700">
              {adjuntosAEliminar.length} adjunto(s) pendiente(s) de eliminar. Se
              borrarán definitivamente al pulsar Guardar.
            </p>
          )}
          {errorGuardado && (
            <p role="alert" className="px-6 text-sm text-red-600">
              {errorGuardado}
            </p>
          )}
          {(campoEditando !== null ||
            archivosNuevos.length > 0 ||
            adjuntosAEliminar.length > 0) && (
            <div className="flex justify-end gap-4 p-4">
              <AppButton
                texto="Cancelar"
                colorFondo="neutral"
                onClick={cancelarEdicion}
                disabled={guardando}
              />

              <AppButton
                texto={guardando ? "Guardando..." : "Guardar"}
                disabled={guardando}
                colorFondo="primary"
                onClick={guardarCambios}
              />
            </div>
          )}
        </div>
      )}

      <AppAlertDialog
        abierto={adjuntoAEliminar !== null}
        titulo="Eliminar adjunto"
        descripcion={`¿Quieres eliminar "${adjuntoAEliminar?.nombre_original ?? ""}"? `}
        textoConfirmar="Marcar para eliminar"
        textoCancelar="Cancelar"
        variante="peligro"
        onCambiarAbierto={(abierto) => {
          if (!abierto) setAdjuntoAEliminar(null);
        }}
        onConfirmar={confirmarBorradoAdjunto}
      />
      {adjuntoSeleccionado && (
        <VisorAdjunto
          adjunto={adjuntoSeleccionado}
          cerrarVisor={() => setAdjuntoSeleccionado(null)}
        />
      )}
      {archivoEnVista && (
        <VisorAdjunto
          archivo={archivoEnVista.archivo}
          url={archivoEnVista.url}
          cerrarVisor={() => setArchivoEnVista(null)}
        />
      )}

      <AppAlertDialog
        abierto={comentarioAEliminar !== null}
        titulo="Eliminar comentario"
        descripcion="¿Estás seguro de que quieres eliminar el comentario?"
        textoCancelar="Cancelar"
        textoConfirmar="Eliminar"
        onCambiarAbierto={function (abierto: boolean): void {
          if (!abierto) {
            setComentarioAEliminar(null);
          }
        }}
        onConfirmar={confirmarBorradoComentario}
      />
    </div>
  );
};
