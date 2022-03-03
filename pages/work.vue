<template>
  <main ref="container">
    <project-presentation
      v-for="project in projects"
      :key="project.createdAt"
      :metadatas="project"
    ></project-presentation>
  </main>
</template>
<script>
import ProjectPresentationMaster from '@/components/ProjectPresentation/ProjectPresentationMaster.js'
import svgBackground from "@/mixins/svg-background.js";

export default {
  data() {
    return {}
  },
  mixins : [svgBackground],
  async asyncData({ $content }) {
    const projects = await $content('projects').fetch()
    return {
      projects,
    }
  },
  mounted() {
    this.scene = new ProjectPresentationMaster({
      container: document.body,
      elements: this.$refs.container.querySelectorAll('.project-presentation'),
    })
  },
  methods: {},
}
</script>
<style scoped>
main {
  display: grid;
  padding: 3rem;
}
main > * {
  margin-top: 30rem;
}

main > *:nth-child(2n - 1) {
  justify-self: right;
  text-align: right;
  margin-top: 10rem;
}
</style>
