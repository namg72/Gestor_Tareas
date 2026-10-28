"use client";

import { useId, useState } from "react";
import { MessageSquare, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { AppButton } from "@/components/atomos/buttons/AppButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Comentario } from "../types/comentarios";

type ComentariosTareaProps = {
  comentarios: Comentario[];
  onPublicar?: (contenido: string) => Promise<void>;
  onEditar?: (id: number, contenido: string) => Promise<void>;
  onSolicitarEliminar?: (comentario: Comentario) => void;
};

const formatoFecha = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function FechaComentario({ fecha }: Readonly<{ fecha: string }>) {
  const valor = new Date(fecha);
  if (Number.isNaN(valor.getTime())) return null;
  return (
    <time dateTime={valor.toISOString()}>{formatoFecha.format(valor)}</time>
  );
}

function EditorComentario({
  inicial = "",
  textoBoton,
  onGuardar,
  onCancelar,
}: Readonly<{
  inicial?: string;
  textoBoton: string;
  onGuardar?: (contenido: string) => Promise<void>;
  onCancelar?: () => void;
}>) {
  const id = useId();
  const [contenido, setContenido] = useState(inicial);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guardar = async () => {
    if (!onGuardar || !contenido.trim() || guardando) return;
    setGuardando(true);
    setError(null);
    try {
      await onGuardar(contenido.trim());
      setContenido("");
    } catch {
      setError("No se pudo guardar el comentario. Tu texto se ha conservado.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {onCancelar ? "Editar comentario" : "Añade una nota a esta tarea"}
      </label>
      <textarea
        id={id}
        value={contenido}
        onChange={(evento) => setContenido(evento.target.value)}
        placeholder="Escribe un comentario..."
        maxLength={255}
        rows={3}
        disabled={guardando}
        className="block w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-6 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs tabular-nums text-slate-400">
          {contenido.length}/255
        </span>
        <div className="flex gap-2">
          {onCancelar && (
            <AppButton
              texto="Cancelar"
              colorFondo="neutral"
              onClick={onCancelar}
              disabled={guardando}
            />
          )}
          <AppButton
            texto={guardando ? "Guardando..." : textoBoton}
            disabled={!onGuardar || !contenido.trim() || guardando}
            onClick={() => void guardar()}
            className="rounded-lg text-sm"
          />
        </div>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function NotaComentario({
  comentario,
  onEditar,
  onSolicitarEliminar,
}: Readonly<{
  comentario: Comentario;
  onEditar?: ComentariosTareaProps["onEditar"];
  onSolicitarEliminar?: ComentariosTareaProps["onSolicitarEliminar"];
}>) {
  const [editando, setEditando] = useState(false);

  if (editando) {
    return (
      <EditorComentario
        inicial={comentario.contenido}
        textoBoton="Guardar comentario"
        onCancelar={() => setEditando(false)}
        onGuardar={
          onEditar
            ? async (contenido) => {
                await onEditar(comentario.id, contenido);
                setEditando(false);
              }
            : undefined
        }
      />
    );
  }

  return (
    <article className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          <FechaComentario fecha={comentario.creado_en} />
          {comentario.actualizado_en && (
            <span
              title={`Última edición: ${comentario.actualizado_en}`}
              className="rounded bg-slate-200/70 px-1.5 py-0.5 text-slate-600"
            >
              Editado
            </span>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Acciones del comentario"
            className="-mt-1 shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          >
            <MoreVertical aria-hidden="true" className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditando(true)}>
              <Pencil aria-hidden="true" className="size-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!onSolicitarEliminar}
              onClick={() => onSolicitarEliminar?.(comentario)}
              className="text-red-600 focus:bg-red-50 focus:text-red-700"
            >
              <Trash2 aria-hidden="true" className="size-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-700">
        {comentario.contenido}
      </p>
    </article>
  );
}

export function ComentariosTarea({
  comentarios,
  onPublicar,
  onEditar,
  onSolicitarEliminar,
}: Readonly<ComentariosTareaProps>) {
  const tituloId = useId();
  const ordenados = [...comentarios].sort(
    (a, b) => Date.parse(b.creado_en) - Date.parse(a.creado_en) || b.id - a.id,
  );

  return (
    <section aria-labelledby={tituloId} className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare aria-hidden="true" className="size-4 text-slate-500" />
        <h3 id={tituloId} className="text-base font-semibold text-slate-900">
          Comentarios
        </h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
          {comentarios.length}
        </span>
      </div>
      <EditorComentario
        textoBoton="Publicar comentario"
        onGuardar={onPublicar}
      />
      {ordenados.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500">
          Todavía no hay comentarios.
        </p>
      ) : (
        <ul className="space-y-3">
          {ordenados.map((comentario) => (
            <li key={comentario.id}>
              <NotaComentario
                comentario={comentario}
                onEditar={onEditar}
                onSolicitarEliminar={onSolicitarEliminar}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
