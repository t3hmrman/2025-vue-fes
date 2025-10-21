import { fileURLToPath } from "node:url";

import { defineConfig } from 'rolldown';
import vue from "@vitejs/plugin-vue";
import { aliasPlugin } from 'rolldown/experimental'

/**
 * Build for the WebAssembly component
 *
 * Unlike the CSR example, there is no need to use vite-plugin-singlefile here
 * because all the code is JS & server code, and the client side assets will
 * be inlined via `import` statements.
 *
 * We use rolldown here rather than tsdown
 * to get easy node resolution semantics
 */
export default defineConfig({
    input: 'src/component.ts',
    output: {
        file: 'dist/wasm/component.js',
        inlineDynamicImports: true,
    },
    plugins: [
        vue(),
        aliasPlugin({
            entries: [
                {
                    find: 'vue',
                    replacement: fileURLToPath(new URL('./src/vue-shim.ts', import.meta.url)),
                },
            ],
        })
    ]
});
