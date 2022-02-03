<template>
  <button type="button" class="switch-theme">
    <MoonSvg class="switch-theme__moon switch-theme__svg"/>
    <SunSvg class="switch-theme__sun switch-theme__svg"/>
  </button>
</template>
<script>
import MoonSvg from "~/assets/images/moon.svg?inline"
import SunSvg from "~/assets/images/sun.svg?inline"
  export default {
    name : "SwitchTheme",
    components : {MoonSvg, SunSvg}
  }
</script>
<style lang="scss">
  .switch-theme {
    background-color: transparent;
    border: none;

  }

  .switch-theme__svg path {
    stroke : var(--color-text)
  }
</style>
