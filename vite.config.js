import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/code-diff-viewer/",
    build: {
        sourcemap: false,
    },
    plugins: [react()],
});
