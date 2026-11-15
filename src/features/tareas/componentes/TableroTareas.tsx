"use client";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import type { DestinoTarea, MensajeResult, Tarea } from "../types/tarea";
import { POSICION_FINAL } from "../types/tarea";
import { ColumnaTareas } from "./ColumnaTareas";
import { BarraTareas } from "./BarraTareas";
import { ModalTarea } from "./ModalTarea";
import { AppMensaje } from "@/components/atomos/feedback/AppMensaje";
import { ProximosVencimientos } from "../utils/vencimientos";
import { VencimientosContext } from "../context/VencimientoContext";

export const TableroTareas = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [textoABuscar, setTextoABuscar] = useState<string>("");
  const [estado, setEstado] = useState<string>("todos");
  const [prioridad, setPrioridad] = useState<string>("todas");
  const [añadirTareaIsVisible, setAñadirTareaIsVisible] = useState(false);
  const [avisoTarea, setAvisoTarea] = useState<MensajeResult | null>(null);
  const movimientoEnCurso = useRef(false);

  const contextVencimientos = useContext(VencimientosContext);

  const actualizarVencimientos = contextVencimientos?.actualizarVencimientos;

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

  const proximasAVencer = useMemo(() => ProximosVencimientos(tareas), [tareas]);

  useEffect(() => {
    if (actualizarVencimientos) {
      actualizarVencimientos(proximasAVencer);
    }
  }, [proximasAVencer, actualizarVencimientos]);

  const tareasFiltradas = tareas.filter((tarea) => {
    const coincideTitulo = tarea.titulo
      .toLowerCase()
      .includes(textoABuscar.toLowerCase());

    const coincideEstado = estado === "todos" || tarea.estado === estado;

    const coincidePrioridad =
      prioridad === "todas" || tarea.prioridad === prioridad;

    return coincideTitulo && coincideEstado && coincidePrioridad;
  }).sort((a, b) => a.posicion - b.posicion || a.id - b.id);
  const tareasEnCurso = tareasFiltradas.filter(
    (tarea) => tarea.estado === "en_curso",
  );
  const tareasPendientes = tareasFiltradas.filter(
    (tarea) => tarea.estado === "pendiente",
  );
  const tareasBloqueadas = tareasFiltradas.filter(
    (tarea) => tarea.estado === "bloqueada",
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
  const cerrarModal = (): void => {
    setAñadirTareaIsVisible(false);
  };

  const openModalAddNuevaTarea = (): void => {
    setAvisoTarea(null);
    setAñadirTareaIsVisible(true);
  };
  const añadirTareaCreada = (tareaCreada: Tarea): void => {
    setTareas((tareasAnteriores) => [...tareasAnteriores, tareaCreada]);
    setAvisoTarea({ tipo: "exito", mensaje: "Tarea creada correctamente" });
  };

  const eliminarTarea = async (id: number): Promise<void> => {
    const respuesta = await fetch(`/api/tareas/${id}`, {
      method: "DELETE",
    });

    if (!respuesta.ok) {
      throw new Error("No se pudo eliminar la tarea");
    }

    setTareas((tareasAnteriores) =>
      tareasAnteriores.filter((tarea) => tarea.id !== id),
    );
    setAvisoTarea({ tipo: "exito", mensaje: "Tarea borrada correctamente" });
  };

  const moverTarea = async (id: number, destino: DestinoTarea): Promise<void> => {
    if (movimientoEnCurso.current) return;

    movimientoEnCurso.current = true;
    try {
      const respuesta = await fetch(`/api/tareas/${id}/mover`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(destino),
      });
      if (!respuesta.ok) throw new Error("No se pudo mover la tarea");

      const posiciones: Pick<Tarea, "id" | "estado" | "posicion">[] =
        await respuesta.json();
      const porId = new Map(posiciones.map((posicion) => [posicion.id, posicion]));
      setTareas((anteriores) => anteriores.map((item) => {
        const posicion = porId.get(item.id);
        return posicion ? { ...item, ...posicion } : item;
      }));
      setAvisoTarea({ tipo: "exito", mensaje: "Tarea movida correctamente" });
    } catch {
      setAvisoTarea({ tipo: "error", mensaje: "No se pudo mover la tarea" });
    } finally {
      movimientoEnCurso.current = false;
    }
  };

  const actualizarListaTareas = (tarea: Tarea): void => {
    setTareas(
      (anteriores) => anteriores.map((item) => {
        if (item.id === tarea.id) {
          return {
            ...tarea,
            posicion: item.estado === tarea.estado ? item.posicion : POSICION_FINAL,
          };
        }
        return item;
      }),
    );
    setAvisoTarea({
      tipo: "exito",
      mensaje: "Tarea actualizada correctamente",
    });
  };
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-8">
      <div>
        <BarraTareas
          filtrarBusqueda={filtrarBusqueda}
          cambiarEstado={cambiarEstado}
          cambiarPrioridad={cambiarPrioridad}
          openModalAddNuevaTarea={openModalAddNuevaTarea}
        />
      </div>

      <div className="grid min-h-0 w-full flex-1 grid-cols-4 grid-rows-1 gap-4">
        <ColumnaTareas
          titulo={"Pendiente"}
          estado="pendiente"
          moverTarea={moverTarea}
          color={"red"}
          tareas={tareasPendientes}
          eliminarTarea={eliminarTarea}
          actualizarListaTareas={actualizarListaTareas}
        />
        <ColumnaTareas
          titulo={"En curso"}
          estado="en_curso"
          moverTarea={moverTarea}
          color={"yellow"}
          tareas={tareasEnCurso}
          eliminarTarea={eliminarTarea}
          actualizarListaTareas={actualizarListaTareas}
        />
        <ColumnaTareas
          titulo={"Bloqueada"}
          estado="bloqueada"
          moverTarea={moverTarea}
          color={"purple"}
          tareas={tareasBloqueadas}
          eliminarTarea={eliminarTarea}
          actualizarListaTareas={actualizarListaTareas}
        />
        <ColumnaTareas
          titulo={"Terminada"}
          estado="terminada"
          moverTarea={moverTarea}
          color={"green"}
          tareas={tareasTerminadas}
          eliminarTarea={eliminarTarea}
          actualizarListaTareas={actualizarListaTareas}
        />
      </div>
      <div className="flex justify-center">
        <ModalTarea
          modo={"crear"}
          abierto={añadirTareaIsVisible}
          cerrarModal={cerrarModal}
          añadirTareaCreada={añadirTareaCreada}
        />
      </div>
      {avisoTarea && !añadirTareaIsVisible && (
        <div
          role="status"
          className="aviso-tarea fixed bottom-6 left-6 z-40 w-[40vw] px-5"
          onAnimationEnd={(evento) => {
            if (evento.target === evento.currentTarget) setAvisoTarea(null);
          }}
        >
          <AppMensaje tipo={avisoTarea.tipo} mensaje={avisoTarea.mensaje} />
        </div>
      )}
    </div>
  );
};
