<template>
  <div class="space-y-6">
    <div class="rounded-lg border border-neutral-200 bg-white">
      <div class="border-b border-neutral-200 p-6">
        <h2 class="text-lg font-semibold text-neutral-900">Generelle innstillinger</h2>
        <p class="mt-1 text-sm text-neutral-500">
          Administrer applikasjonsinnstillingene dine.
        </p>
      </div>

      <div class="divide-y divide-neutral-200">
        <div class="flex items-center justify-between p-6">
          <div>
            <h3 class="font-medium text-neutral-900">Mork modus</h3>
            <p class="text-sm text-neutral-500">Aktiver mork modus for appen.</p>
          </div>
          <button
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              darkMode ? 'bg-primary' : 'bg-neutral-300',
            ]"
            @click="darkMode = !darkMode"
          >
            <span
              :class="[
                'inline-block size-4 transform rounded-full bg-white transition-transform',
                darkMode ? 'translate-x-6' : 'translate-x-1',
              ]"
            />
          </button>
        </div>

        <div class="flex items-center justify-between p-6">
          <div>
            <h3 class="font-medium text-neutral-900">Varsler</h3>
            <p class="text-sm text-neutral-500">Motta varsler om viktige hendelser.</p>
          </div>
          <button
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              notifications ? 'bg-primary' : 'bg-neutral-300',
            ]"
            @click="notifications = !notifications"
          >
            <span
              :class="[
                'inline-block size-4 transform rounded-full bg-white transition-transform',
                notifications ? 'translate-x-6' : 'translate-x-1',
              ]"
            />
          </button>
        </div>

        <div class="flex items-center justify-between p-6">
          <div>
            <h3 class="font-medium text-neutral-900">Sprak</h3>
            <p class="text-sm text-neutral-500">Velg foretrukket sprak.</p>
          </div>
          <select
            v-model="language"
            class="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="no">Norsk</option>
            <option value="en">English</option>
            <option value="sv">Svenska</option>
          </select>
        </div>
      </div>
    </div>

    <div class="rounded-lg border border-neutral-200 bg-white">
      <div class="border-b border-neutral-200 p-6">
        <h2 class="text-lg font-semibold text-neutral-900">Profil</h2>
        <p class="mt-1 text-sm text-neutral-500">
          Oppdater profilinformasjonen din.
        </p>
      </div>

      <div class="p-6">
        <div class="grid gap-6 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-neutral-700">Navn</label>
            <input
              v-model="profile.name"
              type="text"
              class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-neutral-700">E-post</label>
            <input
              v-model="profile.email"
              type="email"
              class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
          >
            Lagre endringer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: "Innstillinger",
  layout: "prototype",
});

const darkMode = ref(false);
const notifications = ref(true);
const language = ref("no");

const profile = reactive({
  name: "Bruker",
  email: "bruker@example.com",
});
</script>
