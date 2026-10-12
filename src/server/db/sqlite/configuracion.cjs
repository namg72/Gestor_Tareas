/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const { loadEnvConfig } = require("@next/env");

const raizProyecto = path.resolve(__dirname, "../../../..");

loadEnvConfig(raizProyecto, true, { info() {}, error: console.error });

const storage = path.resolve(
  raizProyecto,
  process.env.DB_SQLITE_STORAGE ?? "data/tablero.sqlite",
);

fs.mkdirSync(path.dirname(storage), { recursive: true });

module.exports = {
  development: {
    dialect: "sqlite",
    storage,
    logging: false,
  },
};
