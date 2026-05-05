<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="flex h-full flex-col items-center justify-start text-center">
    <div class="mb-2 rounded-full bg-primary/50 p-2">
      <LucidePointer class="-rotate-[135deg]" :size="32" />
    </div>

    <div class="mb-1 text-base font-medium">
      {{ title }}
    </div>
    <div
      class="line-clamp-3 break-words text-center text-sm font-thin text-gray-light"
      v-html="mainText"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  mainText: {
    type: String,
    required: true,
  },
});
</script>
