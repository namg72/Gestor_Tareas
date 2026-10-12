"use client";

import type { MensajeResult } from "@/features/tareas/types/tarea";
import { cn } from "cn";
import { CircleCheck, CircleX, Info } from "lucide-react";

type MensajeProps = MensajeResult;
const configuracionMensaje = {
  exito: {
    icono: CircleCheck,
    colorFondo: "bg-green-50",
    colorTexto: "text-green-700",
    colorBorde: "border-green-200",
  },
  error: {
    icono: CircleX,
    colorFondo: "bg-red-50",
    colorTexto: "text-red-700",
    colorBorde: "border-red-200",
  },
  info: {
    icono: Info,
    colorFondo: "bg-blue-50",
    colorTexto: "text-blue-700",
    colorBorde: "border-blue-200",
  },
};

export const AppMensaje = ({ tipo, mensaje }: MensajeProps) => {
  const configuracion = configuracionMensaje[tipo];
  const Icono = configuracion.icono;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-4 py-3",
        configuracion.colorFondo,
        configuracion.colorTexto,
        configuracion.colorBorde,
      )}
    >
      <Icono className="size-5 shrink-0" aria-hidden="true" />
      {mensaje}
    </div>
  );
};
