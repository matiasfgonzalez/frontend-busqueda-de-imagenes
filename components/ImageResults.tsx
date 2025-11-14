"use client";

interface ImageResult {
  id: number;
  similarity: number;
  path: string;
  distance: number;
}

interface ImageResultsProps {
  results: ImageResult[];
}

export default function ImageResults({ results }: ImageResultsProps) {
  if (!results || results.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No se encontraron imágenes similares.
      </div>
    );
  }

  // Debug: Verificar las URLs que llegan
  console.log(
    "URLs recibidas:",
    results.map((r) => r.path)
  );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Imágenes Similares:
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((result) => (
          <div
            key={result.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
              <img
                src={result.path}
                alt={`Imagen similar ${result.id}`}
                className="object-contain w-full h-full"
                crossOrigin="anonymous"
                loading="lazy"
                onError={(e) => {
                  console.error(`Error cargando imagen: ${result.path}`);
                  e.currentTarget.src =
                    "https://via.placeholder.com/150?text=No+Image";
                }}
              />
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-gray-800">{result.id}</p>
              <p className="text-xs text-gray-600 mt-1">
                Similitud: {(result.similarity * 100).toFixed(2)}%
              </p>
              <p className="text-xs text-gray-500">
                Distancia: {result.distance.toFixed(4)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
