<template>
  <button type="button" class="switch-theme" @click="toggleMode">
    <MoonSvg class="switch-theme__moon switch-theme__svg" />
    <SunSvg class="switch-theme__sun switch-theme__svg" />
  </button>
</template>
<script>
import MoonSvg from '~/assets/images/moon.svg?inline'
import SunSvg from '~/assets/images/sun.svg?inline'
import { mapMutations } from "vuex";
export default {
  name: 'SwitchTheme',
  components: { MoonSvg, SunSvg },
  methods: {
    ...mapMutations({
      toggleMode : "toggleMode"
    })
  },
}
</script>
<style lang="scss">
.switch-theme {
  background-color: transparent;
  border: none;
  width: 4.2rem;
  height: 4.2rem;
}

.switch-theme__svg {
  width: 100%;
  height: 100%;

  path {
    stroke: var(--color-text);
  }
}

body[data-theme="dark"] .switch-theme__moon {
  display: none;
}

body[data-theme="light"] .switch-theme__sun {
  display: none;
}
</style>
