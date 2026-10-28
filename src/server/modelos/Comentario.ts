import { DataTypes, Model } from "sequelize";
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import { conexion } from "../db/conexion";

export class Comentario extends Model<
  InferAttributes<Comentario>,
  InferCreationAttributes<Comentario>
> {
  declare id: CreationOptional<number>;
  declare tarea_id: number;
  declare contenido: string;
  declare creado_en: CreationOptional<Date>;
  declare actualizado_en: Date | null;
}

Comentario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tarea_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tareas",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    contenido: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    actualizado_en: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: conexion,
    tableName: "comentarios",
    timestamps: true,
    createdAt: "creado_en",
    updatedAt: false,
  },
);
