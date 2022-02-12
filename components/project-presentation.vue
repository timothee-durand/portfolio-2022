<template>
  <div class="project-presentation" :data-techno="getJsonData()">
    <slot></slot>
  </div>
</template>
<script>

export default {
  name: "ProjectPresentation",
  props: {
    metadatas: {
      type: Object,
      default() {
        return {
          technos:
            [
              "VueJs",
              "ThreeJS"
            ]
        };
      }
    }
  },
  mounted() {

  },
  methods: {
    getJsonData() {
      return JSON.stringify(this.metadatas.technos);
    }
  }

};
</script>
<style lang="scss">
.project-presentation {
  width: 50rem;
  height: 30rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.project-presentation > *:not(canvas) {
  position: relative;
  z-index: 1;
}

canvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
