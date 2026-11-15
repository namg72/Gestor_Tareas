import { useEffect, useState } from "react";
import type { Tarea } from "../types/tarea";
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
  moverTarea: (id: number, estado: Tarea["estado"]) => Promise<void>;
  eliminarTarea: (id: number) => Promise<void>;
  actualizarListaTareas: (tarea: Tarea) => void;
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
  const [recibiendoTarea, setRecibiendoTarea] = useState(false);

  useEffect(() => {
    if (!recibiendoTarea) return;

    const bajarColumna = () => setRecibiendoTarea(false);
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
        setRecibiendoTarea(true);
      }}
      onDragLeave={(evento) => {
        const siguiente = evento.relatedTarget;
        if (siguiente instanceof Node && evento.currentTarget.contains(siguiente)) {
          return;
        }
        setRecibiendoTarea(false);
      }}
      onDrop={(evento) => {
        if (!evento.dataTransfer.types.includes("application/x-tablero-tarea")) return;
        evento.preventDefault();
        setRecibiendoTarea(false);
        const id = Number(evento.dataTransfer.getData("application/x-tablero-tarea"));
        if (Number.isSafeInteger(id) && id > 0) void moverTarea(id, estado);
      }}
    >
      <div
        className={`flex min-h-0 flex-1 flex-col gap-4 rounded-lg bg-gray-200 p-4 shadow motion-safe:transition-transform motion-safe:duration-[180ms] motion-safe:ease-out ${recibiendoTarea ? "pointer-events-none motion-safe:-translate-y-1" : ""}`}
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
          {tareas.map((tarea) => (
            <TareaCard
              key={tarea.id}
              tarea={tarea}
              eliminarTarea={eliminarTarea}
              actualizarListaTareas={actualizarListaTareas}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
