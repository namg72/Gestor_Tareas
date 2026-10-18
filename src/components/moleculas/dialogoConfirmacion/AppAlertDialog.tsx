"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AppAlertDialogProps = {
  abierto: boolean;
  titulo: string;
  descripcion: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  cargando?: boolean;
  variante?: "normal" | "peligro";
  onCambiarAbierto(abierto: boolean): void;
  onConfirmar(): void | Promise<void>;
};

export const AppAlertDialog = ({
  abierto,
  titulo,
  descripcion,
  textoConfirmar,
  textoCancelar,
  cargando,
  variante,
  onCambiarAbierto,
  onConfirmar,
}: AppAlertDialogProps) => {
  return (
    <AlertDialog open={abierto} onOpenChange={onCambiarAbierto}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{titulo}</AlertDialogTitle>

          <AlertDialogDescription>{descripcion}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={cargando}>
            {textoCancelar}
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={cargando}
            className={
              variante === "peligro"
                ? "bg-red-600 text-white hover:bg-red-700"
                : undefined
            }
            onClick={(evento) => {
              evento.preventDefault();
              void onConfirmar();
            }}
          >
            {cargando ? "Procesando..." : textoConfirmar}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
