<template>
  <div
    class="flex h-full w-full items-center justify-between gap-2 rounded-b-xl bg-white px-5 py-3 shadow-md"
  >
    <div class="flex items-center justify-between gap-2">
      <div class="h-7 w-0.5 bg-primary-500" />
      <slot name="text" />
    </div>

    <div class="flex items-center justify-between gap-2">
      <button
        class="flex items-center justify-center rounded-md border-2 bg-white py-1.5 pl-2 pr-1 duration-200 hover:-translate-y-1"
        style="border-color: #3d5a4a"
        @click="openCardEdit()"
      >
        <LucidePlus :size="20" style="color: #3d5a4a" />
        <span class="px-2 text-sm font-medium" style="color: #3d5a4a">Nytt kort</span>
      </button>


      <button
        class="flex items-center justify-center rounded-md py-1.5 pl-2 pr-1 duration-200 hover:-translate-y-1"
        style="background-color: #3d5a4a; color: white"
        @click="handleSaveProject()"
      >
        <LucideSave :size="20" class="text-white" />
        <span class="px-2 text-sm font-medium" style="color: white">Lagre</span>
      </button>


      <DashboardSaveState :is-saved="isProjectSaved" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { saveProject } = useDashboard();
const { isProjectSaved } = storeToRefs(useDashboard());
const { openCardEdit } = useCreateCard();
const { pushNotification } = useNotifications();

function handleSaveProject() {
  saveProject();

  pushNotification({
    title: "Prosjektet er lagret",
    type: "success",
    message: "",
  });
}
</script>

<style scoped>
.option-button {
  @apply flex items-center justify-center rounded-md border-2 border-[#3d5a4a] bg-white py-1.5 pl-2 pr-1 duration-200 hover:-translate-y-1;
}

.option-button-save {
  @apply flex items-center justify-center rounded-md bg-primary-800 py-1.5 pl-2 pr-1 duration-200 hover:-translate-y-1;
}

.option-button-small {
  @apply flex items-center justify-center px-1 text-dark-blue duration-200 hover:-translate-y-1;
}
</style>
