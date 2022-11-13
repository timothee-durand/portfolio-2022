<template>
  <article>
    <project-header :project-title="content.title"></project-header>

    <div class="project-presentation">
      <div class="project-presentation--aside">
        <div class="project-metas">
          <div class="project-meta">
            <my-text type="small">Type</my-text>
            <my-text type="small-title">{{ content.type.join(', ') }}</my-text>
          </div>
          <div class="project-meta">
            <my-text type="small">Role</my-text>
            <my-text type="small-title">{{ content.role.join(', ') }}</my-text>
          </div>
          <div class="project-meta">
            <my-text type="small">Year</my-text>
            <my-text type="small-title">{{ content.year }}</my-text>
          </div>
        </div>
      </div>
      <div class="project-presentation--content">
        <my-text class="project--title u--visually-hidden" tag="h1">{{
          content.title
        }}</my-text>
        <my-text type="medium-title" tag="h2">{{ content.subtitle }}</my-text>
        <nuxt-content class="project--article" :document="content" />
      </div>
    </div>
    <my-image
      class="single-project--thumbnail"
      :image-url="content.thumbnail"
    />
    <external-link
      v-if="content.link"
      :href="content.link"
      class="single-project-link"
      >Discover</external-link
    >
  </article>
</template>
<script>
import ExternalLink from '../../components/external-link.vue'
import { siteName, worksDir } from '../../config/index.js'
export default {
  name: 'SingleProject',
  components: { ExternalLink },
  async asyncData({ $content, params }) {
    const content = await $content(worksDir, params.slug).fetch()

    return {
      content,
    }
  },
  scrollToTop: true,
  head() {
    return {
      title: this.content.title + ' | ' + siteName,
    }
  },
}
</script>
<style lang="scss">
@import '~/assets/style/mixins/text';
@import '~/assets/style/mixins/breakpoints';

.project-presentation {
  display: grid;
  margin-top: 2rem;
  margin-bottom: 2rem;

  @include tablet {
    grid-template-columns: 0.5fr 1fr;
    grid-gap: 6rem;
    margin-bottom: 5rem;
  }

  .project-presentation--aside {
    @include tablet {
      text-align: right;
    }

    .project-metas {
      background-color: var(--color-orange-yellow);
      color: var(--color-rich-black);
      padding: 1rem;
      -webkit-border-radius: 1rem;
      -moz-border-radius: 1rem;
      border-radius: 1rem;
      margin-block-end: 2rem;
    }

    .project-meta {
      margin-block-end: 1rem;
      max-width: 20rem;
      margin: auto;

      p {
        margin: 0;

        &:first-child {
          margin-bottom: 0.5rem;
        }

        &:last-child {
          margin-bottom: 1rem;
        }
      }
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

.single-project-link.external-link {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  @include text-style-small-title;
}

.single-project--thumbnail {
  -webkit-border-radius: 1rem;
  -moz-border-radius: 1rem;
  border-radius: 1rem;
}
</style>
