'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  
    await queryInterface.createTable("comentarios", {

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
        contenido: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
         creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
      },
       actualizado_en: {
        type: Sequelize.DATE,
        allowNull: true,
      },

    })



  },

  async down (queryInterface) {
   await queryInterface.dropTable("comentarios");
  }
};
