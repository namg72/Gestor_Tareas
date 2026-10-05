"use strict";

const tareasNuevas = [
  {
    titulo: "Implementar el formulario de tareas",
    descripcion: "Crear el formulario para registrar nuevas tareas.",
    estado: "pendiente",
    prioridad: "alta",
    fecha_limite: "2026-10-14",
  },
  {
    titulo: "Validar los datos del formulario",
    descripcion: "Comprobar los campos obligatorios antes de guardar.",
    estado: "pendiente",
    prioridad: "media",
    fecha_limite: "2026-10-16",
  },
  {
    titulo: "Diseñar los filtros del tablero",
    descripcion: "Permitir filtrar las tareas por estado y prioridad.",
    estado: "en_curso",
    prioridad: "media",
    fecha_limite: "2026-10-11",
  },
  {
    titulo: "Actualizar el estado de una tarea",
    descripcion: "Conectar el selector de estado con la API.",
    estado: "en_curso",
    prioridad: "alta",
    fecha_limite: "2026-10-13",
  },
  {
    titulo: "Configurar Tailwind CSS",
    descripcion: "Preparar los estilos y componentes visuales del proyecto.",
    estado: "terminada",
    prioridad: "baja",
    fecha_limite: "2026-10-04",
  },
  {
    titulo: "Conectar el listado de tareas",
    descripcion: "Obtener las tareas desde el endpoint y mostrarlas por columnas.",
    estado: "terminada",
    prioridad: "media",
    fecha_limite: "2026-10-05",
  },
];

module.exports = {
  async up(queryInterface) {
    const ahora = new Date();

    await queryInterface.bulkInsert(
      "tareas",
      tareasNuevas.map((tarea) => ({
        ...tarea,
        creada_en: ahora,
        actualizada_en: ahora,
      })),
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tareas", {
      titulo: {
        [Sequelize.Op.in]: tareasNuevas.map((tarea) => tarea.titulo),
      },
    });
  },
};
