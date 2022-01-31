<template>
  <article>
    <h1>Projets</h1>
    <ul>
      <li v-for="(project,i) in projects" :key="`project-${i}`"><nuxt-link :to="project.path"  >
        {{project.title}}
      </nuxt-link></li>
    </ul>


  </article>
</template>

<script>
export default {
  async asyncData ({ $content }) {
    const projects = await $content('projects').fetch()
    return {
      projects
    }
  }
}
</script>
