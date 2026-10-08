import { AppButton } from "@/components/atomos/buttons/AppButton";
import { useForm } from "react-hook-form";
import { CrearTareaPayload } from "../types/tarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearTareaSchema } from "../esquemas/tareaSchema";

type FormularioTareaProps = {
  modo: "crear" | "editar";
  cerrarModal(): void;
};

export const FormularioTarea = ({
  modo,
  cerrarModal,
}: FormularioTareaProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(crearTareaSchema),
    mode: "onChange",
  });
  const titulo = modo === "crear" ? "Nueva Tarea" : "Editar Tarea";
  const textoBoton = modo === "crear" ? "Crear Tarea" : "Guardar cambios";

  const enviarFormulario = (datos: CrearTareaPayload): void => {
    console.log(datos);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(enviarFormulario)}>
      <h2 id="titulo-modal" className="text-2xl font-semibold text-gray-900">
        {titulo}
      </h2>

      <div className="space-y-2">
        <label htmlFor="titulo" className="block text-sm font-medium">
          Título
        </label>
        <input
          {...register("titulo")}
          id="titulo"
          type="text"
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
        {errors && (
          <div className="text-red-500 flex w-fit bg-red-50">
            {errors.titulo?.message}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="descripcion" className="block text-sm font-medium">
          Descripción
        </label>
        <textarea
          {...register("descripcion")}
          id="descripcion"
          rows={4}
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2"
        />

        {errors && (
          <div className="text-red-500 flex w-fit bg-red-50">
            {errors.descripcion?.message}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="estado" className="block text-sm font-medium">
            Estado
          </label>
          <select
            {...register("estado")}
            id="estado"
            defaultValue=""
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="">Selectione ...</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_curso">En curso</option>
            <option value="terminada">Terminada</option>
          </select>

          {errors && (
            <div className="text-red-500 flex w-fit bg-red-50">
              {errors.estado?.message}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="prioridad" className="block text-sm font-medium">
            Prioridad
          </label>
          <select
            {...register("prioridad")}
            id="prioridad"
            defaultValue=""
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="">Selectione ...</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>

          {errors && (
            <div className="text-red-500 flex w-fit bg-red-50">
              {errors.prioridad?.message}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="fecha_limite" className="block text-sm font-medium">
          Fecha límite
        </label>
        <input
          {...register("fecha_limite")}
          id="fecha_limite"
          type="date"
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <AppButton
          texto="Cancelar"
          colorFondo="neutral"
          colorTexto="negro"
          onClick={cerrarModal}
        />

        <AppButton texto={textoBoton} type="submit" disabled={!isValid} />
      </div>
    </form>
  );
};
