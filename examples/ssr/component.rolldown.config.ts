import { defineConfig } from 'rolldown';
import vue from "@vitejs/plugin-vue";
import stringImport from "rollup-plugin-string-import";

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
    moduleTypes: {
        ".css": "text",
        ".html": "text",
    },
    resolve: {
        tsconfigFilename: "./tsconfig.json",
        // NOTE: rolldown only supports string based aliases for now,
        // but we can just read aliases from ts config instead.
        // alias: {
        //     "@shadcn/lib/utils": "./src/app/shadcn/lib/utils.ts",
        // },
    },
    plugins: [
        vue(),
        stringImport({
            include: [ "dist/app/*.js" ],
        }),
    ]
});
