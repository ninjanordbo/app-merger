<template>
  <button
    :class="[
      'flex items-center justify-start gap-1.5 rounded-md border-2 p-1 pr-2 text-sm text-black duration-200',
      cardType.isComing
        ? 'cursor-not-allowed border-gray-400 bg-white'
        : isSelected
          ? 'border-primary-500 bg-primary-500 text-white'
          : 'border-primary-500 bg-white group-hover:bg-primary-500/65 group-hover:text-white',
    ]"
    :disabled="cardType?.isComing"
    @click="() => selectCardType(cardType)"
  >
    <component
      :is="cardType.icon"
      :class="[
        cardType.isComing
          ? 'text-gray-400'
          : isSelected
            ? 'text-white'
            : 'text-primary-500 group-hover:text-white',
      ]"
    />
    <div class="mt-0.5">{{ cardType.label }}</div>
  </button>
</template>

<script lang="ts" setup>
defineProps({
  cardType: {
    type: Object as PropType<CardCreationType>,
    required: true,
  },
  selectCardType: {
    type: Function as PropType<(cardType: CardCreationType) => void>,
    required: true,
  },
  isSelected: {
    type: Boolean,
    required: true,
  },
});
</script>
