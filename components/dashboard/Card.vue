<template>
  <div
    ref="gridItem"
    :gs-id="id.toString()"
    :data-card-id="id.toString()"
    :class="[
      'grid-stack-item',
      !draggable && 'no-drag',
      gridItem?.classList.contains('ui-draggable-dragging') &&
        'cursor-grabbing',
    ]"
    :gs-w="cardWidth"
    :gs-h="cardHeight"
    :gs-x="x"
    :gs-y="y"
    :gs-min-w="cardMinWidth"
    :gs-min-h="cardMinHeight"
    :gs-no-resize="noResize"
    :gs-no-move="noMove"
    :gs-locked="locked"
  >
    <div class="grid-stack-item-content h-full w-full rounded-xl p-1">
      <div
        class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg bg-white/90 p-2"
      >
        <div
          v-if="$slots.options || title"
          class="flex w-full flex-none items-center justify-between gap-3"
        >
          <div class="flex min-w-0 flex-1 items-center justify-start gap-3">
            <LucideGrip
              v-if="!noMove"
              class="card-handle cursor-grab"
              :size="20"
            />

            <h2
              v-if="title"
              class="flex min-w-0 items-center gap-2 overflow-hidden text-xl font-light"
            >
              <div class="h-5 w-0.5 bg-primary-500" />
              <span class="mt-1 line-clamp-1 truncate">
                {{ title }}
              </span>
            </h2>
          </div>

          <div class="flex flex-none items-center justify-center gap-3">
            <slot name="options" />
          </div>
        </div>

        <div class="h-full w-full flex-grow overflow-hidden">
          <slot name="in-card-options" class="z-10" />
          <slot class="z-0" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  id: { type: Number, required: true },
  title: { type: String },
  cardWidth: { type: Number, default: 2 },
  cardHeight: { type: Number, default: 2 },
  cardMinWidth: { type: Number, default: 0 },
  cardMinHeight: { type: Number, default: 0 },
  x: { type: Number },
  y: { type: Number },
  draggable: { type: Boolean, default: true },
  noResize: { type: Boolean, default: false },
  noMove: { type: Boolean, default: false },
  locked: { type: Boolean, default: false },
  onResize: { type: Function as PropType<() => void> },
});

const gridItem = ref<HTMLElement | null>(null);
</script>

<style scoped>
.truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
