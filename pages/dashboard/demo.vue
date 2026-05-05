<template>
  <div class="flex h-full w-full flex-col items-center justify-start gap-5 p-5">
    <DashboardHeader class="sticky left-0 top-0 z-20">
      <template #text>
        <span class="text-xl font-light text-gray-700">Nabolagshelse Demo</span>
      </template>
    </DashboardHeader>
    <DashboardBoard class="z-10" />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  title: "Demo",
});
useHead({ title: "Nabolagshelse Demo" });
</script>
