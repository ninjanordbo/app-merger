<template>
  <NuxtLayout :name="layoutName">
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
type LayoutName = "landing" | "dashboard" | "sonebygger";

const route = useRoute();

const layoutName = computed<LayoutName>(() => {
  return (route.meta.layout as LayoutName) ?? "default";
});

const pageTitle = computed(() => {
  return (route.meta.title as string) ?? "Prototype";
});

useHead({
  title: pageTitle,
});
</script>
