<template>
  <a
    :href="href === '' ? false : href"
    :target="target"
    :rel="target!== '' ? 'noopener noreferrer' : ''"
    :class="{ 'external-link': true, 'external-link_social': isSocial }"
  >
    <my-text tag="span" :type="type" class="external-link--text"
      ><slot
    /></my-text>
    <ExternalIcon v-if="!isSocial" />
  </a>
</template>

<script>
import ExternalIcon from '~/assets/images/external.svg?inline'
export default {
  name: 'external-link',
  components: { ExternalIcon },
  props: {
    href: {
      type: String,
      default : ""
    },
    isSocial: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: '',
    },
    noTarget: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    target() {
      return this.noTarget ? '' : '_blank'
    },
  },
}
</script>

<style lang="scss">
.external-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  transition: color ease-out 200ms;
  cursor: pointer;

  &--text {
    position: relative;
    display: inline;

    &::before {
      content: '';
      position: absolute;
      bottom: 5%;
      left: 0;
      width: 100%;
      height: 2px;
      border-radius: 5px;
      background-color: var(--color-orange-yellow);
      transform: scaleX(0);
      transform-origin: right center;
      transition: transform ease-out 200ms;
    }
  }

  svg path {
    transition: fill ease-out 200ms;
  }

  &_social {
    text-transform: uppercase;
  }

  &:hover {
    color: var(--color-orange-yellow);

    svg path {
      fill: var(--color-orange-yellow);
    }

    .external-link--text {
      &::before {
        transform-origin: left center;
        transform: scaleX(1);
      }
    }
  }
}
</style>
