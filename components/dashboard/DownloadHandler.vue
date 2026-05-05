<template>
  <div
    ref="dropdownElement"
    class="flex w-min flex-col items-start justify-center"
  >
    <button @click="handleToggleDropdown">
      <LucideDownload :size="20" />
    </button>

    <div class="relative w-full">
      <div
        ref="dropdownOptions"
        :class="[
          isOpen && exportMethods.length
            ? 'max-h-40 opacity-100'
            : 'max-h-0 opacity-0',
          'absolute right-0 top-0 z-50 mt-1 grid w-full min-w-20 overflow-y-auto overflow-x-hidden rounded-md border bg-white shadow-sm duration-200 ease-in',
        ]"
      >
        <button
          v-for="(item, index) in exportMethods"
          :key="index"
          :class="[
            'flex cursor-pointer items-center justify-between py-1 pl-3 pr-2 hover:bg-gray-50',
          ]"
          @click="
            () => {
              handleExport(item);
              handleToggleDropdown();
            }
          "
        >
          <div class="text-start font-light capitalize">
            {{ item }}
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";

defineProps({
  handleExport: {
    type: Function as PropType<(format: CardExportMethods) => void>,
    required: true,
  },
  exportMethods: {
    type: Array as PropType<CardExportMethods[]>,
    required: true,
  },
});

const isOpen = ref(false);

function handleToggleDropdown() {
  isOpen.value = !isOpen.value;
}

const dropdownElement = ref<HTMLElement | null>(null);

onClickOutside(dropdownElement, () => {
  if (!isOpen.value) return;
  handleToggleDropdown();
});
</script>
