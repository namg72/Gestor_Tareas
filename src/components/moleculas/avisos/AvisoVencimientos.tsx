import { VencimientoType } from "@/features/tareas/types/vencimientos";
import { BellIcon } from "lucide-react";
import { Tarea } from "@/features/tareas/types/tarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { formatFecha } from "@/features/tareas/utils/formatFecha";

type AvisoVencimientoProps = {
  vencimientos: VencimientoType[];
  tareasAVencer: Tarea[];
};

export const AvisoVencimientos = ({
  vencimientos,
  tareasAVencer,
}: AvisoVencimientoProps) => {
  tareasAVencer = tareasAVencer.sort((a, b) => {
    const fechaA = a.fecha_limite ?? "";
    const fechaB = b.fecha_limite ?? "";
    return fechaA.localeCompare(fechaB);
  });
  return (
    <Popover>
      <PopoverTrigger
        className="ml-auto flex p-2 items-center shrink-0  border shadow-l rounded-2xl justify-end gap-2 cursor-pointer"
        title={
          vencimientos.length === 0 ? "No hay próximos vencimientos" : undefined
        }
      >
        <BellIcon size={24} />
        <p>Próximos vencimientos</p>
        {tareasAVencer.length > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {tareasAVencer.length}
          </span>
        )}

        {vencimientos.length > 0 && (
          <div className="grid size-5 place-items-center rounded-full bg-red-600 text-xs font-semibold text-white">
            {vencimientos.length}
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent>
        <ul>
          {tareasAVencer.map((tarea) => {
            if (!tarea.fecha_limite) return null;

            const hoy = new Date();
            const inicioDeHoy = Date.UTC(
              hoy.getFullYear(),
              hoy.getMonth(),
              hoy.getDate(),
            );
            const inicioDelVencimiento = Date.parse(
              `${tarea.fecha_limite}T00:00:00Z`,
            );

            const diasRestantes =
              (inicioDelVencimiento - inicioDeHoy) / 86_400_000;
            let colorFecha = "bg-yellow-500";

            if (diasRestantes <= 1) {
              colorFecha = "bg-red-500 ";
            } else if (diasRestantes <= 3) {
              colorFecha = "bg-orange-500 ";
            }
            return (
              <li key={tarea.id} className="flex gap-2 justify-between mb-2">
                <p>{tarea.titulo}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs text-white font-bold ${colorFecha}`}
                >
                  {formatFecha(tarea.fecha_limite)}
                </span>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
};
