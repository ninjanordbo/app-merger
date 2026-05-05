<template>
  <label
    :class="[
      'flex items-center justify-between gap-1.5',
      !disabled && 'cursor-pointer',
    ]"
  >
    <div v-if="$slots.default" :class="['mt-0.5', disabled && 'text-gray-400']">
      <slot />
    </div>
    <span
      :class="[
        'flex size-[1.125rem] items-center justify-center rounded-[.25rem] border-2 duration-200',
        checked ? 'bg-primary-500' : 'bg-white',
        disabled ? 'border-gray-400' : 'border-primary-500',
      ]"
    >
      <LucideCheck :size="15" color="#fff" />

      <input
        v-model="checked"
        type="checkbox"
        class="h-0 w-0 select-none border-0 outline-none"
        :disabled="disabled"
        @change="onChange"
      />
    </span>
  </label>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  onChange: {
    type: Function as PropType<((payload: Event) => void) | undefined>,
  },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits<{
  (eventName: "update:modelValue", value: boolean): void;
}>();

const checked = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});
</script>
