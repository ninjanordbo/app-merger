<template>
  <div class="mt-1 flex w-full items-center justify-end gap-5 text-sm">
    <button
      v-if="!initialState"
      class="management-button flex items-center justify-between border-primary-500 bg-white"
      @click="handleResetCircuits"
    >
      <LucideHistory class="text-primary-500" :size="20" />
      <div class="mt-0.5 px-2 font-medium">Se opprinnelig soneforslag</div>
    </button>
    <div v-else class="flex w-full items-center justify-end gap-2">
      <button
        class="management-button flex items-center justify-between border-primary-500 bg-white"
        @click="handleRefreshAreas"
      >
        <LucideChevronLeft class="text-primary-500" :size="20" />
        <div class="mt-0.5 px-2 font-medium">Tilbake</div>
      </button>
      <button
        v-if="!municipalitySubmitted"
        class="management-button flex items-center justify-between border-primary-500 bg-white"
        @click="handleSaveAreasToLs"
      >
        <LucideHistory class="text-primary-500" :size="20" />
        <div class="mt-0.5 px-2 font-medium">Tilbakestill soner</div>
      </button>
    </div>
  </div>

  <CommonConfirmationModal
    v-if="modalData"
    v-bind="modalData"
    v-model:is-open="isModalOpen"
  />
</template>

<script lang="ts" setup>
const isModalOpen = ref(false);
const modalData = ref<{
  title: string;
  text: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
} | null>(null);

const { resetCircuitsInitial, refreshAreas, saveAreasToLs } =
  useZoneSelection();
const { municipalitySubmitted } = storeToRefs(useZoneSelection());

const initialState = ref(false);

function handleResetCircuits() {
  resetCircuitsInitial();
  initialState.value = true;
}

function handleRefreshAreas() {
  refreshAreas();
  initialState.value = false;
}

function handleSaveAreasToLs() {
  modalData.value = {
    title: "Tilbakestill",
    text: "Soneinndelingen blir tilbakestilt til det opprinnelige forslaget fra Nabolagshelse. Tidligere lagrete soneinndelinger vil settes tilbake. Er du sikker?",
    confirmText: "Ja – Nullstill soneinndeling",
    cancelText: "Nei – Avbryt",
    onConfirm: () => {
      saveAreasToLs();
      initialState.value = false;
    },
  };
  isModalOpen.value = true;
}
</script>

<style scoped>
.management-button {
  @apply flex items-center justify-center rounded-lg border p-0.5 pl-2 duration-200 hover:scale-[1.025];
}
</style>
