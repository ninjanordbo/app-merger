<template>
  <div
    :class="[
      'animate-pulse overflow-hidden px-2 leading-5 text-red-500 duration-200 ease-out',
      errorMessage ? 'max-h-6 pt-1' : 'max-h-0 pt-0',
    ]"
  >
    {{ errorMessage }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  errorMessage?: string;
}>();
</script>
