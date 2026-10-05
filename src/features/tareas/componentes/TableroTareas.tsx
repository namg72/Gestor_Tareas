import { Tarea } from "../types/tarea";
import { ColumnaTareas } from "./ColumnaTareas";

export const TableroTareas = () => {
  const tareas: Tarea[] = [];

  return (
    <div className="grid min-h-0 w-full flex-1 grid-cols-3 grid-rows-1 gap-4">
      <ColumnaTareas titulo={"Pendiente"} color={"red"} tareas={tareas} />
      <ColumnaTareas titulo={"En curso"} color={"yellow"} tareas={tareas} />
      <ColumnaTareas titulo={"Terminada"} color={"green"} tareas={tareas} />
    </div>
  );
};
