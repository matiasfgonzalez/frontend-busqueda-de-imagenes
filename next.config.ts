import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/static/**", // Asegúrate de que coincida con la ruta estática de FastAPI
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // Para el fallback
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
