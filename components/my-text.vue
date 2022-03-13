<template>
  <component :is="tag" :class="className" :target="tag === 'a' ? '_blank' : false">
    <slot>{{ text }}</slot>
  </component>
</template>
<script>
export default {
  name: "CompText",
  props: {
    tag: {
      type: String,
      default: "p"
    },
    text: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "default"
    },
    color: {
      type: String,
      default: "greys-black"
    }
  },
  computed: {
    className() {
      return `text text--${this.type} text--${this.color}`;
    }
  }
};
</script>
