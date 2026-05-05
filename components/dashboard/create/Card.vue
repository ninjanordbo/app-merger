<template>
  <div class="flex w-full flex-col gap-5 rounded-2xl bg-gray-200 p-5">
    <div
      class="flex h-full w-full flex-col items-start justify-start gap-6 rounded-xl bg-white px-8 pb-7 pt-5"
    >
      <slot name="card-types" />
    </div>

    <Transition v-bind="TransitionCollapseHeight('max-h-40')">
      <div
        v-if="selectedCardType && showCardTypeInfo?.get(selectedCardType.label)"
        class="flex w-full items-start justify-between gap-5 overflow-hidden rounded-xl bg-primary-500 bg-opacity-50 px-8 py-5 duration-200"
      >
        <div>{{ selectedCardType?.cardDescription }}</div>

        <button
          @click="
            () =>
              selectedCardType &&
              showCardTypeInfo?.set(selectedCardType.label, false)
          "
        >
          <LucideX :size="20" />
        </button>
      </div>
    </Transition>

    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  selectedCardType: {
    type: Object as PropType<CardCreationType>,
  },
  selectCardType: {
    type: Function as PropType<(card: CardCreationType) => void>,
    required: true,
  },
});

const { showCardTypeInfo } = storeToRefs(useCreateCard());
</script>
