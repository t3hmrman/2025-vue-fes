import * as vueShim from "./vue-shim.js";

let RENDERED_ONCE = false;
let APP_NAME;
let IS_VAPOR;

export const vueRender = {
    /**
     * Given a DOM implementation provided by the platform,
     * this function performs all necessary functions to render
     * the given component.
     */
    async render() {
        if (!RENDERED_ONCE) {
            const { default: sfcObj } = await import("./app/App.vue");
            APP_NAME = sfcObj.__name;
            IS_VAPOR = sfcObj.__vapor;
            // TODO support props
            sfcObj.setup();
            RENDERED_ONCE = true;
        } else {
            vueShim.renderEffect();
        }
    },
}

export const vueEventHandler = {
    /**
     * Given an event, a DOM Node to which it happened,
     * and an event payload (serialized to JSON),
     *
     * Process delegated events for the component
     */
    processDelegatedEvent(event, eventID, _payloadJson) {
        // If we get an event for a node we don't know about, we need to figure out which node did it
        if (eventID === 0) {
            console.error(`[wasm] failed to process event [${event}], missing event ID`);
            return;
        }

        const handlerFn = vueShim.getEventHandlerFn({ eventID, event });
        handlerFn();

        // Re-render the component
        vueShim.renderEffect();
    }
}
