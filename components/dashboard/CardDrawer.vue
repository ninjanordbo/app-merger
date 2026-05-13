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
        class="absolute right-5 top-[26px] z-20 flex h-[34px] w-[34px] items-center justify-center rounded-md border-2 bg-white transition-colors hover:bg-gray-100"
        style="border-color: #3d5a4a"
        title="Lukk"
        @click="closeCardEdit"
      >
        <LucideX :size="16" style="color: #3d5a4a" />
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
