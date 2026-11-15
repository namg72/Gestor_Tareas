export const calcularDiasRestantes = (fechaLimite: string): number => {
  const hoy = new Date();
  const inicioDeHoy = Date.UTC(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate(),
  );
  const inicioDelVencimiento = Date.parse(`${fechaLimite}T00:00:00Z`);

  return (inicioDelVencimiento - inicioDeHoy) / 86_400_000;
};
