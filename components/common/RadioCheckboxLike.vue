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
        :checked="checked"
        type="radio"
        class="h-0 w-0 select-none border-0 outline-none"
        :value="props.value"
        :disabled="disabled"
        @change="onInputChange"
      />
    </span>
  </label>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
  },
  value: {
    type: [String, Number],
    required: true,
  },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (event: "update:modelValue", value: string | number): void;
  (event: "change", originalEvent: Event): void;
}>();

const checked = computed(() => props.modelValue === props.value);

function onInputChange(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.checked) return;

  emit("update:modelValue", props.value);
  emit("change", e);
}
</script>
