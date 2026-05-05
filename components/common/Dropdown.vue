<template>
  <div
    ref="dropdownElement"
    class="flex min-w-32 flex-col items-start justify-center"
  >
    <div v-if="label" class="mb-0.5 pl-1 text-xs">{{ label }}</div>

    <!-- Dropdown button -->
    <button
      :class="[
        'flex w-full items-center justify-between gap-2 rounded-md border bg-white py-0.5 pl-3 pr-2 shadow-sm duration-100',
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
        @change="onChange"
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
        :size="16"
      />
    </button>

    <!-- Dropdown options -->
    <div class="relative w-full">
      <div
        ref="dropdownOptions"
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
            selectedItem === item ? 'bg-gray-100' : 'bg-white',
          ]"
          @click="
            () => {
              selectItem(item);
              handleToggleDropdown();
            }
          "
        >
          <div class="text-start font-light">
            {{ valueTransform ? valueTransform(item.toString()) : item }}
          </div>
          <LucideCheck v-if="selectedItem === item" :size="15" color="black" />
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
  items: { type: Array as PropType<(string | number)[]>, required: true },
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    required: true,
  },
  valueTransform: {
    type: Function as PropType<(value: string | null) => string>,
  },
  inProgress: { type: Boolean, default: false },
  onToggle: { type: Function },
});

const emit = defineEmits<{
  (eventName: "update:modelValue", value: string | number): void;
}>();

const selectedItem = computed<string | number>({
  get: () => props.modelValue as string | number,
  set: (value: string | number) => {
    emit("update:modelValue", value);
  },
});

function selectItem(item: string | number) {
  if (selectedItem.value !== item) {
    selectedItem.value = item;
  }
  inputted.value = props.valueTransform
    ? props.valueTransform(item.toString())
    : item.toString();
}

const inputted = ref(
  props.valueTransform
    ? props.valueTransform(selectedItem.value.toString())
    : selectedItem.value.toString(),
);

const isOpen = ref<boolean>(false);

function handleToggleDropdown() {
  props.onToggle?.();

  isOpen.value = !isOpen.value;

  if (isOpen.value) {
    nextTick().then(() => {
      scrollDropdownIntoView();
      scrollToSelectedItem();
    });
    return;
  }

  const transformedSelectedItem =
    selectedItem.value && props.valueTransform
      ? props.valueTransform(selectedItem.value.toString())
      : selectedItem.value.toString() || "";

  if (transformedSelectedItem === inputted.value) return;

  inputted.value = transformedSelectedItem;
  dropdownItems.value = props.items;
}

const dropdownElement = ref<HTMLElement | null>(null);
const dropdownOptions = ref<HTMLElement | null>(null);

onClickOutside(dropdownElement, () => {
  if (!isOpen.value) return;
  onChange();
});

function onInput() {
  dropdownItems.value = props.items.filter((item) =>
    item.toString().toLowerCase().startsWith(inputted.value.toLowerCase()),
  );
}

function onChange() {
  if (props.items.map(String).includes(inputted.value.toString())) {
    selectItem(inputted.value);
  }
  if (isOpen.value) {
    handleToggleDropdown();
  }
}

const dropdownItems = ref<(string | number)[]>(props.items);

function scrollDropdownIntoView() {
  if (dropdownElement.value) {
    setTimeout(() => {
      dropdownOptions.value?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }, 200);
  }
}

const itemRefs = ref<Array<HTMLElement | null>>([]);

function setItemRef(el: HTMLElement | null, index: number) {
  itemRefs.value[index] = el;
}

function scrollToSelectedItem() {
  const idx = dropdownItems.value.findIndex(
    (it: any) => it === selectedItem.value,
  );
  if (idx < 0) return;

  const el = itemRefs.value[idx];
  el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// When modelValue changes from outside OR on initial mount
watch(
  () => props.modelValue,
  (newVal) => selectItem(newVal),
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
</script>
