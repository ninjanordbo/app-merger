<template>
  <header class="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
    <div class="flex items-center gap-4">
      <h1 class="text-lg font-medium text-neutral-900">
        {{ pageTitle }}
      </h1>
    </div>

    <div class="flex items-center gap-3">
      <slot name="actions">
        <button
          class="flex items-center gap-2 rounded-md border border-primary bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
        >
          <LucidePlus :size="16" />
          Ny
        </button>
        <button
          class="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          <LucideSave :size="16" />
          Lagre
        </button>
      </slot>
    </div>
  </header>
</template>

<script lang="ts" setup>
const route = useRoute();

const pageTitle = computed(() => {
  return (route.meta.title as string) ?? "Prototype";
});
</script>
