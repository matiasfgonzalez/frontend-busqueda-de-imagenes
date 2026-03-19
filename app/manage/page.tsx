"use client";

import ImageManager from "../../components/ImageManager";

export default function ManagePage() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-lg">
                <div>
                    <h1 className="text-center text-4xl font-extrabold text-gray-900">
                        Gestionar Digitalizaciones
                    </h1>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Visualiza, administra y elimina las imágenes indexadas
                        en el sistema.
                    </p>
                </div>

                <ImageManager />
            </div>
        </div>
    );
}
