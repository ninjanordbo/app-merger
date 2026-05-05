<template>
  <div
    class="flex flex-col items-start justify-between gap-1 rounded-xl border border-primary bg-white p-2 shadow-sm"
  >
    <div class="flex flex-col items-start justify-start">
      <div class="flex flex-col items-start justify-center gap-2 p-2">
        <div class="flex items-center justify-start gap-2">
          <div class="-mt-1 h-4 w-[1.5px] bg-primary-500" />
          <div class="text-lg">{{ project.name }}</div>
        </div>

        <div class="text-sm font-light">{{ project.description }}</div>
      </div>
    </div>

    <div class="flex w-full items-center justify-end">
      <button
        class="rounded-lg border-2 border-primary-500 bg-white px-6 py-1 text-base duration-200 hover:scale-105"
        @click="applyProject"
      >
        Bruk
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  project: {
    type: Object as PropType<{ name: string; description: string }>,
    required: true,
  },
  applyProject: {
    type: Function as PropType<() => void>,
  },
});
</script>
