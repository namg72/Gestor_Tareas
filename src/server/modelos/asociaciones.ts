import { Tarea } from "./Tarea";
import { Adjunto } from "./Adjunto";

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
