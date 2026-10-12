import { AppButton } from "@/components/atomos/buttons/AppButton";
import { useForm } from "react-hook-form";
import type { CrearTareaPayload, MensajeResult, Tarea } from "../types/tarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearTareaSchema } from "../esquemas/tareaSchema";
import { useState } from "react";
import { AppMensaje } from "@/components/atomos/feedback/AppMensaje";
import { ZonaAdjuntos } from "./ZonaAdjuntos";

type FormularioTareaProps = {
  modo: "crear" | "editar";
  cerrarModal(): void;
  añadirTareaCreada(tarea: Tarea): void;
};

export const FormularioTarea = ({
  modo,
  cerrarModal,
  añadirTareaCreada,
}: FormularioTareaProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(crearTareaSchema),
    mode: "onChange",
  });
  const titulo = modo === "crear" ? "Nueva Tarea" : "Editar Tarea";
  const textoBoton = modo === "crear" ? "Crear Tarea" : "Guardar cambios";
  const [mensajeResultado, setMensajeResultado] =
    useState<MensajeResult | null>(null);
  const [archivos, setArchivos] = useState<File[]>([]);

  const subirAdjuntos = async (
    tareaId: number,
    archivos: File[],
  ): Promise<string[]> => {
    const archivosFallidos: string[] = [];

    for (const archivo of archivos) {
      const datosArchivo = new FormData();

      datosArchivo.append("archivo", archivo);

      try {
        const respuesta = await fetch(`/api/tareas/${tareaId}/adjuntos`, {
          method: "POST",
          body: datosArchivo,
        });

        if (!respuesta.ok) {
          archivosFallidos.push(archivo.name);
        }
      } catch (error) {
        console.error(`Error al subir ${archivo.name}`, error);
        archivosFallidos.push(archivo.name);
      }
    }

    return archivosFallidos;
  };

  const enviarFormulario = async (datos: CrearTareaPayload): Promise<void> => {
    const respuesta = await fetch("/api/tareas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (!respuesta.ok) {
      setMensajeResultado({
        tipo: "error",
        mensaje: "No se ha podido crear la tarea",
      });
      setTimeout(() => {
        setMensajeResultado(null);
      }, 3000);

      return;
    }

    const tareaCreada: Tarea = await respuesta.json();
    añadirTareaCreada(tareaCreada);

    const archivosFallidos = await subirAdjuntos(tareaCreada.id, archivos);

    if (archivosFallidos.length > 0) {
      const cantidad = archivosFallidos.length;

      setMensajeResultado({
        tipo: "info",
        mensaje: `Tarea creada. ${cantidad} ${
          cantidad === 1 ? "archivo no pudo" : "archivos no pudieron"
        } subirse.`,
      });
    } else {
      setMensajeResultado({
        tipo: "exito",
        mensaje: "Tarea creada correctamente",
      });
    }

    setTimeout(() => {
      cerrarModal();
    }, 3000);
  };

  const archivosAdjuntados = (adjuntados: File[]): void => {
    setArchivos((anteriores) => [...anteriores, ...adjuntados]);
  };

  const eliminarArchivo = (indice: number): void => {
    setArchivos((anteriores) =>
      anteriores.filter((_, posicion) => posicion !== indice),
    );
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
        {errors.titulo && (
          <div className="text-red-500 flex w-fit bg-red-50">
            {errors.titulo.message}
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

        {errors.descripcion && (
          <div className="text-red-500 flex w-fit bg-red-50">
            {errors.descripcion.message}
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
            <option value="bloqueada">Bloqueada</option>
            <option value="terminada">Terminada</option>
          </select>

          {errors.estado && (
            <div className="text-red-500 flex w-fit bg-red-50">
              {errors.estado.message}
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

          {errors.prioridad && (
            <div className="text-red-500 flex w-fit bg-red-50">
              {errors.prioridad.message}
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
      <ZonaAdjuntos
        archivos={archivos}
        archivosAdjuntados={archivosAdjuntados}
        eliminarArchivo={eliminarArchivo}
      />

      <div className="flex justify-end gap-3 pt-2">
        <AppButton
          texto="Cancelar"
          colorFondo="neutral"
          colorTexto="negro"
          onClick={cerrarModal}
        />

        <AppButton
          texto={isSubmitting ? "Creando..." : textoBoton}
          type="submit"
          disabled={!isValid || isSubmitting}
        />
      </div>

      <div>
        {mensajeResultado && (
          <AppMensaje
            tipo={mensajeResultado.tipo}
            mensaje={mensajeResultado.mensaje}
          />
        )}
      </div>
    </form>
  );
};
