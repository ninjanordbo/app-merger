<template>
  <div
    ref="dropdownElement"
    class="relative flex min-w-40 flex-col items-start justify-center"
  >
    <div v-if="label" class="mb-0.5 pl-1 text-xs">{{ label }}</div>

    <button
      ref="dropdownOptions"
      :class="[
        'relative flex w-full items-center justify-between gap-2 rounded-md border py-0.5 pl-3 pr-2 shadow-sm duration-100',
        isOpen ? 'border-primary' : 'border-gray-300',
      ]"
      :disabled="inProgress"
      @click="handleToggleDropdown"
    >
      <LucideSearch :size="16" color="#666" class="-mt-0.5" />

      <input
        v-model="inputted"
        class="mt-0.5 h-full w-full bg-transparent py-1.5 font-light outline-none"
        type="text"
        placeholder="Søk"
        @click="
          (e) => {
            if (isOpen) e.stopPropagation();
          }
        "
        @input="onInput"
      />

      <LucideLoader2
        v-if="inProgress"
        :size="20"
        color="gray"
        class="animate-spin"
      />

      <LucideChevronDown
        v-else
        :class="[
          isOpen ? '-scale-100' : 'scale-100',
          'cursor-pointer duration-200',
        ]"
        :size="15"
      />
    </button>

    <div class="relative w-full">
      <div
        :class="[
          isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0',
          'absolute left-0 top-0 z-50 mt-1 grid w-full overflow-y-auto overflow-x-hidden rounded-md border bg-white shadow-sm duration-200 ease-in',
        ]"
      >
        <button
          v-for="(item, index) in dropdownItems"
          :ref="(el) => setItemRef(el as HTMLElement, index)"
          :key="index"
          :class="[
            'flex cursor-pointer items-center justify-between py-1 pl-3 pr-2 hover:bg-gray-50',
            isItemSelected(item) ? 'bg-gray-100' : 'bg-white',
          ]"
          @click="
            () => {
              handleSelectItem(item);
              handleToggleDropdown();
            }
          "
        >
          <div class="text-start font-light">
            {{ valueTransform(item) }}
          </div>

          <LucideCheck v-if="isItemSelected(item)" :size="15" color="black" />
        </button>
        <div
          v-if="!dropdownItems.length"
          class="w-full py-1 text-center text-sm text-gray-500"
        >
          Ingen elementer funnet
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";

const props = defineProps({
  label: { type: String },
  items: { type: Array as PropType<any[] | readonly any[]>, required: true },
  modelValue: {
    type: [Object, null] as PropType<Record<string, any> | null>,
  },
  valueTransform: {
    type: Function as PropType<(value: Record<string, any> | null) => string>,
    required: true,
  },
  inProgress: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (
    eventName: "update:modelValue",
    value: string | Record<string, any> | null,
  ): void;
}>();

const inputted = ref("");

const isOpen = ref<boolean>(false);

function handleToggleDropdown() {
  isOpen.value = !isOpen.value;

  if (isOpen.value) {
    nextTick().then(scrollToSelectedItem);
    return;
  }

  const transformedSelectedItem = selectedItem.value
    ? props.valueTransform(selectedItem.value)
    : "";

  if (transformedSelectedItem === inputted.value) return;

  inputted.value = transformedSelectedItem;
  dropdownItems.value = props.items;
}

const dropdownOptions = ref<HTMLElement | null>(null);
const itemRefs = ref<Array<HTMLElement | null>>([]);

function setItemRef(el: HTMLElement | null, index: number) {
  itemRefs.value[index] = el;
}

function scrollToSelectedItem() {
  const idx = dropdownItems.value.findIndex((it: any) => isItemSelected(it));
  if (idx < 0) return;

  const el = itemRefs.value[idx];
  el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

const dropdownItems = ref(props.items);

const selectedItem = ref<typeof props.modelValue>(props.modelValue);

function handleSelectItem(item: typeof props.modelValue) {
  selectedItem.value = item;

  if (!selectedItem.value) {
    inputted.value = "";
    return;
  }

  inputted.value = props.valueTransform(selectedItem.value);
  emit("update:modelValue", selectedItem.value);
}

function onInput() {
  const needle = inputted.value.toLowerCase();
  dropdownItems.value = (props.items as any[]).filter((item) =>
    props.valueTransform(item).toLowerCase().startsWith(needle),
  );
}

function isItemSelected(item: typeof props.modelValue) {
  return (
    selectedItem.value &&
    item &&
    props.valueTransform(selectedItem.value) === props.valueTransform(item)
  );
}

// When modelValue changes from outside OR on initial mount
watch(
  () => props.modelValue,
  (newVal) => handleSelectItem(newVal),
  { immediate: true },
);

// Reset dropdownItems when items prop changes
watch(
  () => props.items,
  (newItems) => {
    dropdownItems.value = [...newItems];
    itemRefs.value = [];
  },
  { immediate: true },
);

watch(
  () => dropdownItems.value,
  () => {
    itemRefs.value = [];
  },
);

// Reference to dropdown element for outside click detection
const dropdownElement = ref<HTMLElement | null>(null);
onClickOutside(dropdownElement, () => {
  if (!isOpen.value) return;
  handleToggleDropdown();
});
</script>
