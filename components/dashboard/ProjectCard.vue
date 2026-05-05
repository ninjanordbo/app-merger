<template>
  <button
    class="flex w-full items-center justify-between gap-1 rounded-xl border bg-white px-3 py-2 shadow-sm"
    @click="() => applyProject(project)"
  >
    <div class="flex items-center gap-2">
      <LucideFile :size="24" class="text-gray-300" />
      <div class="-mb-0.5">{{ project.name }}</div>
    </div>

    <div class="flex items-center justify-center gap-2">
      <div v-if="project.updatedAt" class="-mb-1 text-sm">
        Tirs {{ formatDate(project.updatedAt, "D MMM YYYY") }}
      </div>

      <button
        class="rounded-md border border-dark-blue p-1 text-dark-blue duration-200 hover:scale-110"
        @click.stop="() => duplicateProject(project)"
      >
        <LucideCopy :size="20" />
      </button>

      <button
        class="rounded-md border border-dark-blue p-1 text-dark-blue duration-200 hover:scale-110"
        @click.stop="() => deleteProject(project)"
      >
        <LucideTrash2 :size="20" />
      </button>
    </div>
  </button>
</template>

<script lang="ts" setup>
import { formatDate } from "@vueuse/core";

import type { Project } from "~/utils/types";

defineProps({
  project: {
    type: Object as PropType<Project>,
    required: true,
  },
  deleteProject: {
    type: Function as PropType<(project: Project) => void>,
    required: true,
  },
  applyProject: {
    type: Function as PropType<(project: Project) => void>,
    required: true,
  },
  duplicateProject: {
    type: Function as PropType<(project: Project) => void>,
    required: true,
  },
});
</script>
