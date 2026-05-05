<template>
  <div class="space-y-6">
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-lg border border-neutral-200 bg-white p-6"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-neutral-500">{{ stat.label }}</span>
          <component :is="stat.icon" class="text-neutral-400" :size="20" />
        </div>
        <p class="mt-2 text-3xl font-semibold text-neutral-900">{{ stat.value }}</p>
        <p class="mt-1 text-sm" :class="stat.changeType === 'positive' ? 'text-success-600' : 'text-error-500'">
          {{ stat.change }}
        </p>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-lg border border-neutral-200 bg-white p-6">
        <h3 class="mb-4 text-lg font-semibold text-neutral-900">Nylige aktiviteter</h3>
        <div class="space-y-4">
          <div
            v-for="activity in activities"
            :key="activity.id"
            class="flex items-start gap-3 rounded-lg bg-neutral-50 p-3"
          >
            <div class="flex size-8 items-center justify-center rounded-full bg-primary/10">
              <component :is="activity.icon" class="text-primary" :size="16" />
            </div>
            <div>
              <p class="font-medium text-neutral-900">{{ activity.title }}</p>
              <p class="text-sm text-neutral-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-neutral-200 bg-white p-6">
        <h3 class="mb-4 text-lg font-semibold text-neutral-900">Hurtighandlinger</h3>
        <div class="grid gap-3 sm:grid-cols-2">
          <button
            v-for="action in quickActions"
            :key="action.label"
            class="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 text-left transition-colors hover:bg-neutral-50"
          >
            <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <component :is="action.icon" class="text-primary" :size="20" />
            </div>
            <span class="font-medium text-neutral-900">{{ action.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  LucideUsers,
  LucideFileText,
  LucideTrendingUp,
  LucideActivity,
  LucidePlus,
  LucideUpload,
  LucideDownload,
  LucideShare2,
} from "lucide-vue-next";

definePageMeta({
  title: "Dashboard",
});

const stats = [
  { label: "Brukere", value: "1,234", change: "+12%", changeType: "positive", icon: LucideUsers },
  { label: "Dokumenter", value: "567", change: "+8%", changeType: "positive", icon: LucideFileText },
  { label: "Aktivitet", value: "89%", change: "+5%", changeType: "positive", icon: LucideTrendingUp },
  { label: "Oppetid", value: "99.9%", change: "Stabil", changeType: "positive", icon: LucideActivity },
];

const activities = [
  { id: 1, title: "Nytt dokument opprettet", time: "For 5 minutter siden", icon: LucideFileText },
  { id: 2, title: "Bruker registrert", time: "For 12 minutter siden", icon: LucideUsers },
  { id: 3, title: "Rapport eksportert", time: "For 1 time siden", icon: LucideDownload },
];

const quickActions = [
  { label: "Opprett ny", icon: LucidePlus },
  { label: "Last opp", icon: LucideUpload },
  { label: "Eksporter", icon: LucideDownload },
  { label: "Del", icon: LucideShare2 },
];
</script>
