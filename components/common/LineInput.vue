<template>
  <div class="relative">
    <input
      v-model="inputted"
      :name="name"
      :type="type"
      :autocomplete="name"
      class="peer z-10 w-full rounded-md border border-gray-300 px-4 py-2 font-thin placeholder-transparent shadow-sm outline-primary"
    />

    <div
      :class="[
        'pointer-events-none absolute left-4 top-2.5 z-20 text-base font-light duration-200 peer-focus:-translate-y-4 peer-focus:bg-white peer-focus:px-1 peer-focus:text-xs peer-focus:text-primary',
        modelValue ? 'text-transparent' : 'text-neutral-400',
      ]"
    >
      {{ placeholder }}
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: [String, null] as any,
    required: true,
  },
  placeholder: {
    type: String,
  },
  name: {
    type: String,
  },
  type: {
    type: String,
    default: "text",
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
</script>

<style lang="scss" scoped></style>
