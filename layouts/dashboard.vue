<template>
  <div class="flex">
    <DashboardNavPanel class="z-10" />

    <div class="z-0 h-full w-full overflow-auto bg-white">
      <slot />
    </div>

    <CommonModal
      v-model:is-open="modal.isOpen"
      class="z-50"
      v-bind="modal.modalProps"
    >
      <component :is="modal.component" v-bind="modal.componentProps" />
    </CommonModal>

    <DashboardCardDrawer />

    <CommonNotification />
  </div>
</template>

<script lang="ts" setup>
const modal = useModal();
</script>
