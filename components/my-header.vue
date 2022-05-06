<template>
  <header class="header u--d-flex u--justify-between">
    <nuxt-link to="/">
      <Logo />
    </nuxt-link>
    <div class="header__links">
      <header-link to="/works">Works</header-link>
      <header-link to="/about">About</header-link>
      <external-link
        is-social
        no-target
        @click.native="copyContact"
        class="contact-link"
      >Get in touch

        <div class="popover" ref="popover">
          <p>{{ msg }}</p>
        </div>
      </external-link>
    </div>
  </header>
</template>
<script>
import { contactMail } from "../config/index.js";
import anime from "animejs";

export default {
  name: "MyHeader",
  data() {
    return {
      msg: "Copied!"
    };
  },
  methods: {
    async copyContact() {
      try {
        await this.$copyText(contactMail);
        this.msg = "Copied!";
      } catch (e) {
        this.msg = "Error :" + e.message;
      } finally {
        const timeline = anime.timeline()
        timeline.add({
          targets : this.$refs.popover,
          scale : 1,
          // translateX : '-50%',
          // translateY : '-50%',
          rotate : '-10deg'
        })
        timeline.add({
          delay : 300,
          targets : this.$refs.popover,
          scale : 0,
          // translateX : '-50%',
          // translateY : '-50%'
          rotate : '0',
          onComplete : () => {
            this.msg = ''
          }
        })

      }
    }
  }
};
</script>
<style lang="scss">
.header {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  transition: opacity ease-out 200ms;
  padding: 1rem 2rem;
}

.header__links {
  display: flex;
  gap: 2rem;
  align-items: center;

  a {
    text-transform: none;
    font-weight: 400;
  }
}

.is-content-transition {
  header {
    opacity: 0;
  }
}

.external-link {
  position: relative;

  .popover {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 0;
    top: 0;
    transform: scale(0);
    background-color: var(--color-orange-yellow);
    color: var(--color-rich-black);
    min-width: 6rem;
    aspect-ratio: 1/1;
    padding: 1rem;
    border-radius: 200rem;
    transform-origin: center center;
  }
}


</style>
