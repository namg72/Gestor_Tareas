"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("tareas", "estado", {
      type: Sequelize.ENUM(
        "pendiente",
        "en_curso",
        "bloqueada",
        "terminada",
      ),
      allowNull: false,
      defaultValue: "pendiente",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate(
      "tareas",
      { estado: "pendiente" },
      { estado: "bloqueada" },
    );

    await queryInterface.changeColumn("tareas", "estado", {
      type: Sequelize.ENUM("pendiente", "en_curso", "terminada"),
      allowNull: false,
      defaultValue: "pendiente",
    });
  },
};
