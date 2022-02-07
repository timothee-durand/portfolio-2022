<template>
  <main ref="container">
    <project-presentation >
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque, unde!</p>
    </project-presentation>
    <project-presentation>
      <p>Aperiam autem debitis maxime nihil non odit quasi veniam veritatis.</p>
    </project-presentation>
    <project-presentation>
      <p>Debitis eaque error eum inventore laborum odit, quo ratione repudiandae?</p>
    </project-presentation>
    <project-presentation>
      <p>Ab amet atque consequatur dolores ex, officia tenetur ut voluptates.</p>
    </project-presentation>
    <project-presentation>
      <p>A adipisci cumque distinctio dolore ducimus eos laboriosam nesciunt quidem.</p>
    </project-presentation>
    <project-presentation>
      <p>Aperiam autem debitis maxime nihil non odit quasi veniam veritatis.</p>
    </project-presentation>

  </main>


</template>
<script>
import ProjectPresentationMaster from "@/components/ProjectPresentation/ProjectPresentationMaster.js";

export default {
  data() {
    return {
    };
  },
  mounted() {
    this.scene = new ProjectPresentationMaster({
      container : document.body,
      elements : this.$refs.container.querySelectorAll(".project-presentation")
    })
  },
  methods: {
  }
}
</script>
<style scoped>
  main {
    display: grid;
    padding: 3rem;
  }
  main > * {
    width: 30%;
    margin-top: 30rem;
  }

  main > *:nth-child(2n - 1) {
    justify-self: right;
    text-align: right;
    margin-top: 10rem;
  }

</style>
