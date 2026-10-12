"use client";

import { FileText, Upload, X } from "lucide-react";
import { useId, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";

type ZonaAdjuntosProps = {
  archivos: File[];
  archivosAdjuntados(archivos: File[]): void;
  eliminarArchivo(indice: number): void;
};

const TAMANO_MAXIMO = 5 * 1024 * 1024;
const NUMERO_MAXIMO_ARCHIVOS = 5;
const TIPOS_PERMITIDOS = [
  "application/pdf",
  "text/plain",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const ZonaAdjuntos = ({
  archivos,
  archivosAdjuntados,
  eliminarArchivo,
}: ZonaAdjuntosProps) => {
  const inputId = useId();
  const [estaArrastrando, setEstaArrastrando] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const procesarArchivos = (nuevosArchivos: File[]): void => {
    setMensajeError(null);

    if (archivos.length + nuevosArchivos.length > NUMERO_MAXIMO_ARCHIVOS) {
      setMensajeError("Puedes adjuntar un máximo de 5 archivos.");
      return;
    }

    const archivoNoPermitido = nuevosArchivos.find(
      (archivo) => !TIPOS_PERMITIDOS.includes(archivo.type),
    );

    if (archivoNoPermitido) {
      setMensajeError(`El tipo de ${archivoNoPermitido.name} no está permitido.`);
      return;
    }

    const archivoDemasiadoGrande = nuevosArchivos.find(
      (archivo) => archivo.size > TAMANO_MAXIMO,
    );

    if (archivoDemasiadoGrande) {
      setMensajeError(`${archivoDemasiadoGrande.name} supera el límite de 5 MB.`);
      return;
    }

    archivosAdjuntados(nuevosArchivos);
  };

  const seleccionarArchivos = (event: ChangeEvent<HTMLInputElement>): void => {
    if (!event.target.files) return;

    procesarArchivos(Array.from(event.target.files));
    event.target.value = "";
  };

  const permitirArrastre = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setEstaArrastrando(true);
  };

  const salirDeZona = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setEstaArrastrando(false);
  };

  const soltarArchivos = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setEstaArrastrando(false);
    procesarArchivos(Array.from(event.dataTransfer.files));
  };

  const convertirTamano = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      <span className="block text-sm font-medium text-gray-900">
        Adjuntar archivos
      </span>

      <div
        onDragOver={permitirArrastre}
        onDragLeave={salirDeZona}
        onDrop={soltarArchivos}
        className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          estaArrastrando
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 bg-slate-50"
        }`}
      >
        <div className="rounded-full bg-blue-100 p-3 text-blue-600">
          <Upload aria-hidden="true" className="size-6" />
        </div>

        <div>
          <p className="font-medium text-slate-800">
            {estaArrastrando
              ? "Suelta los archivos aquí"
              : "Arrastra aquí tus archivos"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            PDF, TXT, JPG, PNG o WebP. Máximo 5 MB por archivo.
          </p>
        </div>

        <label
          htmlFor={inputId}
          className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-95"
        >
          Seleccionar archivos
        </label>

        <input
          id={inputId}
          name="archivos"
          type="file"
          multiple
          accept=".pdf,.txt,.jpg,.jpeg,.png,.webp"
          className="sr-only"
          onChange={seleccionarArchivos}
        />
      </div>

      {mensajeError && (
        <p role="alert" className="text-sm text-red-600">
          {mensajeError}
        </p>
      )}

      {archivos.length > 0 && (
        <ul className="space-y-2">
          {archivos.map((archivo, indice) => (
            <li
              key={`${archivo.name}-${archivo.size}-${archivo.lastModified}`}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <FileText aria-hidden="true" className="size-5 text-slate-500" />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">
                  {archivo.name}
                </p>
                <p className="text-xs text-slate-500">
                  {convertirTamano(archivo.size)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => eliminarArchivo(indice)}
                aria-label={`Eliminar ${archivo.name}`}
                className="rounded-md p-1 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
