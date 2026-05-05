<template>
  <div
    class="flex h-full w-full items-center justify-start self-center bg-gray-50"
  >
    <div class="mx-auto w-full max-w-4xl px-6 py-28">
      <!-- Simple Breadcrumb -->
      <CommonBreadcrumb :breadcrumbs="breadcrumbs" />

      <!-- Page Content -->
      <div class="mb-8 rounded-lg bg-white px-8 py-28 shadow-sm">
        <h1 class="mb-4 text-4xl font-bold text-gray-900">Forstå</h1>
        <p class="mb-8 text-xl text-gray-600">Konsepter og begreper</p>

        <div class="prose prose-lg max-w-none">
          <p class="mb-6 text-lg text-gray-700">
            Lær om de viktige konseptene og begrepene som brukes i
            Nabolagshelse-systemet.
          </p>

          <h2 class="mb-4 text-2xl font-semibold text-gray-900">
            Viktige begreper
          </h2>
          <div class="mb-6 space-y-3">
            <div class="border-l-4 border-primary-500 pl-4">
              <h3 class="font-semibold">Nabolagshelse</h3>
              <p class="text-gray-600">
                Oversikt over helse- og levekårsdata for geografiske områder
              </p>
            </div>
            <div class="border-l-4 border-primary-500 pl-4">
              <h3 class="font-semibold">Soner</h3>
              <p class="text-gray-600">
                Geografiske områder som brukes for dataanalyse
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "landing",
});

const breadcrumbs = [
  { label: "Hjem", href: "/" },
  { label: "Hjelp", href: "/hjelp" },
  { label: "Konsepter", href: "/hjelp/innsikt" },
];
</script>
