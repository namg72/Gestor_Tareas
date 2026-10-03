"use strict";

const tareasEjemplo = [
  {
    titulo: "Diseñar las columnas del tablero",
    descripcion: "Mostrar las columnas Pendiente, En curso y Terminada.",
    estado: "pendiente",
    prioridad: "alta",
    fecha_limite: "2026-10-10",
  },
  {
    titulo: "Practicar consultas con Sequelize",
    descripcion: "Consultar las tareas guardadas en MySQL desde el servidor.",
    estado: "en_curso",
    prioridad: "media",
    fecha_limite: "2026-10-08",
  },
  {
    titulo: "Preparar la base de datos",
    descripcion: "Crear el contenedor de MySQL y aplicar las migraciones.",
    estado: "terminada",
    prioridad: "baja",
    fecha_limite: null,
  },
];

module.exports = {
  async up(queryInterface) {
    const ahora = new Date();

    await queryInterface.bulkInsert(
      "tareas",
      tareasEjemplo.map((tarea) => ({
        ...tarea,
        creada_en: ahora,
        actualizada_en: ahora,
      })),
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tareas", {
      [Sequelize.Op.or]: tareasEjemplo.map((tarea) => ({
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
      })),
    });
  },
};
