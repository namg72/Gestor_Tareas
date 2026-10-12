"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tareas", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      titulo: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      estado: {
        type: Sequelize.ENUM("pendiente", "en_curso", "terminada"),
        allowNull: false,
        defaultValue: "pendiente",
      },
      prioridad: {
        type: Sequelize.ENUM("baja", "media", "alta"),
        allowNull: false,
        defaultValue: "media",
      },
      fecha_limite: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      creada_en: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      actualizada_en: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("tareas");
  },
};
