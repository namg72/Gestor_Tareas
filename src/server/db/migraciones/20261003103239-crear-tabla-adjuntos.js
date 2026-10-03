"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("adjuntos", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tarea_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tareas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      nombre_original: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      ruta_archivo: {
        type: Sequelize.STRING(1024),
        allowNull: false,
      },
      tipo_mime: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      tamano_bytes: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("adjuntos");
  },
};
