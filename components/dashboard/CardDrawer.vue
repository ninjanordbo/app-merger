<template>
  <Transition name="backdrop">
    <div
      v-if="isCardEditOpen"
      class="fixed inset-0 z-40 bg-black/30"
      @click="closeCardEdit"
    />
  </Transition>

  <Transition name="drawer">
    <div
      v-if="isCardEditOpen"
      class="fixed right-0 top-0 z-50 h-screen overflow-hidden bg-white shadow-2xl"
      style="width: 84%"
    >
      <button
        class="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-md bg-white/90 text-gray-500 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-800"
        title="Lukk"
        @click="closeCardEdit"
      >
        <LucideX :size="20" />
      </button>

      <DashboardDataExplorer />
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const { isCardEditOpen } = storeToRefs(useCreateCard());
const { closeCardEdit } = useCreateCard();
</script>

<style scoped>
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}
</style>
