<template>
  <div
    class="flex w-full items-center justify-between gap-2 rounded-xl bg-white px-5 py-3 shadow-md"
  >
    <div class="flex items-center justify-between gap-2">
      <div class="h-7 w-0.5 rounded-md bg-primary-500" />
      <h1 class="translate-y-0.5 text-3xl font-light">{{ headerText }}</h1>
    </div>

    <div
      v-if="!municipalitySubmitted"
      class="flex h-full items-center justify-between gap-5"
    >
      <div
        v-if="hasUnsavedChanges"
        class="flex items-center justify-center gap-2 rounded-lg border border-orange-500/50 px-3 py-1"
      >
        <div class="-mt-0.5 size-2 rounded-full bg-orange-500" />
        Husk å lagre endringene
      </div>
      <div
        v-if="!canBeEdited"
        class="flex items-center justify-center gap-2 rounded-lg border border-red-500 px-3 py-1"
      >
        <div class="-mt-0.5 size-2 rounded-full bg-red-500" />
        Du kan ikke gjøre endringer
      </div>

      <button
        :disabled="!canBeEdited"
        :class="[
          'management-button border-primary-500 bg-primary-500',
          { disabled: !canBeEdited },
        ]"
        @click="handleUploadCircuits"
      >
        <div class="rounded-[.3rem] bg-white p-1 text-primary-500">
          <LucideSave :size="20" />
        </div>
        <div class="mt-0.5 px-2 font-medium">Lagre</div>
      </button>
      <button
        :disabled="!canBeEdited"
        :class="[
          'management-button border-primary-500 bg-white',
          { disabled: !canBeEdited },
        ]"
        @click="handleEraseAreas"
      >
        <LucideHistory class="ml-2 text-primary-500" :size="20" />
        <div class="mt-0.5 px-2 font-medium">Sist lagrede</div>
      </button>

      <div class="h-full w-0.5 rounded-md bg-primary-500" />

      <button
        :disabled="!canBeEdited"
        :class="[
          'management-button border-primary-500 bg-primary-500',
          { disabled: !canBeEdited },
        ]"
        @click="handleSubmitMunicipality"
      >
        <div class="rounded-[.3rem] bg-white p-1 text-primary-500">
          <LucideSendHorizonal :size="20" />
        </div>
        <div class="mt-0.5 px-2 font-medium">Send inn</div>
      </button>
    </div>
    <div
      v-else
      class="flex items-center justify-center gap-2 rounded-lg border border-red-500 px-3 py-1"
    >
      <div class="-mt-0.5 size-2 rounded-full bg-red-500" />
      Soneinndelingen er sendt inn
    </div>
  </div>

  <CommonConfirmationModal
    v-if="modalData"
    v-bind="modalData"
    v-model:is-open="isModalOpen"
  />
</template>

<script lang="ts" setup>
defineProps({
  headerText: { type: String, required: true },
});

const isModalOpen = ref(false);
const modalData = ref<{
  title: string;
  text: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
} | null>(null);

function handleEraseAreas() {
  modalData.value = {
    title: "Sist lagrede",
    text: "Endringene blir tilbakestilt til siste gang soneinndelingen ble lagret. Er du sikker?",
    confirmText: "Ja – Tilbakestill",
    cancelText: "Nei – Avbryt",
    onConfirm: eraseAreasFromLS,
  };
  isModalOpen.value = true;
}

function handleUploadCircuits() {
  uploadCircuits();
}

function handleSubmitMunicipality() {
  modalData.value = {
    title: "Send inn soneforslag",
    text: "Ønsker du å sende inn ditt endelige forslag til Nabolagshelse? Du vil ikke kunne gjøre flere endringer etter at forslaget er sendt inn.",
    confirmText: "Ja – Send inn",
    cancelText: "Nei – Avbryt",
    onConfirm: submitMunicipality,
  };
  isModalOpen.value = true;
}

const { eraseAreasFromLS, uploadCircuits, submitMunicipality } =
  useZoneSelection();
const { hasUnsavedChanges, canBeEdited, municipalitySubmitted } =
  storeToRefs(useZoneSelection());
</script>

<style scoped>
.management-button {
  @apply flex items-center justify-center rounded-lg border p-1 duration-200 hover:scale-[1.025];

  &.disabled {
    @apply opacity-50 hover:scale-100;
  }
}
</style>
