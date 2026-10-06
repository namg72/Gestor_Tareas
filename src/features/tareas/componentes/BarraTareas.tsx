import { Search } from "lucide-react";
import { AppInput } from "@/components/atomos/inputs/AppInput";
import { AppSelect } from "@/components/atomos/selects/AppSelect";
import { AppButton } from "@/components/atomos/buttons/AppButton";

export const estadoOpciones = [
  { valor: "todos", etiqueta: "Todos los estados" },
  { valor: "pendiente", etiqueta: "Pendiente" },
  { valor: "en_curso", etiqueta: "En curso" },
  { valor: "terminada", etiqueta: "Terminada" },
];

export const prioridadOpciones = [
  { valor: "todas", etiqueta: "Todas las prioridades" },
  { valor: "alta", etiqueta: "Alta" },
  { valor: "media", etiqueta: "Media" },
  { valor: "baja", etiqueta: "Baja" },
];

export type barraTareasProps = {
  filtrarBusqueda(texto: string): void;
  cambiarEstado(texto: string): void;
  cambiarPrioridad(texto: string): void;
};

export const BarraTareas = ({
  filtrarBusqueda,
  cambiarEstado,
  cambiarPrioridad,
}: barraTareasProps) => {
  return (
    <section
      aria-labelledby="titulo-tareas"
      className="shrink-0 space-y-6 py-6 sm:py-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1
            id="titulo-tareas"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Mis tareas
          </h1>
          <p className="text-sm text-gray-500 sm:text-base">
            Gestión de tareas
          </p>
        </div>
        <AppButton
          texto="Nueva tarea"
          colorFondo="primary"
          className="h-11 w-full rounded-xl px-5 font-semibold shadow-sm sm:w-auto"
        />
      </div>
      <div className="flex gap-4">
        <div className="min-w-0 flex-3">
          <AppInput
            icono={<Search />}
            type="search"
            aria-label="Buscar tareas"
            placeholder="Buscar tareas..."
            className="h-11 rounded-xl border-gray-200 bg-white pr-4 shadow-sm placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
            onChange={(e) => filtrarBusqueda(e.target.value)}
          />
        </div>
        <div className="flex min-w-0 flex-2 gap-4">
          <AppSelect
            opciones={estadoOpciones}
            etiqueta="Filtrar por estado"
            defaultValue="todos"
            className="min-w-0 flex-1 rounded-xl border-gray-200 bg-white px-3 shadow-sm focus-visible:border-blue-500 focus-visible:ring-blue-500/20 data-[size=default]:h-11"
            placeholder="Todos los estados"
            onValueChange={(valor) => cambiarEstado(valor!)}
          />
          <AppSelect
            opciones={prioridadOpciones}
            etiqueta="Filtrar por prioridad"
            defaultValue="todas"
            className="min-w-0 flex-1 rounded-xl border-gray-200 bg-white px-3 shadow-sm focus-visible:border-blue-500 focus-visible:ring-blue-500/20 data-[size=default]:h-11"
            placeholder="Todas las prioridades"
            onValueChange={(valor) => cambiarPrioridad(valor!)}
          />
        </div>
      </div>
    </section>
  );
};
