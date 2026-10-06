"use client";
import { useEffect, useState } from "react";
import type { Tarea } from "../types/tarea";
import { ColumnaTareas } from "./ColumnaTareas";
import { BarraTareas } from "./BarraTareas";

export const TableroTareas = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [textoABuscar, setTextoABuscar] = useState<string>("");
  const [estado, setEstado] = useState<string>("todos");
  const [prioridad, setPrioridad] = useState<string>("todas");

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

  const tareasFiltradas = tareas.filter((tarea) => {
    const coincideTitulo = tarea.titulo
      .toLowerCase()
      .includes(textoABuscar.toLowerCase());

    const coincideEstado = estado === "todos" || tarea.estado === estado;

    const coincidePrioridad =
      prioridad === "todas" || tarea.prioridad === prioridad;

    return coincideTitulo && coincideEstado && coincidePrioridad;
  });
  const tareasEnCurso = tareasFiltradas.filter(
    (tarea) => tarea.estado === "en_curso",
  );
  const tareasPendientes = tareasFiltradas.filter(
    (tarea) => tarea.estado === "pendiente",
  );
  const tareasTerminadas = tareasFiltradas.filter(
    (tarea) => tarea.estado === "terminada",
  );

  const filtrarBusqueda = (texto: string): void => {
    setTextoABuscar(texto);
  };

  const cambiarEstado = (estado: string): void => {
    setEstado(estado);
  };
  const cambiarPrioridad = (prioridad: string): void => {
    setPrioridad(prioridad);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <BarraTareas
          filtrarBusqueda={filtrarBusqueda}
          cambiarEstado={cambiarEstado}
          cambiarPrioridad={cambiarPrioridad}
        />
      </div>

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
    </div>
  );
};
