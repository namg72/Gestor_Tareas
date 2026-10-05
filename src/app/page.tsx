import { BarraTareas } from "@/features/tareas/componentes/BarraTareas";
import { TableroTareas } from "@/features/tareas/componentes/TableroTareas";

export default function Home() {
  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <BarraTareas />
      <TableroTareas />
    </main>
  );
}
