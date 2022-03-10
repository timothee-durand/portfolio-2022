<template>
  <div ref="root">
    <div id="app">
      <my-header />
      <Nuxt id="content" />
      <my-footer />
    </div>
  </div>
</template>
<style></style>
<script>
import {mapMutations} from "vuex"
export default {
  mounted() {
    const userPrefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (userPrefersDark) {
      this.setDarkMode();
      return;
    }

    this.setLightMode();

  },
  methods: {
    ...mapMutations({
      setDarkMode: "setDarkMode",
      setLightMode: "setLightMode"
    })
  }
};
</script>
