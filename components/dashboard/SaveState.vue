<template>
  <div
    :title="isSaved ? 'Oppdatert' : 'Modifisert'"
    class="relative h-9 overflow-hidden rounded-md border-2 bg-opacity-10 p-1"
    :class="
      isSaved
        ? 'border-primary bg-primary'
        : 'border-warning-600 bg-warning-600'
    "
  >
    <Transition name="slide-from-bottom">
      <LucideFileCheck
        v-if="isSaved"
        class="fill-white text-primary"
        :size="24"
      />

      <LucideFilePen v-else class="fill-white text-warning-600" :size="24" />
    </Transition>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  isSaved: {
    type: Boolean,
    required: true,
  },
});
</script>

<style scoped>
.slide-from-bottom {
  &-enter-active,
  &-leave-active {
    @apply origin-bottom transition-transform;
  }

  &-enter-from,
  &-leave-to {
    @apply translate-y-1/2 scale-y-0 duration-0;
  }

  &-enter-to,
  &-leave-from {
    @apply translate-y-0 scale-y-100 duration-300;
  }
}
</style>
