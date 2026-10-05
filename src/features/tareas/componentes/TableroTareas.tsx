"use client";
import { useEffect, useState } from "react";
import type { Tarea } from "../types/tarea";
import { ColumnaTareas } from "./ColumnaTareas";

export const TableroTareas = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);

  useEffect(() => {
    const cargarTareas = async () => {
      try {
        const respuesta = await fetch("/api/tareas");

        if (!respuesta.ok) {
          throw new Error("Error al obtener las tareas");
        }

        const datos: Tarea[] = await respuesta.json();
        setTareas(datos);
      } catch (error) {
        console.error(error);
      }
    };

    void cargarTareas();
  }, []);

  const tareasEnCurso = tareas.filter((tarea) => tarea.estado === "en_curso");
  const tareasPendientes = tareas.filter(
    (tarea) => tarea.estado === "pendiente",
  );
  const tareasTerminadas = tareas.filter(
    (tarea) => tarea.estado === "terminada",
  );

  return (
    <div className="grid min-h-0 w-full flex-1 grid-cols-3 grid-rows-1 gap-4">
      <ColumnaTareas
        titulo={"Pendiente"}
        color={"red"}
        tareas={tareasPendientes}
      />
      <ColumnaTareas
        titulo={"En curso"}
        color={"yellow"}
        tareas={tareasEnCurso}
      />
      <ColumnaTareas
        titulo={"Terminada"}
        color={"green"}
        tareas={tareasTerminadas}
      />
    </div>
  );
};
