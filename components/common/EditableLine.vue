<template>
  <div
    class="flex items-stretch gap-1 rounded-md border duration-200"
    :class="[
      isEditing
        ? isInputFocused
          ? 'border-2 border-primary'
          : 'border-gray-300'
        : 'border-transparent',

      isEditing ? 'px-3 py-1' : 'p-0',

      {
        'text-sm': size === 'sm',
        'text-base': size === 'md',
        'text-xl': size === 'lg',
        'text-2xl': size === 'xl',
      },
    ]"
  >
    <div class="flex min-w-0 flex-1 items-center">
      <input
        v-if="isEditing"
        ref="inputEl"
        v-model="inputted"
        class="min-w-0 flex-1 border-none outline-none duration-200"
        :placeholder="placeholder"
        @keydown.enter="isEditing = false"
      />
      <div v-else class="min-w-0 flex-1">
        {{ inputted }}
      </div>
    </div>

    <button
      class="my-1 flex items-center justify-center pl-2 duration-200"
      :class="isEditing ? 'border-l' : 'border-none'"
      @click="toggleIsEditing"
    >
      <LucideSave
        v-if="isEditing"
        class="-mt-0.5 text-primary-500"
        :size="16"
      />
      <LucidePencil v-else class="-mt-0.5 text-gray-400" :size="13" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useFocus } from "@vueuse/core";

import type { PropType } from "vue";

const isEditing = ref(false);

function toggleIsEditing() {
  isEditing.value = !isEditing.value;

  if (isEditing.value) {
    setTimeout(() => {
      inputEl.value?.focus();
    });
  }
}

const props = defineProps({
  modelValue: {
    type: [String, null] as any,
    required: true,
  },
  placeholder: {
    type: String,
  },
  size: {
    type: String as PropType<"sm" | "md" | "lg" | "xl">,
    default: "md",
  },
});

const emit = defineEmits<{
  (eventName: "update:modelValue", value: string | null): void;
}>();

const inputted = computed({
  get: () => props.modelValue,
  set: (value: string | null) => {
    emit("update:modelValue", value);
  },
});

const inputEl = ref<HTMLInputElement | null>(null);
const { focused: isInputFocused } = useFocus(inputEl);
</script>
