<template>
  <div class="project-view">
    <ProjectBoard />
  </div>
</template>

<script setup lang="ts">
import ProjectBoard from '../components/ProjectBoard.vue'
</script>

<style scoped>
.project-view {
  height: 100vh;
  overflow: hidden;
}
</style>
