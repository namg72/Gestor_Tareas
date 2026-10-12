import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { Sequelize } from "sequelize";

export const crearConexionSqlite = (): Sequelize => {
  const rutaBaseDatos = resolve(
    process.cwd(),
    process.env.DB_SQLITE_STORAGE ?? "data/tablero.sqlite",
  );

  mkdirSync(dirname(rutaBaseDatos), { recursive: true });

  return new Sequelize({
    dialect: "sqlite",
    storage: rutaBaseDatos,
    logging: false,
  });
};
