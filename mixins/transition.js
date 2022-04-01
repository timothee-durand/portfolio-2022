export default {
  data() {
    return {
      isTransitionLink: false
    };
  },
  methods: {
    setTransitionLink(e) {
/*      console.log({
        target : e.target
      });
      this.isTransitionLink = true;*/
      this.$store.commit("setTransitionComponent", e.target)
    }
  }
};
