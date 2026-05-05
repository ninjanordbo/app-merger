<template>
  <ApexChart
    ref="chart"
    height="100%"
    width="100%"
    :options="chartOptions"
    :series="pieSeries"
  />
</template>

<script lang="ts" setup>
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
  series: {
    type: Array as PropType<ApexAxisChartSeries | ApexNonAxisChartSeries>,
    required: true,
  },
  chartMode: { type: String as PropType<"numeric" | "percent"> },
});

const pieSeries = computed<ApexAxisChartSeries | ApexNonAxisChartSeries>(() => {
  if (props.series.every((data) => data === 0)) return [100];
  return props.series.slice(0, props.categories.length);
});

const chartOptions = computed<ApexOptions>(() => ({
  series: pieSeries.value,
  chart: {
    type: "pie",
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    y: {
      formatter: (value) => formatNumberWithSpaces(value),
    },
  },
  dataLabels: {
    formatter: (_value, options) => {
      const value: string | number =
        options.w.config.series[options.seriesIndex];
      const formattedRes =
        typeof value === "number"
          ? formatNumberWithSpaces(value)
          : value.toString();

      return formattedRes + (props.chartMode === "percent" ? "%" : "");
    },
  },
  labels: props.categories,
  colors: [
    // "#F3F8F0",
    // "#CFE1C4",
    "#B8D3A6",
    "#A0C489",
    "#88B56B",
    "#6D9156",
    "#526D40",
    "#36482B",
    "#1B2415",
    "#000000",
  ],
  states: {
    hover: {
      filter: {
        type: "lighten",
        value: 0.1,
      },
    },
  },
  legend: {
    position: "bottom",
    floating: false,
  },
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
}));
</script>
