"use client";

import { AppSelect } from "@/components/atomos/selects/AppSelect";
import { CalendarDays, MoreVertical } from "lucide-react";
import type { Tarea } from "../types/tarea";

type TareaCardProps = {
  tarea: Tarea;
};

const prioridadOpciones = [
  { valor: "alta", etiqueta: "Alta" },
  { valor: "media", etiqueta: "Media" },
  { valor: "baja", etiqueta: "Baja" },
];

const coloresPrioridad = {
  baja: "bg-green-100 text-green-700",
  media: "bg-amber-100 text-amber-700",
  alta: "bg-red-100 text-red-700",
};

const formatearFecha = (fecha: string | null) => {
  if (!fecha) return "Sin fecha";

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${fecha}T00:00:00`));
};

export const TareaCard = ({ tarea }: TareaCardProps) => {
  return (
    <article className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1.5">
          <h3 className="text-base font-semibold leading-tight text-slate-900">
            {tarea.titulo}
          </h3>
          <p className="text-sm leading-relaxed text-slate-500">
            {tarea.descripcion}
          </p>
        </div>

        <button
          type="button"
          aria-label={`Opciones de ${tarea.titulo}`}
          className="shrink-0 rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <MoreVertical className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-[auto_minmax(0,1fr)_9rem] items-center gap-4">
        <div
          className={`inline-flex h-8 min-w-16 items-center justify-center rounded-full px-4 text-sm font-medium capitalize ${
            coloresPrioridad[tarea.prioridad]
          }`}
        >
          {tarea.prioridad}
        </div>

        <div className="flex min-w-0 items-center gap-2 text-sm text-slate-500">
          <CalendarDays className="size-5" aria-hidden="true" />
          <span className="truncate">{formatearFecha(tarea.fecha_limite)}</span>
        </div>

        <div className="min-w-0">
          <AppSelect
            opciones={prioridadOpciones}
            etiqueta="Cambiar prioridad"
            defaultValue={tarea.prioridad}
            className="h-9 rounded-lg border-slate-300 bg-white px-3 text-sm shadow-none focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
            placeholder="Prioridad"
          />
        </div>
      </div>
    </article>
  );
};
