"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2 } from "lucide-react";

type MenuAccionesTareaProps = {
  id: number;
  onSolicitarEliminar: (id: number) => void;
};

export const MenuAccionesTarea = ({
  id,
  onSolicitarEliminar,
}: MenuAccionesTareaProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Abrir acciones de la tarea"
        className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
        onClick={(evento) => evento.stopPropagation()}
      >
        <MoreVertical className="size-5" aria-hidden="true" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        onClick={(evento) => evento.stopPropagation()}
      >
        <DropdownMenuItem
          onClick={() => onSolicitarEliminar(id)}
          className="text-red-600 focus:bg-red-50 focus:text-red-700"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
