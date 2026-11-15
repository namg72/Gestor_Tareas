export const formatFecha = (fecha: string): string => {
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}-${mes}-${anio}`;
};
