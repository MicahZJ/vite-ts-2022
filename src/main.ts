import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

import "element-plus/theme-chalk/el-message-box.css";// messageBox的样式
import "element-plus/theme-chalk/el-overlay.css";// 遮罩层样式

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
