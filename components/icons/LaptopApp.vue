<template>
  <div
    class="relative w-full overflow-x-clip overflow-y-visible"
    :style="`width: ${size ? size : '100%'}`"
  >
    <img class="scale-[1.3]" src="/public/Group 1.png" alt="laptopBigImage" />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  size: {
    type: String,
  },
});
</script>
