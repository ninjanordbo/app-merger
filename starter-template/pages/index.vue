<template>
  <div class="space-y-6">
    <div class="rounded-lg border border-neutral-200 bg-white p-6">
      <h2 class="mb-4 text-xl font-semibold text-neutral-900">
        Velkommen til Prototype
      </h2>
      <p class="text-neutral-600">
        Dette er en startermal for raske prototyper. Den inkluderer:
      </p>
      <ul class="mt-4 space-y-2 text-neutral-600">
        <li class="flex items-center gap-2">
          <LucideCheck class="text-success-600" :size="16" />
          Sidemeny med navigasjon
        </li>
        <li class="flex items-center gap-2">
          <LucideCheck class="text-success-600" :size="16" />
          Toppmeny med handlinger
        </li>
        <li class="flex items-center gap-2">
          <LucideCheck class="text-success-600" :size="16" />
          Responsivt design
        </li>
        <li class="flex items-center gap-2">
          <LucideCheck class="text-success-600" :size="16" />
          Tailwind CSS styling
        </li>
        <li class="flex items-center gap-2">
          <LucideCheck class="text-success-600" :size="16" />
          Pinia state management
        </li>
      </ul>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div class="rounded-lg border border-neutral-200 bg-white p-6">
        <div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
          <LucideLayoutDashboard class="text-primary" :size="24" />
        </div>
        <h3 class="mb-2 font-semibold text-neutral-900">Dashboard</h3>
        <p class="text-sm text-neutral-600">
          Se oversikt og statistikk for prosjektet ditt.
        </p>
      </div>

      <div class="rounded-lg border border-neutral-200 bg-white p-6">
        <div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
          <LucideSettings class="text-primary" :size="24" />
        </div>
        <h3 class="mb-2 font-semibold text-neutral-900">Innstillinger</h3>
        <p class="text-sm text-neutral-600">
          Tilpass appen etter dine behov.
        </p>
      </div>

      <div class="rounded-lg border border-neutral-200 bg-white p-6">
        <div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
          <LucideRocket class="text-primary" :size="24" />
        </div>
        <h3 class="mb-2 font-semibold text-neutral-900">Kom i gang</h3>
        <p class="text-sm text-neutral-600">
          Start med a legge til dine egne komponenter og sider.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: "Hjem",
});
</script>
