import { FormularioTarea } from "./FormularioTarea";

type ModalTareaProps = {
  modo: "crear" | "editar";
  abierto: boolean;
  cerrarModal(): void;
};

export const ModalTarea = ({ modo, abierto, cerrarModal }: ModalTareaProps) => {
  if (!abierto) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal"
        className="w-[90vw] rounded-2xl bg-white p-6 shadow-xl md:w-[60vw]"
      >
        <FormularioTarea cerrarModal={cerrarModal} modo={modo} />
      </div>
    </div>
  );
};
