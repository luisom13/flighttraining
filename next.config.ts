import type { NextConfig } from "next";

// Con NEXT_PUBLIC_BASE_PATH definido (GitHub Pages) se genera un sitio 100 % estático en ./out.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const estatico = process.env.EXPORTAR_ESTATICO === "true";

const nextConfig: NextConfig = {
  ...(estatico ? { output: "export" as const, trailingSlash: true, images: { unoptimized: true } } : {}),
  ...(basePath ? { basePath } : {}),
  // Cache Components no es compatible con la exportación estática.
  ...(estatico ? {} : { cacheComponents: true, partialPrefetching: true }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
