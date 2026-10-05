import type { Tarea } from "../types/tarea";

const colores = {
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
};

type ColumnaTareasProps = {
  titulo: string;
  tareas: Tarea[];
  color: keyof typeof colores;
};

export const ColumnaTareas = ({
  titulo,
  tareas,
  color,
}: ColumnaTareasProps) => {
  return (
    <div className="flex min-h-0 min-w-0 flex-col gap-4 overflow-y-auto rounded-lg bg-white p-4 shadow">
      <div className="flex justify-between w-full items-center">
        <div className="flex items-center gap-2">
          <div
            aria-hidden="true"
            className={`size-3 shrink-0 rounded-full ${colores[color]}`}
          />
          {titulo}
        </div>
        <div>{tareas.length}</div>
      </div>
    </div>
  );
};
