<template>
  <div class="project-presentation" :data-techno="getJsonData()">
    <router-link :to="metadatas.path">
      <blob :text="metadatas.title"></blob>
    </router-link>
  </div>
</template>
<script>
export default {
  name: 'ProjectPresentation',
  props: {
    metadatas: {
      type: Object,
      default() {
        return {
          techs: ['VueJs', 'ThreeJS'],
          title: 'Project',
        }
      },
    },
  },
  mounted() {},
  methods: {
    getJsonData() {
      return JSON.stringify(this.metadatas.techs)
    },
  },
}
</script>
<style lang="scss">
.project-presentation {
  width: 50rem;
  height: 40rem;
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
