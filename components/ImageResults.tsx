"use client";

interface ImageResult {
  id: string;
  similarity: number;
  path: string; // La ruta que el backend devuelve
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

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Imágenes Similares:
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((result) => (
          <div
            key={result.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
              {/*
                IMPORTANTE: Para mostrar las imágenes desde el backend, necesitarás una forma de acceder a ellas.
                En un entorno de producción, las imágenes se servirían desde un CDN o un servidor de archivos.
                Para este ejemplo local con Docker, asumimos que las imágenes de 'example_images'
                en el backend son los "resultados".
                Aquí, para que el frontend pueda verlas, tendrías que servir esas imágenes estáticamente
                desde FastAPI (agrega un `StaticFiles` en `main.py`).

                Para la demostración simple y asumiendo que el frontend no puede acceder directamente
                a `backend/example_images`, podrías:
                1. Configurar FastAPI para servir archivos estáticos desde `example_images`.
                   (Ver sección de "Consideraciones Adicionales" para esto)
                2. O, simplemente usar una imagen de placeholder para la demostración
                   o si los resultados no tienen URL de imagen accesible desde el frontend.
              */}
              <img
                src={`http://localhost:8000/static/${result.id}`} // Suponiendo que FastAPI sirva static files
                alt={result.id}
                className="object-contain w-full h-full"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/150?text=No+Image"; // Fallback
                  e.currentTarget.alt = "Imagen no disponible";
                }}
              />
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-gray-800 break-words">
                {result.id}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Similitud: {result.similarity.toFixed(4)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
