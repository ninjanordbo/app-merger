<template>
  <ApexChart
    ref="chart"
    height="95%"
    width="95%"
    :options="chartOptions"
    :series="slicedSeries"
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
  categoryTitle: { type: String },
  valueTitle: { type: String },
  percentValueTitle: { type: String },
  categories: { type: Array as PropType<string[]>, required: true },
  series: {
    type: Array as PropType<ApexAxisChartSeries>,
    required: true,
  },
  lines: { type: String as PropType<"y" | "x" | "all"> },
  chartMode: { type: String as PropType<"numeric" | "percent"> },
});

// Slicing series to make sure amount of series corresponds to amount of categories
const slicedSeries = computed(() =>
  props.series.map((s) => ({
    ...s,
    data: s.data.slice(0, props.categories.length),
  })),
);

const chartOptions = computed<ApexOptions>(() => {
  const seriesDataValues = props.series[0].data.filter(
    (data) => typeof data === "number",
  );

  const isPercent = props.chartMode === "percent";
  const yAxisTitle =
    (isPercent ? (props.percentValueTitle ?? "%") : props.valueTitle) ?? "";

  return {
    chart: {
      offsetX: 0,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    colors: ["#89B56B"],
    plotOptions: {
      bar: {
        barHeight: "8px",
        borderRadius: 4,
        borderRadiusApplication: "end",
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: props.lines === "y" || props.lines === "all",
        },
      },
      xaxis: {
        lines: {
          show: props.lines === "x" || props.lines === "all",
        },
      },
    },
    yaxis: {
      max: niceValue(Math.max(...seriesDataValues), "ceil"),
      title: {
        text: yAxisTitle,
        rotate: -90,
        style: {
          fontSize: "14px",
        },
      },
      labels: {
        formatter: (val: number) => val.toString().replace(".", ","),
      },
    },
    xaxis: {
      title: {
        text: props.categoryTitle ?? "",
        offsetX: 0,
        offsetY: 0,
        style: {
          fontSize: "14px",
        },
      },
      categories: props.categories,
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
    tooltip: {
      y: {
        title: { formatter: () => "" },
        formatter: (val) =>
          props.chartMode === "percent"
            ? `${formatNumberWithSpaces(val)}%`
            : `${props.valueTitle}: ${formatNumberWithSpaces(val)}`,
      },
    },
  };
});
</script>
