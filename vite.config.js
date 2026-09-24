import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    /**
     * El visor 3D se carga solo cuando el usuario llega a esa sección (import
     * dinámico en PlanToBuilding.jsx), así que three.js (~1 MB) no afecta a la
     * carga inicial: cae en el chunk de BuildingScene, que es diferido.
     *
     * No se usa manualChunks/advancedChunks a propósito. Se probó a separar
     * three.js en su propio chunk y en Vite 8 (Rolldown) el resultado fue peor:
     * React terminaba dentro del chunk de three, la entrada lo importaba de forma
     * estática y el navegador precargaba 1,15 MB en la primera visita.
     * Si vuelves a intentarlo, COMPRUEBA SIEMPRE que dist/index.html no tenga un
     * <link rel="modulepreload" href=".../three-....js">.
     *
     * El límite de aviso se sube porque ese chunk pesa más de 500 kB por diseño.
     */
    chunkSizeWarningLimit: 1200,
  },
});
