<template>
  <div id="app">
    <TaskList />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import wsService from "@/services/websocket";
import TaskList from "./components/TaskList.vue";

onMounted(() => {
  wsService.connect()
    .then(() => console.log("WebSocket connection established"))
    .catch(err => console.error("WebSocket connection failed:", err));
});

onBeforeUnmount(() => {
  wsService.disconnect();
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
