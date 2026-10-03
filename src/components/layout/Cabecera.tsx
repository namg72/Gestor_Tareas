import { AppSeparator } from "@/components/atomos/AppSeparator";

export const Cabecera = () => {
  return (
    <header className="border-b border-gray-300 pb-4">
      <div className="flex items-center gap-4">
        <p className="font-bold">Mi tablero</p>
        <AppSeparator orientation="vertical" className="h-6" />
        <p className="text-gray-700">Tu espacio para organizar el día</p>
      </div>
    </header>
  );
};
