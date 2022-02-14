<template>
  <div id="app" ref="root">
    <my-header />
    <Nuxt />
    <my-footer />
    <svg-background />
  </div>
</template>
<script>
export default {
  mounted() {
    const userPrefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    let userPref = "light";
    if (userPrefersDark) {
      userPref = "dark";
    }

    document.body.classList.add(userPref);
  }
};
</script>
