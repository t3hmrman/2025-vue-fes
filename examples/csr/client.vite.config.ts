import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteSingleFile } from "vite-plugin-singlefile";
import ui from "@nuxt/ui/vite";
import tailwindcss from '@tailwindcss/vite';

/**
 * Build for a single file Vue Application (CSR, SPA)
 *
 * The output of this build (e.g. `dist/app/index.html`) is meant to be
 * inlined into the WebAssembly component server build (see component.tsdown.config.ts),
 * and served.
 *
 */
export default defineConfig({
    root: "./src/app",
    server: {
        fs: {
            roots: [
                "./src/app",
            ],
        },
    },
    publicDir: "./public",
    build: {
        outDir: "../../dist/app",
    },
    plugins: [
        vue(),
        tailwindcss(),
        ui({
            ui: {
                colors: {
                    primary: 'green',
                    neutral: 'slate'
                }
            }
        }),
        viteSingleFile(),
    ],
})
