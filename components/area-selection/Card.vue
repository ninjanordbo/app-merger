<template>
  <div
    :class="['grid-stack-item h-full overflow-hidden', !draggable && 'no-drag']"
    :gs-w="cardWidth"
    :gs-h="cardHeight"
    :gs-min-w="cardMinWidth"
    :gs-min-h="cardMinHeight"
    :gs-no-resize="noResize"
    :gs-no-move="noMove"
    :gs-locked="locked"
  >
    <div class="grid-stack-item-content h-full w-full rounded-xl p-1">
      <div
        class="flex h-full w-full flex-col items-center justify-center gap-3 overflow-auto rounded-lg bg-white/90 p-2"
      >
        <div class="flex w-full flex-none items-center justify-between gap-3">
          <div class="flex min-w-0 flex-1 items-center justify-start gap-3">
            <LucideGrip v-if="!noMove" class="card-handle" :size="20" />

            <h2 v-if="title" class="flex items-center gap-2 text-xl font-light">
              <div class="h-5 w-0.5 bg-primary-500" />
              <span class="mt-1 line-clamp-1 truncate">
                {{ title }}
              </span>
            </h2>

            <slot name="header-content" />
          </div>

          <!-- <div class="flex gap-3 items-center justify-center flex-none">
            <LucideSettings class="ml-auto" :size="20" />
            <LucideDownload :size="20" />
            <LucideShare2 :size="20" />
            <LucideMaximize2
              :size="20"
              class="ui-resizable-handle ui-resizable-se"
            />
            <LucideEye :size="20" />
            <button v-if="deletable" @click="() => deleteCard(id)">
              <LucideTrash2 :size="20" color="red" />
            </button>
          </div> -->
        </div>

        <div class="h-full w-full flex-grow">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// const { deleteCard } = useDashboard();

defineProps({
  id: { type: Number, required: true },
  title: { type: String },
  cardWidth: { type: Number, default: 2 },
  cardHeight: { type: Number, default: 2 },
  cardMinWidth: { type: Number, default: 0 },
  cardMinHeight: { type: Number, default: 0 },
  draggable: { type: Boolean, default: true },
  noResize: { type: Boolean, default: false },
  noMove: { type: Boolean, default: false },
  locked: { type: Boolean, default: false },
  onResize: { type: Function as PropType<() => void> },
  deletable: { type: Boolean, default: true },
});
</script>

<style scoped>
.truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
