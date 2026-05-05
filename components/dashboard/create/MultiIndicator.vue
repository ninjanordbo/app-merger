<template>
  <div
    class="grid h-max w-full grid-cols-[2fr,3fr,min-content] items-stretch justify-between gap-x-8 gap-y-4 rounded-2xl bg-white p-8"
  >
    <div
      class="flex w-full items-center justify-center px-1 text-center text-base"
    >
      Klikk på en egenskap for å fjerne den fra kortet
    </div>

    <div
      class="col-span-2 flex items-center justify-center justify-self-start px-1 text-center text-base"
    >
      Klikk på en egenskap for å velge eller fjerne det fra kortet
    </div>

    <div
      class="row-span flex h-full w-full items-center justify-center rounded-xl border p-5"
    >
      <div
        v-if="selectedItems.length"
        v-auto-animate
        class="grid h-full w-full flex-grow grid-cols-[repeat(auto-fill,minmax(7vw,1fr))] items-start justify-center gap-5"
      >
        <button
          v-for="indicator in selectedItems"
          :key="indicator.name"
          class="grid grid-rows-subgrid justify-center justify-items-center gap-1 rounded-2xl border-2 border-transparent bg-gray-100 px-7 py-3 duration-200 hover:border-primary"
          style="grid-row: span 2"
          @click="() => selectItem(indicator)"
        >
          <component
            :is="indicator.iconComponent"
            size="2.5rem"
            class="mb-2 self-end text-primary"
          />
          <div class="hyphens-auto text-center text-xs 2xl:text-sm">
            {{ indicator.name }}
            <br />
            {{ indicator.indicationName && indicator.indicationName + "," }}
            X {{ indicator.unit }}
          </div>
        </button>
      </div>
      <div
        v-else
        class="flex h-full w-full items-center justify-center px-5 text-center text-sm font-light text-gray-500"
      >
        Velg en eller flere infografiske fremstillinger fra menyen for å sette
        sammen et infografisk kort.
      </div>
    </div>

    <div
      class="col-span-2 grid h-max w-full flex-grow grid-cols-[repeat(auto-fit,minmax(100px,130px))] items-stretch justify-start gap-4"
    >
      <button
        v-for="indicator in props.indicators"
        :key="indicator.name"
        :class="[
          'group grid aspect-square grid-rows-2 items-center justify-items-center gap-3 rounded-xl border-2 px-7 py-3 text-center text-xs duration-200',
          isIndicatorSelected(indicator)
            ? 'border-primary-500 bg-primary-500 text-white'
            : 'border-primary-500 bg-white text-primary-500 hover:bg-primary-500 hover:bg-opacity-50 hover:text-white',
        ]"
        @click="() => selectItem(indicator)"
      >
        <component
          :is="indicator.iconComponent"
          size="2.2rem"
          class="self-end"
        />
        <div
          :class="[
            'hyphens-auto group-hover:text-white',
            isIndicatorSelected(indicator) ? 'text-white' : 'text-black',
          ]"
        >
          {{ indicator.name }}
        </div>
      </button>
    </div>

    <button
      class="col-span-3 w-min justify-self-end rounded-lg bg-primary-500 px-8 py-2 text-center align-middle text-white duration-200 hover:-translate-y-1"
      @click="() => createCard(selectedItems)"
    >
      Bruk
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { GeoDataVisualKey } from "~/utils/types";

const props = defineProps({
  indicators: { type: Array as PropType<GeoDataVisualKey[]>, required: true },
  createCard: {
    type: Function as PropType<(selectedItems: GeoDataVisualKey[]) => void>,
    required: true,
  },
  selectedItems: {
    type: Array as PropType<GeoDataVisualKey[]>,
    required: true,
  },
  selectItem: {
    type: Function as PropType<(item: GeoDataVisualKey) => void>,
    required: true,
  },
});

function isIndicatorSelected(indicator: GeoDataVisualKey) {
  return props.selectedItems.find((item) => item.name === indicator.name);
}
</script>
