<template>
  <article>
    <project-header :project-title="content.title"></project-header>

    <div class="project-presentation">
      <div class="project-presentation--aside">
        <div class="project-metas">
          <div class="project-meta">
            <my-text type="small">Type</my-text>
            <my-text type="small-title">{{ content.type.join(", ") }}</my-text>
          </div>
          <div class="project-meta">
            <my-text type="small">Role</my-text>
            <my-text type="small-title">{{ content.role.join(", ") }}</my-text>
          </div>
          <div class="project-meta">
            <my-text type="small">Year</my-text>
            <my-text type="small-title">{{ content.year }}</my-text>
          </div>
        </div>
      </div>
      <div class="project-presentation--content">
        <my-text class="project--title u--visually-hidden" tag="h1">{{content.title}}</my-text>
        <my-text type="medium-title" tag="h2">{{ content.subtitle }}</my-text>
        <nuxt-content class="project--article" :document="content" />
      </div>
    </div>
    <my-image class="single-project--thumbnail" :image-url="content.thumbnail"/>
    <my-text v-if="content.link" tag="a" :href="content.link" type="link--blank" class="single-project-link">Discover</my-text>
  </article>
</template>
<script>
export default {
  name: "SingleProject",
  async asyncData({ $content, params }) {
    const content = await $content("/projects/", params.slug).fetch();

    return {
      content
    };
  }
};
</script>
<style lang="scss">
@import "~/assets/style/tokens/text-mixins.scss";
.project-presentation {
  display: grid;
  grid-template-columns: 0.5fr 1fr;
  grid-gap: 6rem;
  margin-top: 2rem;
  margin-bottom: 5rem;

  .project-presentation--aside {
    text-align: right;

    .project-metas {
      background-color: var(--color-orange-yellow);
      color: var(--color-rich-black);
      padding: 1rem;
      -webkit-border-radius: 1rem;
      -moz-border-radius: 1rem;
      border-radius: 1rem;
    }

    .project-meta {
      margin-block-end: 1rem;
    }


  }


  .project--article {
    h3 {
      @include text-style-small-title;
      margin-block-start: 1rem;
      margin-block-end: 0.5rem;
    }

    p {
      margin-block-end: 0.5rem;
    }
  }
}

.single-project-link {
  text-align: center;
  margin-top: 2rem;
  justify-content: center;
}

.single-project--thumbnail {
  -webkit-border-radius: 1rem;
  -moz-border-radius: 1rem;
  border-radius: 1rem;

}
</style>
