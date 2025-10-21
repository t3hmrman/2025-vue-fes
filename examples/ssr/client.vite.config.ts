import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

/**
 * This build creates the the client-side bundle for the SSR app
 * for the purposes of hydration.
 *
 * It is used mainly as an input to the component build, by virtue
 * of a dynamic import of the build output below (e.g. dist/app/ssr.js).
 */
export default defineConfig({
    build: {
        outDir: "dist/app",
        lib: {
            formats: ['es'],
            entry: "src/client.ts",
        }
    },
    plugins: [vue(), tailwindcss()],
    resolve: {
        alias: [
            { find: "@shadcn/lib/utils", replacement: "./src/app/shadcn/lib/utils.ts" },
            {
                find:/^@shadcn\/components\/ui\/(.*)$/,
                replacement: fileURLToPath(new URL('./src/app/shadcn/components/ui/$1/index.js', import.meta.url)),
            },
        ],
    },
    define: {
        // TODO: surely this isn't necessary in year of our lord 2025.
        // see: https://github.com/vitejs/vite/discussions/14474
        'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'production'}"`,
    }
})
