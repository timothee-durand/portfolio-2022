import Vue from "vue";
import { TroisJSVuePlugin } from "troisjs";

if (process.browser) {
  Vue.use(TroisJSVuePlugin);
}
