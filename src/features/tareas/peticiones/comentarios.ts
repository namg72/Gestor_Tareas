import type { Comentario } from "../types/comentarios";

export const crearComentario = async (
  tareaId: number,
  contenido: string,
): Promise<Comentario> => {
  const response = await fetch(`/api/tareas/${tareaId}/comentarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contenido }),
  });

  if (!response.ok) {
    throw new Error("No se pudo publicar el comentario");
  }

  return response.json();
};

export const actualizarComentario = async (
  comentarioId: number,
  contenido: string,
): Promise<Comentario> => {
  const response = await fetch(`/api/comentarios/${comentarioId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contenido }),
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar el comentario");
  }

  return response.json();
};

export const borrarComentario = async (comentarioId: number): Promise<void> => {
  const response = await fetch(`/api/comentarios/${comentarioId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("No se pudo borrar el comentario");
  }
};
