"use strict";

module.exports = {
  async up(queryInterface) {
    // En SQLite, Sequelize almacena ENUM como TEXT, por lo que la columna
    // ya admite "bloqueada" sin tener que reconstruir la tabla.
    await queryInterface.sequelize.query("SELECT 1");
  },

  async down(queryInterface) {
    // No hay un ENUM físico que restaurar en SQLite.
    await queryInterface.sequelize.query("SELECT 1");
  },
};
