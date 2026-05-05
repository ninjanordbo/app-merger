<template>
  <div
    class="flex h-full min-h-screen w-full flex-col items-center justify-between"
  >
    <LandingNavBar />
    <div
      class="relative z-40 flex h-full w-full flex-grow flex-col items-center justify-between"
    >
      <slot />
      <LandingFooter />
    </div>

    <CommonModal
      v-model:is-open="modal.isOpen"
      class="z-50"
      v-bind="modal.modalProps"
    >
      <component :is="modal.component" v-bind="modal.componentProps" />
    </CommonModal>

    <CommonNotification />
  </div>
</template>

<script lang="ts" setup>
const modal = useModal();
</script>
