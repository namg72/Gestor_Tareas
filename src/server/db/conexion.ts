import { crearConexionMySql } from "./mysql/conexion";
import { crearConexionSqlite } from "./sqlite/conexion";

const dialecto = process.env.DB_DIALECT ?? "sqlite";

if (dialecto !== "mysql" && dialecto !== "sqlite") {
  throw new Error('DB_DIALECT debe ser "mysql" o "sqlite"');
}

export const conexion =
  dialecto === "mysql" ? crearConexionMySql() : crearConexionSqlite();
