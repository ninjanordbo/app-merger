<template>
  <div
    class="flex h-full w-full items-center justify-start self-center bg-gray-50"
  >
    <div class="mx-auto w-full max-w-4xl px-6 py-28">
      <!-- Simple Breadcrumb -->
      <CommonBreadcrumb :breadcrumbs="breadcrumbs" />

      <!-- Page Content -->
      <div class="mb-8 rounded-lg bg-white px-8 py-28 shadow-sm">
        <h1 class="mb-4 text-4xl font-bold text-gray-900">Hjelp</h1>
        <p class="mb-8 text-xl text-gray-600">Brukerstøtte og opplæring</p>

        <div class="prose prose-lg max-w-none">
          <p class="mb-6 text-lg text-gray-700">
            Velkommen til hjelpeseksjonen! Her finner du alt du trenger for å
            komme i gang med Nabolagshelse-plattformen.
          </p>

          <h2 class="mb-4 text-2xl font-semibold text-gray-900">Kom i gang</h2>
          <ul class="mb-6 space-y-2">
            <li>• Hvordan opprette et nytt prosjekt</li>
            <li>• Navigering i dashbordet</li>
            <li>• Legge til og redigere kort</li>
            <li>• Dele prosjekter med andre</li>
          </ul>
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
  { label: "Brukerstøtte", href: "/hjelp/hvordan" },
];
</script>
