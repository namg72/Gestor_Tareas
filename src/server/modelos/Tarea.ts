import { DataTypes, Model } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { conexion } from "@/server/db/conexion";
import type { Estado, Prioridad } from "@/features/tareas/types/tarea";

export class Tarea extends Model<
  InferAttributes<Tarea>,
  InferCreationAttributes<Tarea>
> {
  declare id: CreationOptional<number>;
  declare titulo: string;
  declare descripcion: string | null;
  declare estado: CreationOptional<Estado>;
  declare prioridad: CreationOptional<Prioridad>;
  declare fecha_limite: string | null;
  declare creada_en: CreationOptional<Date>;
  declare actualizada_en: CreationOptional<Date>;
}

Tarea.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "en_curso", "terminada"),
      allowNull: false,
      defaultValue: "pendiente",
    },
    prioridad: {
      type: DataTypes.ENUM("baja", "media", "alta"),
      allowNull: false,
      defaultValue: "media",
    },
    fecha_limite: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    creada_en: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    actualizada_en: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: conexion,
    tableName: "tareas",
    timestamps: true,
    createdAt: "creada_en",
    updatedAt: "actualizada_en",
  },
);
