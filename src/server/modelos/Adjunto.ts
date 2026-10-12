import { DataTypes, Model } from "sequelize";
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import { conexion } from "../db/conexion";

export class Adjunto extends Model<
  InferAttributes<Adjunto>,
  InferCreationAttributes<Adjunto>
> {
  declare id: CreationOptional<number>;
  declare tarea_id: number;
  declare nombre_original: string;
  declare ruta_archivo: string;
  declare tipo_mime: string;
  declare tamano_bytes: number;
  declare creado_en: CreationOptional<Date>;
}

Adjunto.init(
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
    nombre_original: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ruta_archivo: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    tipo_mime: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    tamano_bytes: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: conexion,
    tableName: "adjuntos",
    timestamps: true,
    createdAt: "creado_en",
    updatedAt: false,
  },
);
