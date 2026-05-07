<template>
  <div
    :title="isSaved ? 'Oppdatert' : 'Modifisert'"
    class="relative h-9 overflow-hidden rounded-md border-2 p-1"
    :style="isSaved ? 'border-color: #3d5a4a; background-color: #3d5a4a' : 'border-color: #d97706; background-color: #d97706'"
  >
    <Transition name="slide-from-bottom">
      <LucideFileCheck
        v-if="isSaved"
        :size="24"
        style="fill: white; color: white"
      />

      <LucideFilePen v-else :size="24" style="fill: white; color: #d97706" />
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
