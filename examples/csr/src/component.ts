import { Hono } from "hono";
import { fire } from "hono/service-worker";
import { logger } from "hono/logger";
import { showRoutes } from "hono/dev";

// Our entire client-side app has been reduced to 
// this one entry point via vite-plugin-singlefile
import staticHTML from "../dist/app/index.html";

export const app = new Hono();

app.use(logger());

app.get("/", async (c) => {
    return c.html(staticHTML);
});

// showRoutes() logs all the routes available,
// but this line only runs once during component build, due
// to component optimization intricacies (Wizer)
//
// see: https://github.com/bytecodealliance/wizer
showRoutes(app, { verbose: true });

// Run the actual app
fire(app);
