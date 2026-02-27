"use client";

import { useState, useCallback, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import axios from "axios";
import {
    Upload,
    CheckCircle,
    XCircle,
    Loader2,
    ImagePlus,
    Trash2
} from "lucide-react";

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp"
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

type UploadStatus = "idle" | "preview" | "uploading" | "success" | "error";

interface UploadResult {
    id: number;
    path: string;
    sha256: string;
    original_filename: string;
}

export default function ImageAddUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [status, setStatus] = useState<UploadStatus>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
    const [dragActive, setDragActive] = useState(false);

    // ---------- Validación cliente ----------
    const validateFile = (f: File): string | null => {
        if (!ALLOWED_TYPES.includes(f.type)) {
            return `Formato no soportado (${f.type || "desconocido"}). Usa JPG, PNG, GIF, WEBP o BMP.`;
        }
        if (f.size > MAX_FILE_SIZE) {
            return `El archivo excede el tamaño máximo de ${MAX_FILE_SIZE / (1024 * 1024)} MB.`;
        }
        return null;
    };

    // ---------- Seleccionar archivo ----------
    const handleFileSelect = useCallback((f: File) => {
        const validationError = validateFile(f);
        if (validationError) {
            setErrorMessage(validationError);
            setStatus("error");
            return;
        }
        setFile(f);
        setPreview(URL.createObjectURL(f));
        setStatus("preview");
        setErrorMessage(null);
        setUploadResult(null);
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    // ---------- Drag & Drop ----------
    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };
    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    // ---------- Subir ----------
    const handleUpload = async () => {
        if (!file) return;

        setStatus("uploading");
        setErrorMessage(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                "http://localhost:8000/add-image/",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );
            setUploadResult(response.data.image);
            setStatus("success");
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                setErrorMessage(
                    err.response.data.detail || "Error del servidor."
                );
            } else if (axios.isAxiosError(err) && err.request) {
                setErrorMessage("No se pudo conectar con el servidor.");
            } else {
                setErrorMessage("Ocurrió un error desconocido.");
            }
            setStatus("error");
        }
    };

    // ---------- Reset ----------
    const handleReset = () => {
        if (preview) URL.revokeObjectURL(preview);
        setFile(null);
        setPreview(null);
        setStatus("idle");
        setErrorMessage(null);
        setUploadResult(null);
    };

    // ---------- Render ----------
    return (
        <div className="w-full space-y-6">
            {/* Zona de Drop / selección */}
            {(status === "idle" || status === "error") && !preview && (
                <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center w-full px-6 py-12 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 ${
                        dragActive
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-blue-400 bg-gray-50"
                    }`}
                >
                    <input
                        id="add-image-upload"
                        type="file"
                        className="sr-only"
                        accept={ALLOWED_TYPES.join(",")}
                        onChange={handleInputChange}
                    />
                    <label
                        htmlFor="add-image-upload"
                        className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                    >
                        <ImagePlus className="h-14 w-14 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold text-blue-600">
                                Arrastra y suelta una imagen aquí
                            </span>{" "}
                            o haz clic para seleccionar
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG, GIF, WEBP, BMP — Máx. 10 MB
                        </p>
                    </label>
                </div>
            )}

            {/* Preview */}
            {preview && status !== "success" && (
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-64 h-64 rounded-lg overflow-hidden shadow-md border border-gray-200">
                        <Image
                            src={preview}
                            alt="Vista previa"
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>
                    <p className="text-sm text-gray-600 truncate max-w-xs">
                        {file?.name} — {((file?.size || 0) / 1024).toFixed(1)}{" "}
                        KB
                    </p>

                    <div className="flex space-x-3">
                        <button
                            onClick={handleUpload}
                            disabled={status === "uploading"}
                            className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {status === "uploading" ? (
                                <>
                                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                    Subiendo e Indexando…
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Subir e Indexar
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={status === "uploading"}
                            className="inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Éxito */}
            {status === "success" && uploadResult && (
                <div className="rounded-xl border border-green-300 bg-green-50 p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-green-800">
                                ¡Imagen indexada correctamente!
                            </h3>
                            <p className="text-sm text-green-700">
                                La imagen ya está disponible para búsquedas por
                                similitud.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                            <span className="font-medium text-gray-600">
                                ID:
                            </span>{" "}
                            <span className="text-gray-900">
                                {uploadResult.id}
                            </span>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                            <span className="font-medium text-gray-600">
                                Archivo:
                            </span>{" "}
                            <span className="text-gray-900 truncate">
                                {uploadResult.original_filename}
                            </span>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-200 col-span-full">
                            <span className="font-medium text-gray-600">
                                SHA-256:
                            </span>{" "}
                            <span className="text-gray-900 font-mono text-xs break-all">
                                {uploadResult.sha256}
                            </span>
                        </div>
                    </div>

                    {preview && (
                        <div className="flex justify-center">
                            <div className="relative w-40 h-40 rounded-lg overflow-hidden shadow border border-green-200">
                                <Image
                                    src={preview}
                                    alt="Imagen subida"
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleReset}
                        className="w-full inline-flex justify-center items-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
                    >
                        <ImagePlus className="h-4 w-4 mr-2" />
                        Subir otra imagen
                    </button>
                </div>
            )}

            {/* Error */}
            {status === "error" && errorMessage && (
                <div className="rounded-xl border border-red-300 bg-red-50 p-4 flex items-start space-x-3">
                    <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-red-800">Error</h4>
                        <p className="text-sm text-red-700 mt-1">
                            {errorMessage}
                        </p>
                        {preview && (
                            <button
                                onClick={handleReset}
                                className="mt-3 text-sm text-red-600 underline hover:text-red-800"
                            >
                                Intentar con otra imagen
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
