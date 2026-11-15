import { Tarea } from "../types/tarea";

export const ProximosVencimientos = (tareas: Tarea[]): Tarea[] => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const finDelPlazo = new Date(hoy);
  finDelPlazo.setDate(finDelPlazo.getDate() + 7);

  const proximas = tareas.filter((tarea) => {
    if (tarea.estado === "terminada" || !tarea.fecha_limite) {
      return false;
    }

    const fechaLimite = new Date(`${tarea.fecha_limite}T00:00:00`);

    return fechaLimite >= hoy && fechaLimite <= finDelPlazo;
  });
  return proximas;
};
