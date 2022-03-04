<template>
  <div ref="container" class="canvas-container"></div>
</template>

<script>

import ProjectPresentationMaster from "@/js/three/ProjectPresentationMaster.js";

export default {
  name: "Projects",
  data() {
    return {
      projectList: []
    };
  },
  async mounted() {
    this.projectList = await this.$content("projects").fetch();
    this.$refs.container.style.height = `${this.projectList.length * 30}vh`;
    this.scene = new ProjectPresentationMaster({
      container: this.$refs.container,
      projects: this.projectList,
      router : this.$router,
      isDebug : true
    });
  },
  destroyed() {
    this.scene.destroy();
  }
};
</script>

<style scoped>
.canvas-container {
  width: 100%;
  margin-top: 0;
}
</style>
