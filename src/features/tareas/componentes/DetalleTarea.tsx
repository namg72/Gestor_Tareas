"use client";

import { CalendarDays, FileText, LoaderCircle, X } from "lucide-react";
import type { Tarea } from "../types/tarea";
import { useEffect, useState } from "react";

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

export const DetalleTarea = ({ id, closeModal }: DetalleTareaProps) => {
  const [tarea, setTarea] = useState<Tarea | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      ) : error || !tarea ? (
        <div className="rounded-xl bg-white p-6 text-red-600 shadow-xl">
          {error ?? "La tarea no existe"}
        </div>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300">
            <div className="flex justify-end p-4">
              <X onClick={cerrarDetalle} />
            </div>
            <header className="flex items-start justify-between gap-6 border-b border-slate-200 px-6 py-5 sm:px-8">
              <div className="min-w-0 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Tarea #{tarea!.id}
                </p>
                <h2 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                  {tarea!.titulo}
                </h2>
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
                  <p className="min-h-28 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    {tarea!.descripcion || "Esta tarea no tiene descripción."}
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base font-semibold text-slate-900">
                    Archivos adjuntos
                  </h3>

                  <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                    <div className="space-y-2 text-slate-500">
                      <FileText
                        className="mx-auto size-8 text-slate-400"
                        aria-hidden="true"
                      />
                      <p className="text-sm">
                        Aquí se mostrarán las miniaturas de los archivos
                        adjuntos.
                      </p>
                    </div>
                  </div>
                </section>
              </main>

              <aside className="h-fit space-y-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Estado
                  </p>
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-sm font-semibold capitalize ring-1 ring-inset ${estilosEstado[tarea.estado]}`}
                  >
                    {formatearTexto(tarea!.estado)}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Prioridad
                  </p>
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-sm font-semibold capitalize ring-1 ring-inset ${estilosPrioridad[tarea.prioridad]}`}
                  >
                    {tarea!.prioridad}
                  </span>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
