import { defineConfig } from "vite";

/**
 * Demo Webpage that loads a VueJS WebAssembly component
 * and renders it.
 *
 * To render the VueJS component via Wasm, the demo page uses a *transpiled*
 * component -- i.e. one that can run in browsers
 *
 * The output of this build (e.g. `dist/app/index.html`) is meant to be
 * inlined into the WebAssembly component server build (see component.tsdown.config.ts),
 * and served.
 *
 */
export default defineConfig({
    root: "./demo",
    server: {
        fs: {
            roots: [
                "./demo",
            ],
        },
    },
    build: {
        outDir: "../../dist/demo",
    },
})
