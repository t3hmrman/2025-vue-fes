import { WASIShim } from "@bytecodealliance/preview2-shim/instantiation";

let REF_ID = 0;
const REFS = {};

let NODE_ID = 0;
const NODES = {};

let DOM_ID = 0;
const DOMS = {};

const SELECTOR = "#app";
let PLATFORM_DOM;

/** Convert a JS value to a RefValue type that can go to the host */
function jsValueToRefValue(v: any): RefValue {
    if (v === null) { return { tag: 'null' }; }
    if (v === undefined) { return { tag: 'undefined' }; }

    switch (typeof v) {
        case "number":
            return { tag: 'number', val: v };
        case "string":
            return { tag: 'string', val: v };
        case "object":
            return { tag: 'object-json', val: JSON.stringify(v) };
        default:
            throw new Error(`[host] unsupported JS value for ref value conversion [${v}]`);
    }
}

/** Convert a ref value that comes from the host to a JS type */
function refValueToJSValue(v: RefValue): RefValueJSType {
    switch (v.tag) {
        case "number":
            return Number(v.val);
        case "string":
            return String(v.val);
        case "object-json":
            try {
                return { tag: 'object-json', val: JSON.parse(v.val) };
            } catch (err) {
                console.log("[host] failed to decode JSON", { err, v });
                throw err;
            }
        case "null":
            return null;
        case "undefined":
            return undefined;
        default:
            throw new Error(`[host] unsupported ref value for JS value conversion [${v}]`);
    }
}

// Platform (browser) implementation of the `node` WIT resource
class PlatformNode {
    private _id;
    private selectorFn;

    constructor(args) {
        if (!args.selectorFn) { throw new Error("[host] missing selector during node creation"); }
        this.selectorFn = args.selectorFn;

        this._id = ++NODE_ID;
        NODES[this._id] = this;

        const elem = this.selectorFn();
        console.log("[host] REGISTERED PlatformNode", { elem, id: this._id });
        elem._wasmNodeID = this.id;
    }

    id() {
        return `node-${this._id}`;
    }

    getElement() {
        return this.selectorFn();
    }

    child() {
        const elem = this.selectorFn();
        const child = elem.firstChild;

        if (!child) {
            return this;
        }

        if (child && child._wasmNodeID) {
            return NODES[child._wasmNodeID];
        }
        return new PlatformNode({
            selectorFn: () => {
                const elem = this.selectorFn();
                return elem.firstChild;
            },
        })
    }

    nthChild(nth) {
        const elem = this.selectorFn();

        if (!elem.children) {
            return new PlatformNode({
                selectorFn: () => {
                    const elem = this.selectorFn();
                    return elem;
                },
            })
        }

        const child = elem.children[nth];

        if (!child) {
            return { tag: 'none' };
        }

        if (child._wasmNodeID) {
            return NODES[child._wasmNodeID];
        }

        return new PlatformNode({
            selectorFn: () => {
                const elem = this.selectorFn();
                return elem.children[nth];
            },
        })
    }

    next() {
        const elem = this.selectorFn();
        const sibling = elem.nextElementSibling;

        if (!sibling) {
            return this;
        }

        if (sibling._wasmNodeID) {
            return NODES[sibling._wasmNodeID];
        }

        return new PlatformNode({
            selectorFn: () => {
                const elem = this.selectorFn();
                return elem.nextElementSibling;
            }
        });
    }

    setStyle(values) {
        const elem = this.selectorFn();
        // TODO: this is more complicated, there is incremental setting!
        for (const [key, value] of values) {
            elem.style[key] = value;
        }
    }

    setText(txt) {
        const elem = this.selectorFn();
        const textNode = elem.nextSibling;
        if (textNode.nodeName !== "#text") { return; }
        textNode.nodeValue = txt;
    }
}

// Platform (browser) implementation of the `ref` WIT resource
class PlatformRef {
    private value;
    private _id;
    private dom;

    constructor(args) {
        if (!args.initialValue) { throw new Error("[host] invalid/missing  initial value while creating ref"); }
        this.value = refValueToJSValue(args.initialValue);
        this._id = ++REF_ID;
        REFS[this._id] = this;
    }

    id() {
        return `ref-${this._id}`;
    }

    getValue() {
        return jsValueToRefValue(this.value);
    }

    setValue(value) {
        const old = this.value;
        this.value = refValueToJSValue(value);
        // If the value updated, let's re-render, this is the simplest
        // possible way to do this.
        if (old !== this.value) {
            //PLATFORM_DOM.rerender();
        }

    }

}

// Platform (browser) implementation of the `platform-dom` WIT resource
class PlatformDom {
    private _id;
    private selector;
    private component;

    constructor(args) {
        if (!args.component) {
            throw new Error("[host] invalid/component missing at platform DOM creation"); }
        this.component = args.component;

        this._id = ++DOM_ID;
        DOMS[this._id] = this;

        this.selector = args.selector ?? 'body';
    }

    // TODO: we can make these not-static if we use the app name or some identifier?

    static createNode(html) {
        const elem = document.querySelector(SELECTOR);

        const newElem = document.createElement('div');
        newElem.id = "replaced-app";
        newElem.innerHTML = html;

        elem.appendChild(newElem);

        return new PlatformNode({
            selectorFn: () => {
                return document.querySelector("#replaced-app").children[0];
                return document.querySelector("#replaced-app");//.children[0];
            },
        });
    }

    static createRef(initialValue) {
        return new PlatformRef({ initialValue });
    }

    static delegateEvents(eventName) {
        const elem = document.querySelector(SELECTOR)
        elem.addEventListener(eventName, (evt) => {
            // When events happen, we want to call back into the component
            const tgt = evt.target;

            // If the (real) DOM node is part of this, we'll
            // get a wasm node ID on it
            PLATFORM_DOM.component.vueEventHandler.processDelegatedEvent(
                eventName,
                tgt._eventID ?? 0,
                '',
            );
        });
    }

    static setNodeEventId(nodeID, eventID) {
        const id = Number(nodeID.slice(5));
        const node = NODES[id];
        if (!node) {
            console.error("unexpectedly misssing node when setting event");
        }
        const elem = node.getElement();
        elem._eventID = eventID;
        console.log("[host] SETTING EVENT ID", { nodeID: id, eventID, elem });
    }

    static getNodeById(nodeId) {
        if (!nodeId.startsWith("node-")) {
            throw new Error(`[host] invalid node ID [${nodeId}]`);
        }
        return NODES[id];
    }

    static getRefById(refID) {
        if (!refID.startsWith("ref-")) {
            throw new Error(`[host] invalid node ID [${refID}]`);
        }
        const id = Number(refID.slice(4));
        const ref = REFS[id];
        return ref;
    }

    id() { return `platform-${this._id}`; }

    rerender() {
        this.component.vueRender.render();
    }

}

async function main() {
    const transpiledWasm = await import("../dist/transpiled/component.js");

    // Instantiate the module, with the WASI browser shim
    let component;
    try {
        const wasiShim = new WASIShim();
        component = await transpiledWasm.instantiate(undefined, {
            ...wasiShim.getImportObject(),
            "vuefes:component/vue-host": {
                Node: PlatformNode,
                Ref: PlatformRef,
                PlatformDom: PlatformDom,
            },
        });
    } catch (e) {
        console.error("error while instantiating:", e);
        return;
    }

    // Call initial render
    PLATFORM_DOM = new PlatformDom({ root: SELECTOR, component })
    component.vueRender.render(PLATFORM_DOM);
}

await main();
