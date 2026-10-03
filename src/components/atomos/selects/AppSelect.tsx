"use client";

import type { ComponentProps } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type OpcionSelect = {
  valor: string;
  etiqueta: string;
  deshabilitada?: boolean;
};

type AppSelectProps = Omit<
  ComponentProps<typeof Select<string>>,
  "children" | "items" | "multiple"
> & {
  opciones: OpcionSelect[];
  etiqueta: string;
  placeholder?: string;
  className?: string;
};

export function AppSelect({
  opciones,
  etiqueta,
  placeholder = "Selecciona una opción",
  className,
  ...props
}: AppSelectProps) {
  const items = opciones.map((opcion) => ({
    value: opcion.valor,
    label: opcion.etiqueta,
  }));

  return (
    <Select<string> {...props} items={items}>
      <SelectTrigger
        aria-label={etiqueta}
        className={cn("w-full border border-gray-400", className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {opciones.map((opcion) => (
          <SelectItem
            key={opcion.valor}
            value={opcion.valor}
            disabled={opcion.deshabilitada}
          >
            {opcion.etiqueta}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
