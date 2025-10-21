# A Vue component, as a WebAssebly Component

This folder contains a single Vue component that has been built into a 
WebAssembly Component. 

Unlike the other examples, this is not a HTTP server that does CSR/SSR, this is
Vue display logic enshrined (and reusable/pluggable) as WebAssembly 

Being able to package individual Vue components this way unlocks many new possibilities:

- Virtualize the environment in which Vue can run
- Isolate Vue components along with other components that run this model (an alternative to Islands/iframes)
- Test Vue components within virtualized environments
- High density in deployment -- deploy thousands of websites
- Standards-first support for JS platforms
- WebAssembly binaries are *invokable* -- you can execute them in a variety of places without running your app

This project uses [NuxtUI][nuxt-ui] as an example of integrating ecosystem component libraries.

[hono]: https://hono.dev
[wintertc]: https://wintertc.org/
[nuxt-ui]: https://ui.nuxt.com

## Dependencies

To build the code in this repository, you'll need the following JS WebAssembly ecosystem tooling:

- [`wkg`][wkg] the [WIT][wit] package manager
- [`wasmtime`][wasmtime] installed

[wkg]: https://github.com/bytecodealliance/wasm-pkg-tools
[wit]: https://github.com/WebAssembly/component-model/blob/main/design/mvp/WIT.md
[wasmtime]: https://github.com/bytecodealliance/wasmtime

## Quickstart

You can run the application instantly by using the [`prebuilt.wasm`](./prebuilt.wasm) WebAssembly Component
with any WebAssembly runtime that supports [WebAssembly components (the Component Model)][wasm-components].

```
pnpm serve:prebuilt
```

Since the WebAssembly component in this folder is built to be all-encompassign (all application assets are inlined),
the component runs on its own with no access to the filesystem.

[wasm-components]: https://component-model.bytecodealliance.org/

## Local Development

To build the project:

```console
pnpm install
pnpm build
```

This will build the [application Typescript code](./src/component.ts) and afterwards a WebAssembly
component that functions as a web server.

```
dist
├── component.js
└── component.wasm

1 directory, 2 files
```

To serve the application:

```console
pnpm serve
```

By default, the application will be accessible at http://localhost:8080.

To serve on a different interface or port:

```console
pnpm serve --addr 127.0.0.1:3000
pnpm serve --addr 0.0.0.0:80
```

## What's the catch?

There are a few rough edges to this example which might stop you from porting all your production projects to WebAssembly:

- Arbitrary `node:` imports are *not* supported -- currently only universal JS platform primitives (e.g. `fetch`) are supported
  - [The WebAssembly JS ecosystem is working on this](https://github.com/bytecodealliance/StarlingMonkey/issues/188), at multiple levels
- Newer versions of `wasi:http` (newer than 0.2.3) are [not usable yet with `fetch` event integration](https://github.com/bytecodealliance/ComponentizeJS/issues/313)
- Use of the `fetch` event integration doesn't allow component reuse (`wasmtime` creates new instances by default, this [is *fast* -- 5 microseconds](https://bytecodealliance.org/articles/wasmtime-portability))

## Learn more about JS in WebAssembly

Work in the JS WebAssembly ecosystem is lively and ongoing -- join us!

- [Bytecode Alliance Zulip](https://bytecodealliance.zulipchat.com/)
  - [#jco channel](https://bytecodealliance.zulipchat.com/#narrow/channel/409526-jco)
  - [#componentize-js channel](https://bytecodealliance.zulipchat.com/#narrow/channel/387620-ComponentizeJS)
  - [#SIG-Guest-Languages JS](https://bytecodealliance.zulipchat.com/#narrow/channel/394175-SIG-Guest-Languages/topic/Javascript.20Subgroup/with/537507031)
- [Javascript SIG Guest Languages Meeting](https://github.com/bytecodealliance/meetings/tree/main/SIG-Guest-Languages/JavaScript)
