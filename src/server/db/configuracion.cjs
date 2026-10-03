const path = require("node:path");
const { loadEnvConfig } = require("@next/env");

const raizProyecto = path.resolve(__dirname, "../../..");

loadEnvConfig(raizProyecto, true, { info() {}, error: console.error });

const nombreBaseDatos = process.env.DB_NAME;
const usuario = process.env.DB_USER;
const contrasena = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const puertoConfigurado = process.env.DB_PORT;

if (!nombreBaseDatos) {
  throw new Error("Falta la variable DB_NAME");
}

if (!usuario) {
  throw new Error("Falta la variable DB_USER");
}

if (!contrasena) {
  throw new Error("Falta la variable DB_PASSWORD");
}

if (!host) {
  throw new Error("Falta la variable DB_HOST");
}

if (!puertoConfigurado) {
  throw new Error("Falta la variable DB_PORT");
}

const puerto = Number(puertoConfigurado);

if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
  throw new Error("DB_PORT debe ser un número entero entre 1 y 65535");
}

module.exports = {
  development: {
    database: nombreBaseDatos,
    username: usuario,
    password: contrasena,
    host,
    port: puerto,
    dialect: "mysql",
    logging: false,
  },
};
