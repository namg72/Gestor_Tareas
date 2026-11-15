"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tareas", "posicion", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 2147483647,
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query("ALTER TABLE tareas DROP COLUMN posicion");
  },
};
