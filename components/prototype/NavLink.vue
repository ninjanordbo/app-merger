<template>
  <NuxtLink
    :to="path"
    :class="[
      'flex items-center justify-start rounded-md px-3 py-2.5 transition-colors',
      isSelected ? 'bg-white text-dark-blue' : 'bg-none text-white hover:bg-white/10',
      $slots.text ? 'w-full gap-4' : 'w-min gap-0',
    ]"
  >
    <div :class="isSelected ? 'text-primary-700' : 'text-white'">
      <slot name="icon" />
    </div>

    <div v-if="$slots.text" class="leading-5">
      <slot name="text" />
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
const props = defineProps({
  path: { type: String, required: true },
});

const route = useRoute();
const isSelected = computed(() => route.path === props.path);
</script>
