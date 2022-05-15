<template>
  <div class="projects-list">
    <div
      class="project"
      v-for="(project, j) in projectList"
      :key="'project' + j"
      @mouseenter="onProjectMouseEnter"
      @mouseleave="onProjectMouseLeave"
    >
      <my-image :image-url="project.thumbnail" class="project--thumbnail" />
      <div class="project--text">
        <my-text class="project--title" type="medium-title" tag="h3">{{project.title}}</my-text>
        <div class="project--techs">
          <my-text
            class="project--techs--item"
            v-for="(tech, i) in project.techs"
            :key="tech + i"
            >{{ tech }}</my-text
          >
        </div>
      </div>
      <my-button
        :to="project.path"
        class="project--link"
        text="About it"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectList',
  props: {
    projectList: {
      type: Array,
      default: () => {
        return [
          {
            title: 'Project Title',
            techs: ['VueJS'],
            path: '/projects/project-title',
          },
        ]
      },
    },
  },
  methods: {
    onProjectMouseEnter(e) {
      //console.log(e);
    },
    onProjectMouseLeave(e) {},
  },
}
</script>

<style scoped lang="scss">
@import '../assets/style/main';

.projects-list {
  display: grid;
  border-bottom: var(--color-text) 1px solid;
  margin-bottom: 2.6rem;
}

.project {
  border-top: var(--color-text) 1px solid;
  padding: 2rem 0;

  @include can-hover {
    &:hover .project--link {
      animation: heartBeat infinite ease-in-out 1500ms;
    }
  }
}

@keyframes heartBeat {
  30% {
    transform: scale(1.1);
  }

  35% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  55% {
    transform: scale(1);
  }
}

.project--thumbnail {
  height: 30rem;
  width: 100%;
  object-fit: cover;
  margin-bottom: 2rem;
  border-radius: 1rem;

  @include tablet {
    margin-bottom: 0;
  }
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
  align-self: center;
  @include can-hover {
    &:hover {
      animation-play-state: paused !important;
    }
  }
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
