<template>
  <div>
    <div class="hero">
      <client-only>
        <svg-background :form-proba="5" />
      </client-only>
      <my-text tag="p" type="medium-title" class="about-text">
        Bonjour 😄, <br />
        I’m Timothée DURAND, a <strong>french web developer</strong> in
        formation. I love to try new things, learn new technologies and make
        stuff with it ! I graduated from
        <external-link href="http://mmimontbeliard.com/" target="_blank"
          >MMI Montbéliard</external-link
        >
        and I am currently a work-study student between
        <external-link href="https://hetic.net" target="_blank"
          >Hetic</external-link
        >
        and
        <external-link href="https://ubisoft.com" target="_blank"
          >Ubisoft</external-link
        >.
      </my-text>
      <div class="u--d-flex socials-link-container">
        <external-link
          is-social
          href="https://www.linkedin.com/in/timothee-durand/"
          type="medium-title"
          >Linkedin</external-link
        >
        <external-link
          is-social
          href="https://github.com/timothee-durand/"
          type="medium-title"
          >Github</external-link
        >
        <external-link
          is-social
          href="mailto:contact@timotheedurand.fr"
          no-target
          type="medium-title"
          >Email</external-link
        >
      </div>
      <client-only>
        <svg-background :form-proba="5" />
      </client-only>
    </div>
  </div>
</template>

<script>
import ExternalLink from '../components/external-link.vue'
import { siteName } from "../config/index.js";
export default {
  scrollToTop: true,
  components: { ExternalLink },
  data() {
    return {
      title: "About | " + siteName,
    };
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/style/main.scss';
.about-text {
  font-weight: 400;

  strong {
    font-weight: 700;
  }

  a {
    font-weight: 700;
  }
}

.socials-link-container {
  margin-top: 30px;
  gap: 20px;
  align-items: flex-start;

  .external-link--text {
    font-weight: 400;
    font-size: 20px;

    @include tablet {
      font-size: inherit;
    }
  }
}
</style>
