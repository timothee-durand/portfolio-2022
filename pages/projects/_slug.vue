<template>
  <article>
    <project-header :project-title="content.title"></project-header>
    <h2>{{ content.title }}</h2>
    <nuxt-content :document="content" />
  </article>
</template>
<script>
export default {
  async asyncData({ $content, params }) {
    const content = await $content('/projects/', params.slug).fetch()

    return {
      content,
    }
  },
}
</script>
