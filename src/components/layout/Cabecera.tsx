"use client";
import { PanelsTopLeft } from "lucide-react";
import { AppSeparator } from "@/components/atomos/AppSeparator";
import { AvisoVencimientos } from "../moleculas/avisos/AvisoVencimientos";
import { useContext } from "react";
import { VencimientosContext } from "@/features/tareas/context/VencimientoContext";

export const Cabecera = () => {
  const contextoVencimientos = useContext(VencimientosContext);
  const tareasAVencer = contextoVencimientos?.tareasAVencer ?? [];
  return (
    <header className="shrink-0 border-b border-gray-300 pb-4">
      <div className="flex items-center gap-4">
        <div className="flex shrink-0 items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <PanelsTopLeft aria-hidden="true" className="size-5" />
          </span>
          <p className="text-lg font-bold tracking-tight text-gray-900">
            Mi tablero
          </p>
        </div>
        <AppSeparator orientation="vertical" className="h-6" />
        <p className="text-gray-700">Tu espacio para organizar el día</p>
        <AvisoVencimientos vencimientos={[]} tareasAVencer={tareasAVencer} />
      </div>
    </header>
  );
};
