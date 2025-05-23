"use client"; // Esto indica que es un Client Component

import { useState } from "react";
import ImageUpload from "../components/ImageUpload";
import ImageResults from "../components/ImageResults";
import axios from "axios";

interface ImageResult {
  id: string;
  similarity: number;
  path: string; // La ruta que el backend devuelve
}

interface SearchResponse {
  results: ImageResult[];
}

export default function Home() {
  const [results, setResults] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setResults([]); // Limpiar resultados anteriores

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post<SearchResponse>(
        "http://localhost:8000/search-similar-images/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Respuesta del backend:", response.data);
      setResults(response.data.results);
    } catch (err: unknown) {
      console.error("Error al buscar imágenes similares:", err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(
            `Error del servidor: ${
              err.response.data.detail || err.response.statusText
            }`
          );
        } else if (err.request) {
          setError(
            "No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo."
          );
        } else {
          setError(`Error: ${err.message}`);
        }
      } else {
        setError("Ocurrió un error desconocido.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h1 className="text-center text-4xl font-extrabold text-gray-900">
            Buscador de Imágenes Similares
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sube una imagen y encuentra otras visualmente similares.
          </p>
        </div>
        <ImageUpload onImageUpload={handleImageUpload} loading={loading} />

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">¡Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="ml-4 text-gray-700">Buscando imágenes...</p>
          </div>
        )}

        {!loading && results.length > 0 && <ImageResults results={results} />}
      </div>
    </div>
  );
}
