/**
 * This module represents a minimal Proof of Concept shim of the
 * interface that is relied upon by Vue to render the simple counter
 * example component in App.Vue (in this repo).
 *
 * By using this shim *in place* of 'vue' (as imported from in a compiled SFC),
 * we can adopt functions that are normally used by Vue to fit into the
 * WebAssembly host platform's provided functionality.
 *
 *  WebAssembly Vue Component
 *        \ calls /
 *  Vue Shim (this module)
 *        \ calls /
 *  Platform
 */

// This import will always be unresolved, it is filled in when
// the WebAssembly component is actually built (this is the fully
// qualified name of the vue-host interface).
import {
    PlatformDom,
    Node,
    Ref,
    RefValue,
} from "vuefes:component/vue-host";

type Option<T> = {tag: 'some', val: T} | { tag: 'none' };
type Result<T, E> = {tag: 'ok', val: T} | { tag: 'err', val: E };

/** JS Types that RefValue can take */
type RefValueJSType = number | string | null | undefined;

////////////////////
// Event Handling //
////////////////////

/// Map of node IDs to event handler functions related to them
const EVENT_HANDLER_FNS = new Map();

function addEventHandler(args) {
    if (!args.nodeID) { throw new Error("[wasm] Missing event Node ID"); }
    if (!args.eventID) { throw new Error("[wasm] Missing event ID"); }
    if (!args.fn) { throw new Error("[wasm] Missing receiver Node ID"); }

    // TDOO: allow more than one handler per event
    if (EVENT_HANDLER_FNS.has(args.eventID)) {
        throw new Error("[wasm] Event handler already registered for node!");
    }

    // Save the event handler fn
    EVENT_HANDLER_FNS.set(args.eventID, { nodeID: args.nodeID, eventID: args.eventID, fn: args.fn });

    // Ensure the platform knows
    PlatformDom.setNodeEventId(args.nodeID, args.eventID);
}

/// Get event handler for given noden
export function getEventHandlerFn(args) {
    const { eventID, nodeID } = args;
    const handler = EVENT_HANDLER_FNS.get(args.eventID);
    if (!handler) {
        throw new Error(`unexpectedly missing event handler for eventID [${args.eventID}]`);
    }

    return handler.fn;
}

let EVENT_ID = 0;
function wrapEventHandler(node: Node): Node {
    return new Proxy(node, {
        set(target, prop, receiver) {
            if (prop === "$evtclick") {
                const eventID = ++EVENT_ID;
                addEventHandler({ nodeID: target.id(), eventID, fn: receiver });
            }
            return Reflect.set(...arguments);
        }
    });
}

//////////////
// Vue shim //
//////////////

export function child(node: Node): Node {
    console.log('[wasm] child()', { node: node.id() });
    return wrapEventHandler(node.child());
}

export function delegateEvents(eventName) {
    console.log('[wasm] delegateEvents()', { eventName });
    PlatformDom.delegateEvents(eventName);
}

export function next(node: Node): Option<Node> {
    console.log('[wasm] next()', { node: node.id() });
    return wrapEventHandler(node.next());
}

export function nthChild(node: Node, nth: number): Option<Node> {
    console.log('[wasm] nthChild()', { node: node.id(), nth });
    if (nth < 0) { throw new Error(`[wasm] invalid nth [${nth}]`); }
    return wrapEventHandler(node.nthChild(nth - 1));
}

export function ref(initialValue): Ref {
    console.log('[wasm] ref()', { initialValue });

    const platformRef = PlatformDom.createRef(jsValueToRefValue(initialValue));
    const platformRefID = platformRef.id();

    // We return the platform ref with a special prox for intercepting
    // changes to it's value, so we can update the platform underneath.
    //
    return new Proxy(platformRef, {
        // When we attempt to get the value, we must check with the platform
        get(target, property, receiver) {
            if (property === "value") {
                const ref = PlatformDom.getRefById(platformRefID);
                if (!ref) {
                    throw new Error(`[wasm] missing ref with ID [${platformRefID}] in dom [${domID}]`);
                }

                // Update the value if necessary, if it has drifted
                // from the platform's value
                const platformValue = refValueToJSValue(ref.getValue());
                if (platformValue !== Reflect.get(...arguments)) {
                    Reflect.set(target, property, platformValue)
                }

                return platformValue;
            }
        },

        // When we set, we must update the platform with the new value
        // of the ref.
        set(target, property, receiver) {
            if (property === "value") {
                const ref = PlatformDom.getRefById(platformRefID);
                if (!ref) {
                    throw new Error(`[wasm] missing ref with ID [${platformRefID}] in dom [${domID}]`);
                }

                // Update the ref with the platform
                ref.setValue(jsValueToRefValue(receiver));
            }

            return Reflect.set(...arguments);
        }
    })

}

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
            throw new Error(`[wasm] unsupported JS value for ref value conversion [${v}]`);
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
                console.log("[wasm] failed to decode JSON", { err, v });
                throw err;
            }
        case "null":
            return null;
        case "undefined":
            return undefined;
        default:
            throw new Error(`[wasm] unsupported ref value for JS value conversion [${v}]`);
    }
}

let _EFFECT_FN;
export function renderEffect(effectFn) {
    if (effectFn) {
        _EFFECT_FN = effectFn;
    } else {
        if (typeof effectFn === "undefined" && !_EFFECT_FN) {
            throw new Error("cannot re-render without registered fns!");
        }
        // Run all effect functions
        _EFFECT_FN();
    }
}

export function setStyle(node, styleObj) {
    console.log('[wasm] setStyle()', { node: node.id(), styleObj });
    if (!styleObj) { return; }
    node.setStyle(Object.entries(styleObj));
}

export function setText(node, txt) {
    console.log('[wasm] setText()', { node: node.id(), txt });
    node.setText(txt);
}

export function template(text, isDynamic): () => Node {
    console.log('[wasm] template()', { isDynamic });
    return () => PlatformDom.createNode(text);
}

export function toDisplayString(value) {
    // NOTE: This is mostly borrowed from vue's runtime logic
    const valType = typeof value;
    if (valType === "string") { return value; }
    if (valType instanceof Ref)  {
        return toDisplayString(val.getValue());
    }
    if (Array.isArray(value) || value.toString === Object.prototype.toString && (!'toString' in value || typeof value.toString !== 'function')) {
        return JSON.stringify(value, null, 2);
    }
    return value == null ? "" : String(value);
}
