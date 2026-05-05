<template>
  <NuxtLayout :name="layoutName">
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
import "gridstack/dist/gridstack.min.css";
import "gridstack/dist/gridstack-extra.min.css";

type LayoutName = "landing" | "dashboard" | "sonebygger";

const route = useRoute();

const layoutName = computed<LayoutName>(() => {
  return (route.meta.layout as LayoutName) ?? "landing";
});

const pageTitle = computed(() => {
  return (route.meta.title as string) ?? "Nabolagshelse";
});

useHead({
  title: pageTitle,
});
</script>
