<template>
  <div
    class="flex h-screen max-h-screen w-full flex-col items-center justify-start gap-5 p-5"
  >
    <AreaSelectionHeader
      header-text="Sonebygger"
      class="flex-shrink flex-grow-0"
    />
    <div
      class="overfow-hidden grid h-full max-h-full w-full min-w-[40rem] grid-cols-2 grid-rows-[1fr,min-content] overflow-hidden rounded-2xl bg-gray-100 p-5"
    >
      <AreaSelectionBoard />
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "sonebygger",
  title: "Sonebygger",
});
</script>
