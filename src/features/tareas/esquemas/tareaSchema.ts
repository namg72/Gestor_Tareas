import { z } from "zod";

export const crearTareaSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, "El título es obligatorio")
    .max(200, "El título no puede superar los 200 caracteres"),
  descripcion: z
    .string()
    .trim()
    .min(1, "El título es obligatorio")
    .max(255, "La descripción no puede superar los 200 caracteres"),
  estado: z.enum(["pendiente", "en_curso", "terminada"], {
    error: "Selecciona un estado",
  }),
  prioridad: z.enum(["baja", "media", "alta"], {
    error: "Selecciona un estado",
  }),
  fecha_limite: z
    .union([
      z.literal(""),
      z.iso.date({
        error: "Introduce una fecha válida",
      }),
      z.null(),
    ])
    .transform((fecha) => (fecha === "" ? null : fecha))
    .optional(),
});
