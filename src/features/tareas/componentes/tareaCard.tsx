"use client";

import { CalendarDays } from "lucide-react";
import type { Tarea } from "../types/tarea";
import { MenuAccionesTarea } from "./MenuAccionesTarea";
import { AppAlertDialog } from "@/components/moleculas/dialogoConfirmacion/AppAlertDialog";
import { useState } from "react";
import { DetalleTarea } from "./DetalleTarea";

type TareaCardProps = {
  tarea: Tarea;
  eliminarTarea: (id: number) => Promise<void>;
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

export const TareaCard = ({ tarea, eliminarTarea }: TareaCardProps) => {
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [detalleAbierto, setDetalleAbierto] = useState(false);

  const onSolicitarEliminar = (): void => {
    setDialogoAbierto(true);
  };
  const confirmarEliminacion = async (): Promise<void> => {
    await eliminarTarea(tarea.id);
    setDialogoAbierto(false);
  };

  const abrirDetalle = (): void => {
    setDetalleAbierto(true);
  };

  const closeModal = (): void => {
    setDetalleAbierto(false);
  };

  return (
    <>
      <article
        onClick={() => abrirDetalle()}
        className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 ease-out
                  hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1.5">
            <h3 className="text-base font-semibold leading-tight text-slate-900">
              {tarea.titulo}
            </h3>
            <p className="text-sm leading-relaxed text-slate-500">
              {tarea.descripcion}
            </p>
          </div>

          <MenuAccionesTarea
            id={tarea.id}
            onSolicitarEliminar={onSolicitarEliminar}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div
            className={`inline-flex h-8 min-w-16 items-center justify-center rounded-full px-4 text-sm font-medium capitalize ${
              coloresPrioridad[tarea.prioridad]
            }`}
          >
            {tarea.prioridad}
          </div>

          <div className="flex min-w-0 items-center gap-2 text-sm text-slate-500">
            <CalendarDays className="size-5" aria-hidden="true" />
            <span className="truncate">
              {formatearFecha(tarea.fecha_limite)}
            </span>
          </div>
        </div>

        <AppAlertDialog
          abierto={dialogoAbierto}
          titulo="Eliminar tarea"
          descripcion={`¿Seguro que quieres eliminar la tarea "${tarea.titulo}"?`}
          textoConfirmar="Eliminar"
          textoCancelar="Cancelar"
          variante="peligro"
          cargando={false}
          onCambiarAbierto={setDialogoAbierto}
          onConfirmar={confirmarEliminacion}
        />
      </article>
      {detalleAbierto && <DetalleTarea id={tarea.id} closeModal={closeModal} />}
    </>
  );
};
