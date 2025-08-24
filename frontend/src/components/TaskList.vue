<template>
  <div>
    <h2>Tasks</h2>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        {{ task.title }} - {{ task.status }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import socket from "@utils/socket";

const tasks = ref<{ id: number; title: string; status: string }[]>([]);

onMounted(() => {
  socket.on("task_update", (task) => {
    console.log("Task updated:", task);
    // update task list
    const existing = tasks.value.find((t) => t.id === task.id);
    if (existing) {
      existing.status = task.status;
    } else {
      tasks.value.push(task);
    }
  });
});

onBeforeUnmount(() => {
  socket.off("task_update");
});
</script>
