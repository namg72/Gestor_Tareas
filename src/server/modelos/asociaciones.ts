import { Tarea } from "./Tarea";
import { Adjunto } from "./Adjunto";
import { Comentario } from "./Comentario";

Tarea.hasMany(Adjunto, {
  foreignKey: "tarea_id",
  as: "adjuntos",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Adjunto.belongsTo(Tarea, {
  foreignKey: "tarea_id",
  as: "tarea",
});

Tarea.hasMany(Comentario, {
  foreignKey: "tarea_id",
  as: "comentarios",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Comentario.belongsTo(Tarea, {
  foreignKey: "tarea_id",
  as: "tarea",
});
