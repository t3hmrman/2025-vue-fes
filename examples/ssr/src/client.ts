import { createSSRApp } from "vue";
import App from "./app/App.vue";
const app = createSSRApp(App);
app.mount("#app");
