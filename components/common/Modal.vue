<template>
  <div
    v-if="isOpen"
    class="fixed left-0 top-0 z-[999] flex h-screen w-screen items-start justify-center overflow-y-auto bg-black/40 p-5 xl:items-center"
  >
    <div class="absolute left-0 top-0 z-10 h-full w-full" @click="closeModal" />

    <div
      class="absolute z-20 w-full max-w-[90rem] px-5 pb-10"
      :class="{
        'min-w-[30%] max-w-[95%]': size === 'max',
        'min-w-[30%] max-w-7xl': size === 'lg',
        'min-w-[10%] max-w-3xl': size === 'sm',
      }"
    >
      <LucideX
        class="mb-1 mr-1 cursor-pointer justify-self-end text-white"
        :size="24"
        @click="closeModal"
      />
      <div class="w-full rounded-2xl bg-gray-100 xl:max-h-[90vh]">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, required: false },
  size: { type: String as PropType<"sm" | "lg" | "xl" | "max">, default: "sm" },
});

const emit = defineEmits(["update:isOpen"]);
const closeModal = () => emit("update:isOpen", false);

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});
</script>

<style>
.management-button {
  @apply flex items-center justify-center rounded-lg border bg-opacity-80 px-3 py-1 duration-200 hover:scale-[1.025];
}
</style>
