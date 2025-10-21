import { Hono } from "hono";
import { fire } from "hono/service-worker";
import { logger } from "hono/logger";
import { showRoutes } from "hono/dev";

import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import App from "./app/App.vue";

// For the imports below to properly produce the right client-side assets
// (which need to be served to the frontend for hydration),
// we need to have already completed the client build (see client.vite.config.ts)
//
// This build is *finnicky* -- we are dancing in between compatibility with rollup for
// vite-rolldown, tsdown, *and* rolldown at the same time, on the bleeding edge.
// (see component.rolldown.config.ts)
//
import clientJS from "../dist/app/ssr.js";
import clientCSS from "../dist/app/ssr.css";

import indexLayout from "./app/index.layout.html";

/** Create the SSR Vue app */
const vueApp = createSSRApp(App);

/** Create the Hono web server that will render the SSR app */
export const app = new Hono();
app.use(logger());

// Serve the app.js client-side bundle
app.get("/app.js", async (c) => {
    c.header('Content-Type', 'application/javascript');
    return c.body(clientJS);
});

app.get("/app.css", async (c) => {
    c.header('Content-Type', 'text/css');
    return c.body(clientCSS);
});

// Serve the app entrypoint (index.html)
app.get("/", async (c) => {
    const renderedApp = await renderToString(vueApp);
    const renderedHTML = indexLayout.replace("__APP_HTML__", renderedApp);
    return c.html(renderedHTML);
});

// showRoutes() logs all the routes available,
// but this line only runs once during component build, due
// to component optimization intricacies (Wizer)
//
// see: https://github.com/bytecodealliance/wizer
showRoutes(app, { verbose: true });

// Run the actual app
fire(app);
