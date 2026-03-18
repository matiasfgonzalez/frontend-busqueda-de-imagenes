import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "8000",
                pathname: "/**"
            },
            {
                protocol: "https",
                hostname: "api-digitalizacion-de-imagenes-test.ater.gob.ar",
                port: "",
                pathname: "/**"
            },
            {
                protocol: "https",
                hostname: "via.placeholder.com",
                port: "",
                pathname: "/**"
            }
        ]
    }
};

export default nextConfig;
