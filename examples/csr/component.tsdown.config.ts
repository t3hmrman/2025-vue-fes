import { defineConfig } from 'tsdown';

/**
 * Build for the WebAssembly component that functions as a server only
 * to make the client-side code available.
 *
 * This build depends on the build of the client-side bundle (see client.vite.config.ts),
 * which is resolved to a single file output w/ Vite.
 *
 * We use tsdown as it builds libraries (which the WebAssembly component code will be)
 * and has working support for static import loading & inlining built in (e.g. static HTML),
 */
export default defineConfig({
    entry: [
        'src/component.ts',
    ],
    outDir: 'dist/wasm',
    loader: {
        ".html": "text",
    },
});
