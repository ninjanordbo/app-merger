<template>
  <div v-if="isOpen" class="fixed left-0 top-0 z-[999] h-screen w-screen">
    <div
      class="absolute left-0 top-0 h-full w-full bg-black/20"
      @click="closeModal"
    />
    <div
      ref="modalElement"
      class="absolute left-1/2 top-1/2 flex min-w-[10%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-5 rounded-xl bg-white p-5 xl:max-w-[30%]"
    >
      <div
        class="flex w-full items-center justify-between rounded-xl border-[0.5px] border-primary-500 bg-primary/20 px-3 py-1.5"
      >
        <div class="text-xl">{{ title ?? "Bekreftelse" }}</div>
        <button class="-mt-0.5" @click="closeModal">
          <LucideX :size="20" />
        </button>
      </div>

      <div class="px-3">{{ text }}</div>

      <div class="grid w-full grid-cols-2 gap-2 px-3">
        <button
          class="management-button border-primary-500 bg-primary-500"
          @click="
            async () => {
              await onConfirm();
              closeModal();
            }
          "
        >
          {{ confirmText }}
        </button>
        <button
          class="management-button border-primary-500 bg-white"
          @click="closeModal"
        >
          {{ cancelText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, required: false },
  text: { type: String, required: true },
  confirmText: { type: String, required: true },
  cancelText: { type: String, required: true },
  onConfirm: {
    type: Function as PropType<() => void | Promise<void>>,
    required: true,
  },
});

const emit = defineEmits(["update:isOpen"]);

const modalElement = ref<HTMLElement | null>(null);

const closeModal = () => emit("update:isOpen", false);
</script>

<style scoped>
.management-button {
  @apply flex items-center justify-center rounded-lg border bg-opacity-80 px-3 py-1 duration-200 hover:scale-[1.025];
}
</style>
