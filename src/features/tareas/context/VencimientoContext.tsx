"use client";

import { createContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Tarea } from "../types/tarea";

type VencimientosContextType = {
  tareasAVencer: Tarea[];
  actualizarVencimientos(tareas: Tarea[]): void;
};

export const VencimientosContext =
  createContext<VencimientosContextType | null>(null);

export const VencimientosProvider = ({ children }: { children: ReactNode }) => {
  const [tareasAVencer, setTareasAVencer] = useState<Tarea[]>([]);
  const valorContexto = useMemo(
    () => ({ tareasAVencer, actualizarVencimientos: setTareasAVencer }),
    [tareasAVencer],
  );

  return (
    <VencimientosContext.Provider value={valorContexto}>
      {children}
    </VencimientosContext.Provider>
  );
};
