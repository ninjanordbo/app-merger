<template>
  <div :style="`width: ${size}; height: ${size};`">
    <div
      :class="[
        'h-1 w-full rounded-full bg-gray',
        showCross ? 'transition-to' : 'transition-from',
      ]"
      :style="{
        '--translate-to': '0.6rem',
        '--rotate-to': '45deg',
        '--translate-from': '0.1rem',
        '--rotate-from': '0deg',
      }"
    />
    <div
      :class="[
        'h-1 w-full rounded-full bg-gray',
        showCross ? 'transition-to' : 'transition-from',
      ]"
      :style="{
        '--translate-to': '0.35rem',
        '--rotate-to': '45deg',
        '--translate-from': '0.35rem',
        '--rotate-from': '0deg',
      }"
    />
    <div
      :class="[
        'h-1 w-full rounded-full bg-gray duration-200',
        showCross ? 'transition-to' : 'transition-from',
      ]"
      :style="{
        '--translate-to': '0.1rem',
        '--rotate-to': '-45deg',
        '--translate-from': '0.6rem',
        '--rotate-from': '0deg',
      }"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  size: { type: String, default: "1.5rem" },
  color: { type: String, default: "none" },
  showCross: { type: Boolean, default: false },
});
</script>

<style lang="scss" scoped>
.transition-to {
  transition:
    translate 0.2s,
    transform 0.2s 0.4s;
  translate: 0 var(--translate-to);
  transform: rotate(var(--rotate-to));
}

.transition-from {
  transition:
    translate 0.2s 0.4s,
    transform 0.2s;
  translate: 0 var(--translate-from);
  transform: rotate(var(--rotate-from));
}
</style>
