<template>
  <div class="projects-list">
    <div
      class="project"
      v-for="(project,i) in projectList">
      <my-image :image-url="project.thumbnail" class="project--thumbnail"/>
<!--      <img :src="project.thumbnail" :alt="`Project ${project.title}'s thumbnail`" class="project&#45;&#45;thumbnail" />-->
      <div class="project--text">
        <my-text class="project--title" type="medium">{{ project.title }}</my-text>
        <div class="project--techs">
          <my-text class="project--techs--item" v-for="(tech, i) in project.techs" :key="tech + i">{{ tech }}</my-text>
        </div>
      </div>
     <my-button :to="project.path" :key="project.title + i" class="project--link" text="About it"/>
    </div>
  </div>
</template>

<script>

export default {
  name: "ProjectList",
  props: {
    projectList: {
      type: Array,
      default: () => {
        return [{ title: "Project Title", techs: ["VueJS"], path: "/projects/project-title" }];
      }
    }
  }

};
</script>

<style scoped lang="scss">
@import "../assets/style/main";

.projects-list {
  display: grid;
  border-bottom: var(--color-text) 1px solid;
  margin-bottom: 2.6rem;
}

.project {
  border-top: var(--color-text) 1px solid;
  padding: 2rem 0;
}

.project--thumbnail {
  height: 30rem;
  width: 100%;
  object-fit: cover;
  margin-bottom: 2rem;
  border-radius: 1rem;
}

.project--title {
  margin-bottom: 1rem;
}

.project--techs {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.project--techs--item {
  border: var(--color-text) 1px solid;
  border-radius: 2rem;
  padding: 0.2rem 1.5rem;
}

.project--text {
  margin-bottom: 2.4rem;
}

.project--link {
  margin: auto;
}
@include tablet {
  .project {
    display: grid;
    grid-template-columns: 23rem 1fr 20rem;
    grid-gap: 2rem;
  }

  .project--thumbnail {
    height: 14rem;
  }
}

</style>
