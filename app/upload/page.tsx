"use client";

import ImageAddUpload from "../../components/ImageAddUpload";

export default function UploadPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h1 className="text-center text-4xl font-extrabold text-gray-900">
                        Subir Nueva Imagen
                    </h1>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sube una imagen para indexarla y que esté disponible en
                        búsquedas por similitud.
                    </p>
                </div>

                <ImageAddUpload />
            </div>
        </div>
    );
}
