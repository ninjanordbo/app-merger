<template>
  <div
    class="flex h-full w-full items-center justify-start self-center bg-gray-50"
  >
    <div class="mx-auto w-full max-w-4xl px-6 py-28">
      <!-- Simple Breadcrumb -->
      <CommonBreadcrumb :breadcrumbs="breadcrumbs" />

      <!-- Page Content -->
      <div class="mb-8 rounded-lg bg-white px-8 py-28 shadow-sm">
        <h1 class="mb-4 text-4xl font-bold text-gray-900">Lær</h1>
        <p class="mb-8 text-xl text-gray-600">Nabolagshelsebloggen</p>

        <div class="prose prose-lg max-w-none">
          <p class="mb-6 text-lg text-gray-700">
            Utforsk artikler, casestudier og beste praksis innen nabolagshelse
            og dataanalyse.
          </p>

          <h2 class="mb-4 text-2xl font-semibold text-gray-900">
            Siste artikler
          </h2>
          <div class="mb-6 space-y-4">
            <article class="border-b border-gray-200 pb-3">
              <h3 class="font-semibold text-gray-900">
                Hvordan tolke helsedata i ditt nabolag
              </h3>
              <p class="text-sm text-gray-500">15. mars 2024</p>
            </article>
            <article class="border-b border-gray-200 pb-3">
              <h3 class="font-semibold text-gray-900">
                Beste praksis for datavisualisering
              </h3>
              <p class="text-sm text-gray-500">8. mars 2024</p>
            </article>
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
  { label: "Blogg", href: "/hjelp/formidling" },
];
</script>
