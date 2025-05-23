"use client";

import { useState, ChangeEvent, DragEvent } from "react";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  loading: boolean;
}

export default function ImageUpload({
  onImageUpload,
  loading,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPreview(URL.createObjectURL(file));
      onImageUpload(file);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      setPreview(URL.createObjectURL(file));
      onImageUpload(file);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      className="mt-8 flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors duration-200"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        id="file-upload"
        name="file-upload"
        type="file"
        className="sr-only"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
      />
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-full"
      >
        {preview ? (
          <div className="relative w-48 h-48 mb-4">
            <img
              src={preview}
              alt="Vista previa de la imagen"
              className="object-contain w-full h-full rounded"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <span className="text-white text-lg">Cambiar imagen</span>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-1 text-sm text-gray-600">
              <span className="font-semibold">
                Arrastra y suelta una imagen aquí
              </span>{" "}
              o haz click para seleccionarla
            </p>
            <p className="text-xs text-gray-500">JPG, PNG, GIF</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => document.getElementById("file-upload")?.click()}
          className="mt-4 px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Seleccionar Imagen"}
        </button>
      </label>
    </div>
  );
}
