<template>
  <div class="py-5">
    <div class="grid-stack">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBreakpoints } from "@vueuse/core";

onMounted(() => {
  setGridColumns(gridOptsByBp[currentBp.value].columns);
});

type BpKey = "lg" | "md" | "sm";

const bps = {
  lg: 1400,
  md: 1080,
  sm: 0,
};

const gridOptsByBp: Record<BpKey, { columns: number }> = {
  lg: { columns: 6 },
  md: { columns: 4 },
  sm: { columns: 2 },
};

const breakpoints = useBreakpoints(bps);
const isLg = breakpoints.greaterOrEqual("lg");
const isMd = breakpoints.between("md", "lg");

const currentBp = computed<BpKey>(() =>
  isLg.value ? "lg" : isMd.value ? "md" : "sm",
);

watch(currentBp, () => {
  setGridColumns(gridOptsByBp[currentBp.value].columns);
});
</script>
