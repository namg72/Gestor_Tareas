import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppButtonProps = Omit<
  ComponentProps<typeof Button>,
  "variant" | "children"
> & {
  texto: string;
  colorFondo?: "primary" | "neutral" | "danger" | "success";
  colorTexto?: "blanco" | "negro";
};

const estilosFondo = {
  primary: "bg-blue-600 hover:bg-blue-700",
  neutral: "bg-gray-200 hover:bg-gray-300",
  danger: "bg-red-600 hover:bg-red-700",
  success: "bg-green-600 hover:bg-green-700",
};

const estilosTexto = {
  blanco: "text-white",
  negro: "text-black",
};

export function AppButton({
  texto,
  colorFondo = "primary",
  colorTexto,
  className,
  type = "button",
  ...props
}: AppButtonProps) {
  const colorLetra =
    colorTexto ?? (colorFondo === "neutral" ? "negro" : "blanco");

  return (
    <Button
      {...props}
      type={type}
      className={cn(
        estilosFondo[colorFondo],
        estilosTexto[colorLetra],
        "h-auto px-4 py-2",
        className,
      )}
    >
      {texto}
    </Button>
  );
}
