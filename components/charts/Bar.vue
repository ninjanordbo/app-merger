<template>
  <ApexChart
    ref="chart"
    height="95%"
    width="95%"
    :options="optionsRef"
    :series="seriesRef"
  />
</template>

<script setup lang="ts">
import { until } from "@vueuse/core";
import { shallowRef, markRaw, watch, nextTick } from "vue";
import ApexChart from "vue3-apexcharts";

import type { ApexOptions } from "apexcharts";

const chart = shallowRef<(ApexCharts & { chart: ApexCharts }) | null>(null);
const exportMethods: CardExportMethods[] = ["png", "svg"];

defineExpose({
  exportCard: (format: CardExportMethods) => {
    switch (format) {
      case "png":
        return chart.value?.chart.exports.exportToPng();
      case "csv":
        return chart.value?.chart.exports.exportToCSV();
      case "svg":
        return chart.value?.chart.exports.exportToSVG();

      default:
        throw new Error("Invalid export method");
    }
  },
  exportMethods,
});

const props = defineProps({
  categories: { type: Array as PropType<string[]>, required: true },
  series: { type: Array as PropType<ApexAxisChartSeries>, required: true },
  lines: { type: String as PropType<"y" | "x" | "all"> },
  chartMode: { type: String as PropType<"numeric" | "percent"> },
  valueTitle: { type: String },
  percentValueTitle: { type: String },
});

const ready = ref(false);

const optionsRef = ref<ApexOptions>(
  markRaw({
    chart: {
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      events: {
        mounted: () => (ready.value = true),
      },
      offsetX: 0,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        barHeight: "8px",
        borderRadius: 4,
        borderRadiusApplication: "end",
        horizontal: true,
      },
    },
    colors: ["#89B56B"],
    dataLabels: {
      enabled: false,
    },
  }),
);

const seriesRef = shallowRef<ApexAxisChartSeries>(markRaw([]));
watch(
  () =>
    [
      props.series,
      props.categories,
      props.chartMode,
      props.lines,
      props.valueTitle,
      props.percentValueTitle,
    ] as const,
  async ([ser, cats, mode, lines, valueTitle, percentTitle]) => {
    await nextTick();
    await until(ready).toBeTruthy();

    const seriesDataValues = ser[0].data.filter(
      (data) => typeof data === "number",
    );

    const isPercent = mode === "percent";
    const xAxisTitle = (isPercent ? (percentTitle ?? "%") : valueTitle) ?? "";
    const optPatch: ApexOptions = {
      responsive: [
        {
          breakpoint: 400,
          options: {
            yaxis: { labels: { show: false } },
          },
        },
        {
          breakpoint: 640,
          options: {
            yaxis: {
              labels: {
                maxWidth: 60,
                style: { fontSize: "10px" },
              },
            },
          },
        },
      ],
      xaxis: {
        categories: cats,
        min: 0,
        max: niceValue(Math.max(...seriesDataValues), "ceil"),
        tickAmount: 5,
        title: {
          text: xAxisTitle,
          style: { fontSize: "14px" },
        },
        labels: {
          formatter: (value) => value.toString().replace(".", ","),
        },
      },
      tooltip: {
        y: {
          title: { formatter: () => "" },
          formatter: (val) =>
            isPercent
              ? `${formatNumberWithSpaces(val)}%`
              : `${valueTitle}: ${formatNumberWithSpaces(val)}`,
        },
      },
      grid: {
        xaxis: { lines: { show: lines === "x" || lines === "all" } },
        yaxis: { lines: { show: lines === "y" || lines === "all" } },
      },
    };

    chart.value?.updateOptions(optPatch, false, false, false);

    const sliced = ser.map((s) => ({
      name: s.name,
      data: s.data.slice(0, cats.length),
    }));
    chart.value?.updateSeries(sliced, false);
  },
  { immediate: true, flush: "post" },
);
</script>
