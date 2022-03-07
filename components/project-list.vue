<template>
  <div class="projects-list">
    <router-link
      v-for="(project,i) in projectList"
      :to="project.path"
      :key="project.title + i "
    >{{project.title}}</router-link>
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

<style scoped>
.projects-list {
  display: grid;
}
</style>
