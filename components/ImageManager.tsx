"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import {
    Trash2,
    AlertTriangle,
    Loader2,
    RefreshCw,
    X,
    CheckCircle,
    ImageOff,
    Database,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

interface IndexedImage {
    id: number;
    image_path: string;
    original_filename: string | null;
    sha256_hash: string | null;
    created_at: string | null;
    full_url: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function ImageManager() {
    const [images, setImages] = useState<IndexedImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deletingAll, setDeletingAll] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
    const [deleteAllConfirmText, setDeleteAllConfirmText] = useState("");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalImages, setTotalImages] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // ---------- Fetch images ----------
    const fetchImages = useCallback(
        async (page?: number, size?: number) => {
            const p = page ?? currentPage;
            const s = size ?? pageSize;
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`${API_URL}/images/`, {
                    params: { page: p, page_size: s },
                });
                setImages(res.data.images);
                setTotalImages(res.data.total);
                setTotalPages(res.data.total_pages);
                setCurrentPage(res.data.page);
            } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response) {
                    setError(
                        err.response.data.detail || "Error cargando imágenes."
                    );
                } else if (axios.isAxiosError(err) && err.request) {
                    setError("No se pudo conectar con el servidor.");
                } else {
                    setError("Error desconocido cargando imágenes.");
                }
            } finally {
                setLoading(false);
            }
        },
        [currentPage, pageSize]
    );

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    // ---------- Auto-hide success ----------
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // ---------- Pagination handlers ----------
    const goToPage = (page: number) => {
        setCurrentPage(page);
        setConfirmDeleteId(null);
    };

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setCurrentPage(1);
        setConfirmDeleteId(null);
        fetchImages(1, newSize);
    };

    // ---------- Delete single ----------
    const handleDeleteSingle = async (id: number) => {
        setDeletingId(id);
        setConfirmDeleteId(null);
        setError(null);
        try {
            await axios.delete(`${API_URL}/images/${id}`);
            setSuccessMessage(`Imagen ID ${id} eliminada exitosamente.`);
            // Re-fetch current page (the list may shift)
            fetchImages();
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                setError(
                    err.response.data.detail || "Error eliminando imagen."
                );
            } else {
                setError("Error eliminando imagen.");
            }
        } finally {
            setDeletingId(null);
        }
    };

    // ---------- Delete all ----------
    const handleDeleteAll = async () => {
        setDeletingAll(true);
        setShowDeleteAllModal(false);
        setDeleteAllConfirmText("");
        setError(null);
        try {
            const res = await axios.delete(`${API_URL}/images/`, {
                params: { confirm: true },
            });
            setImages([]);
            setTotalImages(0);
            setTotalPages(1);
            setCurrentPage(1);
            setSuccessMessage(
                res.data.message || "Todas las imágenes fueron eliminadas."
            );
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                setError(
                    err.response.data.detail || "Error eliminando imágenes."
                );
            } else {
                setError("Error eliminando imágenes.");
            }
        } finally {
            setDeletingAll(false);
        }
    };

    // ---------- Pagination range (visible page buttons) ----------
    const getPageRange = (): number[] => {
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        const end = Math.min(totalPages, start + maxVisible - 1);
        start = Math.max(1, end - maxVisible + 1);
        const pages: number[] = [];
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    // ---------- Render ----------
    return (
        <div className="w-full space-y-6">
            {/* Header con conteo y acciones */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-3">
                    <Database className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900 text-lg">
                            {totalImages}
                        </span>{" "}
                        {totalImages === 1
                            ? "imagen indexada"
                            : "imágenes indexadas"}
                    </span>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => fetchImages()}
                        disabled={loading}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 disabled:opacity-50 transition-colors"
                    >
                        <RefreshCw
                            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                        />
                        Actualizar
                    </button>
                    {totalImages > 0 && (
                        <button
                            onClick={() => setShowDeleteAllModal(true)}
                            disabled={deletingAll}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-300 disabled:opacity-50 transition-colors"
                        >
                            {deletingAll ? (
                                <>
                                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                    Eliminando…
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar Todo
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Success message */}
            {successMessage && (
                <div className="rounded-lg border border-green-300 bg-green-50 p-4 flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-green-700">{successMessage}</p>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="rounded-lg border border-red-300 bg-red-50 p-4 flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
                    <span className="ml-3 text-gray-500">
                        Cargando imágenes…
                    </span>
                </div>
            )}

            {/* Empty state */}
            {!loading && totalImages === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <ImageOff className="h-16 w-16 mb-4" />
                    <p className="text-lg font-medium text-gray-500">
                        No hay imágenes indexadas
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        Sube imágenes desde la sección &quot;Subir Imagen&quot;
                        para comenzar.
                    </p>
                </div>
            )}

            {/* Image table */}
            {!loading && images.length > 0 && (
                <>
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Imagen
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Nombre Original
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                        Fecha
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {images.map((img) => (
                                    <tr
                                        key={img.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-700">
                                            {img.id}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="relative w-12 h-12 rounded-md overflow-hidden border border-gray-200 bg-gray-100">
                                                <Image
                                                    src={img.full_url}
                                                    alt={
                                                        img.original_filename ||
                                                        "imagen"
                                                    }
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                                            {img.original_filename || "—"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell whitespace-nowrap">
                                            {img.created_at
                                                ? new Date(
                                                      img.created_at
                                                  ).toLocaleDateString(
                                                      "es-AR",
                                                      {
                                                          day: "2-digit",
                                                          month: "2-digit",
                                                          year: "numeric",
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      }
                                                  )
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right">
                                            {confirmDeleteId === img.id ? (
                                                <div className="flex items-center justify-end space-x-2">
                                                    <span className="text-xs text-red-600">
                                                        ¿Eliminar?
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteSingle(
                                                                img.id
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            img.id
                                                        }
                                                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        {deletingId ===
                                                        img.id ? (
                                                            <Loader2 className="animate-spin h-3 w-3" />
                                                        ) : (
                                                            "Sí"
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setConfirmDeleteId(
                                                                null
                                                            )
                                                        }
                                                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
                                                    >
                                                        No
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        setConfirmDeleteId(
                                                            img.id
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId !== null
                                                    }
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-red-600 bg-red-50 hover:bg-red-100 focus:ring-2 focus:ring-red-200 disabled:opacity-50 transition-colors"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                                                    Eliminar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                        {/* Page size selector */}
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>Mostrar</span>
                            <select
                                value={pageSize}
                                onChange={(e) =>
                                    handlePageSizeChange(Number(e.target.value))
                                }
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
                            >
                                {PAGE_SIZE_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                            <span>por página</span>
                            <span className="text-gray-400 mx-2">|</span>
                            <span>
                                Página {currentPage} de {totalPages}
                            </span>
                        </div>

                        {/* Page navigation */}
                        {totalPages > 1 && (
                            <div className="flex items-center space-x-1">
                                {/* First */}
                                <button
                                    onClick={() => goToPage(1)}
                                    disabled={currentPage === 1}
                                    className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    title="Primera página"
                                >
                                    <ChevronsLeft className="h-4 w-4" />
                                </button>
                                {/* Previous */}
                                <button
                                    onClick={() =>
                                        goToPage(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    title="Página anterior"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>

                                {/* Page numbers */}
                                {getPageRange().map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => goToPage(p)}
                                        className={`min-w-[2rem] h-8 rounded-md text-sm font-medium transition-colors ${
                                            p === currentPage
                                                ? "bg-blue-600 text-white shadow-sm"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}

                                {/* Next */}
                                <button
                                    onClick={() =>
                                        goToPage(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    title="Página siguiente"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                                {/* Last */}
                                <button
                                    onClick={() => goToPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    title="Última página"
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Delete All Modal */}
            {showDeleteAllModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => {
                            setShowDeleteAllModal(false);
                            setDeleteAllConfirmText("");
                        }}
                    />
                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5">
                        <button
                            onClick={() => {
                                setShowDeleteAllModal(false);
                                setDeleteAllConfirmText("");
                            }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Eliminar todas las imágenes
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Esta acción no se puede deshacer.
                                </p>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-800">
                                Se eliminarán{" "}
                                <span className="font-bold">
                                    {totalImages}
                                </span>{" "}
                                {totalImages === 1 ? "imagen" : "imágenes"}{" "}
                                junto con sus archivos físicos y registros en la
                                base de datos.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Escribe{" "}
                                <span className="font-mono font-bold text-red-600">
                                    ELIMINAR
                                </span>{" "}
                                para confirmar:
                            </label>
                            <input
                                type="text"
                                value={deleteAllConfirmText}
                                onChange={(e) =>
                                    setDeleteAllConfirmText(e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-300 focus:border-red-400 outline-none"
                                placeholder="ELIMINAR"
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteAllModal(false);
                                    setDeleteAllConfirmText("");
                                }}
                                className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteAll}
                                disabled={deleteAllConfirmText !== "ELIMINAR"}
                                className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Eliminar Todo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
