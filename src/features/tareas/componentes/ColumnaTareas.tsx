import { useEffect, useState } from "react";
import type { DestinoTarea, Tarea } from "../types/tarea";
import { TareaCard } from "./tareaCard";

const colores = {
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
};

type ColumnaTareasProps = {
  titulo: string;
  estado: Tarea["estado"];
  tareas: Tarea[];
  color: keyof typeof colores;
  moverTarea: (id: number, destino: DestinoTarea) => Promise<void>;
  eliminarTarea: (id: number) => Promise<void>;
  actualizarListaTareas: (tarea: Tarea) => void;
};

type Hueco = Pick<DestinoTarea, "referenciaId" | "lado">;

const localizarHueco = (columna: HTMLElement, altura: number): Hueco => {
  const filas = Array.from(columna.querySelectorAll<HTMLElement>("[data-tarea-orden]"));
  for (const fila of filas) {
    const rect = fila.getBoundingClientRect();
    if (altura <= rect.bottom) {
      return {
        referenciaId: Number(fila.dataset.tareaOrden),
        lado: altura < rect.top + rect.height / 2 ? "antes" : "despues",
      };
    }
  }
  const ultima = filas.at(-1);
  return {
    referenciaId: ultima ? Number(ultima.dataset.tareaOrden) : null,
    lado: "despues",
  };
};

export const ColumnaTareas = ({
  titulo,
  estado,
  tareas,
  color,
  moverTarea,
  eliminarTarea,
  actualizarListaTareas,
}: ColumnaTareasProps) => {
  const [hueco, setHueco] = useState<Hueco | null>(null);
  const recibiendoTarea = hueco !== null;

  useEffect(() => {
    if (!recibiendoTarea) return;

    const bajarColumna = () => setHueco(null);
    window.addEventListener("dragend", bajarColumna);
    return () => window.removeEventListener("dragend", bajarColumna);
  }, [recibiendoTarea]);

  return (
    <div
      className="flex min-h-0 min-w-0 flex-col"
      aria-label={titulo}
      onDragOver={(evento) => {
        if (!evento.dataTransfer.types.includes("application/x-tablero-tarea")) return;
        evento.preventDefault();
        evento.dataTransfer.dropEffect = "move";
        const nuevo = localizarHueco(evento.currentTarget, evento.clientY);
        setHueco((actual) =>
          actual?.referenciaId === nuevo.referenciaId && actual?.lado === nuevo.lado
            ? actual
            : nuevo,
        );
      }}
      onDragLeave={(evento) => {
        const siguiente = evento.relatedTarget;
        if (siguiente instanceof Node && evento.currentTarget.contains(siguiente)) {
          return;
        }
        setHueco(null);
      }}
      onDrop={(evento) => {
        if (!evento.dataTransfer.types.includes("application/x-tablero-tarea")) return;
        evento.preventDefault();
        const destino = localizarHueco(evento.currentTarget, evento.clientY);
        setHueco(null);
        const id = Number(evento.dataTransfer.getData("application/x-tablero-tarea"));
        if (Number.isSafeInteger(id) && id > 0 && id !== destino.referenciaId) {
          void moverTarea(id, { estado, ...destino });
        }
      }}
    >
      <div
        className={`flex min-h-0 flex-1 flex-col gap-4 rounded-lg bg-gray-200 p-4 shadow motion-safe:transition-transform motion-safe:duration-[180ms] motion-safe:ease-out ${recibiendoTarea ? "motion-safe:-translate-y-1" : ""}`}
      >
        <div className="flex w-full shrink-0 items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className={`size-3 shrink-0 rounded-full ${colores[color]}`}
            />
            {titulo}
          </div>
          <div>{tareas.length}</div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
          {hueco?.referenciaId === null && (
            <div aria-hidden="true" data-indicador-insercion className="h-1 shrink-0 rounded bg-blue-600" />
          )}
          {tareas.map((tarea) => (
            <div key={tarea.id} data-tarea-orden={tarea.id} className="relative shrink-0">
              <TareaCard
                tarea={tarea}
                eliminarTarea={eliminarTarea}
                actualizarListaTareas={actualizarListaTareas}
              />
              {hueco?.referenciaId === tarea.id && (
                <div
                  aria-hidden="true"
                  data-indicador-insercion
                  className={`pointer-events-none absolute inset-x-0 z-10 h-1 rounded bg-blue-600 ${hueco.lado === "antes" ? "top-0" : "bottom-0"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
