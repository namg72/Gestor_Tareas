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
  return (
    <div
      className="flex min-h-0 min-w-0 flex-col gap-4 rounded-lg bg-gray-200 p-4 shadow"
      aria-label={titulo}
      onDragOver={(evento) => {
        if (!evento.dataTransfer.types.includes("application/x-tablero-tarea")) return;
        evento.preventDefault();
        evento.dataTransfer.dropEffect = "move";
      }}
      onDrop={(evento) => {
        if (!evento.dataTransfer.types.includes("application/x-tablero-tarea")) return;
        evento.preventDefault();
        const id = Number(evento.dataTransfer.getData("application/x-tablero-tarea"));
        if (Number.isSafeInteger(id) && id > 0) void moverTarea(id, estado);
      }}
    >
      <div className="flex w-full shrink-0 items-center justify-between py-1">
        <div className="flex items-center gap-2 ">
          <div
            aria-hidden="true"
            className={`size-3 shrink-0 rounded-full ${colores[color]}`}
          />
          {titulo}
        </div>
        <div>{tareas.length}</div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
        {tareas.map((tarea) => {
          return (
            <TareaCard
              key={tarea.id}
              tarea={tarea}
              eliminarTarea={eliminarTarea}
              actualizarListaTareas={actualizarListaTareas}
            />
          );
        })}
      </div>
    </div>
  );
};
