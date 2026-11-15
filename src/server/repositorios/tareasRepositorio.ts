import type {
  ActualizarTareaPayload,
  CrearTareaPayload,
  DestinoTarea,
} from "@/features/tareas/types/tarea";
import { POSICION_FINAL } from "@/features/tareas/types/tarea";
import { Transaction } from "sequelize";
import { conexion } from "../db/conexion";
import { Adjunto, Comentario, Tarea } from "../modelos";

export const obtenerTareas = async (): Promise<Tarea[]> => {
  return await Tarea.findAll({ order: [["posicion", "ASC"], ["id", "ASC"]] });
};
export const obtenerTareasbyId = async (id: number): Promise<Tarea | null> => {
  return await Tarea.findByPk(id, {
    include: [
      {
        model: Adjunto,
        as: "adjuntos",
      },
      {
        model: Comentario,
        as: "comentarios",
      },
    ],
  });
};

export const agregarTarea = async (
  payload: CrearTareaPayload,
): Promise<Tarea> => {
  const tareaCreada = await Tarea.create(payload);

  return tareaCreada;
};

export const eliminarTareaPorId = async (id: number): Promise<number> => {
  return await Tarea.destroy({
    where: { id },
  });
};

export const actualizarTareaPorId = async (
  id: number,
  payload: ActualizarTareaPayload,
): Promise<Tarea | null> => {
  const tareaAActualizar = await Tarea.findByPk(id);

  if (!tareaAActualizar) return null;

  const cambiaEstado = payload.estado && payload.estado !== tareaAActualizar.estado;
  await tareaAActualizar.update({
    ...payload,
    posicion: cambiaEstado ? POSICION_FINAL : tareaAActualizar.posicion,
  }, { fields: cambiaEstado
    ? ["titulo", "descripcion", "estado", "prioridad", "fecha_limite", "posicion"]
    : ["titulo", "descripcion", "estado", "prioridad", "fecha_limite"] });

  return tareaAActualizar;
};

export const moverTareaPorId = async (id: number, destino: DestinoTarea) => {
  const sqlite = conexion.getDialect() === "sqlite";
  return conexion.transaction(sqlite ? { type: Transaction.TYPES.IMMEDIATE } : {}, async (transaction) => {
    const tarea = await Tarea.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!tarea) return null;

    const columna = await Tarea.findAll({
      where: { estado: destino.estado },
      order: [["posicion", "ASC"], ["id", "ASC"]],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    const ordenadas = columna.filter((item) => item.id !== id);
    let indice = ordenadas.length;
    if (destino.referenciaId !== null) {
      const referencia = ordenadas.findIndex((item) => item.id === destino.referenciaId);
      if (referencia < 0) return null;
      indice = referencia + Number(destino.lado === "despues");
    }
    ordenadas.splice(indice, 0, tarea);

    for (const [posicion, item] of ordenadas.entries()) {
      if (item.posicion !== posicion || item.estado !== destino.estado) {
        await item.update({ posicion, estado: destino.estado }, { transaction });
      }
    }
    return ordenadas.map(({ id, estado, posicion }) => ({ id, estado, posicion }));
  });
};
