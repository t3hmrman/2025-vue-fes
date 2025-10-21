# Vue Fes 2025: A New Vue: The Server Side WebAssembly/WASI Platform

This repository contains code to demonstrate using [Vue][vue] with [WebAssembly][wasm],
in particular "modern" WebAssembly -- [WebAssembly Components][wasm-components] (powered
by the [Component Model][component-model], the [WebAssembly System Inteface (WASI)][wasi],
and [WebAssembly Interface Types][wit].

[vue]: https://vuejs.org/
[wasm]: https://webassembly.org
[wasm-components]: https://component-model.bytecodealliance.org/
[wasi]: https://github.com/WebAssembly/wasi
[wit]: https://github.com/WebAssembly/component-model/blob/main/design/mvp/WIT.md
[component-model]: https://github.com/WebAssembly/component-model

## What this repository demonstrates

There are multiple projects in this repository, demonstrating different ways of using Vue
in the world of WebAssembly, in increasing complexity and power:

| Project      | Folder                | Description                                           |
|--------------|-----------------------|-------------------------------------------------------|
| CSR          | `examples/csr`        | Client Side Rendered Vue with WebAssembly             |
| SSR (simple) | `examples/ssr-simple` | Server Side Rendered Vue with builtins                |
| SSR (Nuxt)   | `examples/ssr-nuxt`   | Server Side Rendered Vue via Nuxt                     |
| Component    | `examples/component`  | Single component rendering with on flexible platforms |

While deploying client side rendered Vue is as simple as deploying a web page, server side rendered
Vue requires more integration -- building a WebAssembly component *in Javascript* and doing some
more bundling, integrating into existing frameworks as they support it.

## A quick tour of the JS WebAssembly ecosystem

There are many projects (other than [Vue][vue] and it's ecosystem, of course!) that make it easier to
write and work with Javascript in WebAssembly:

- [StarlingMonkey][sm] is a WebAssembly-ready Javascript Runtime stewarded by the Bytecode Alliance, based on [SpiderMonkey][spidermonkey]
- [componentize-js][componentize-js] turns Javascript into WebAssembly components, working with WIT interfaces
- [jco][jco] is a JS WebAssembly ecosystem multi-tool which also enables transpiling WebAssembly components to run in JS environments (NodeJS, Browser)

> [!WARNING]
> `jco` support for transpiling components to the browser is still experimental

For a quick guide into the WebAssembly JS ecosystem:

- [Read the Component Model Book Javascript Guide][cm-book-js]
- [Read the JCO Book][jco-book]

[sm]: https://github.com/bytecodealliance/StarlingMonkey
[componentize-js]: https://github.com/bytecodealliance/componentize-js
[jco]: https://github.com/bytecodealliance/componentize-js
[spidermonkey]: https://spidermonkey.dev/
[cm-book-js]: https://component-model.bytecodealliance.org/language-support/javascript.html
[jco-book]: https://bytecodealliance.github.io/jco/

## Dependencies

The code in this repository depends mostly on the typical Javascript stack:

| Dependency | Description      |
|------------|------------------|
| `node`     | [NodeJS][nodejs] |
| `pnpm`     | [PNPM][pnpm]     |

[nodejs]: https://nodejs.org
[pnpm]: https://pnpm.io/
