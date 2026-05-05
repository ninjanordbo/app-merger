<template>
  <nav class="flex items-center gap-x-1 px-1 text-sm text-gray-500">
    <!-- No outside margin in component, spacing to gap for flexbox -->
    <template v-for="(item, index) in breadcrumbs" :key="item.href">
      <!-- Home Icon -->
      <NuxtLink
        v-if="index === 0"
        :to="item.href"
        class="flex items-center text-gray-500 transition-colors duration-200 hover:text-primary-500"
      >
        <LucideHouse :size="16" />
      </NuxtLink>

      <!-- Regular Links -->
      <NuxtLink
        v-else-if="index < breadcrumbs.length - 1"
        :to="item.href"
        class="text-gray-500 transition-colors duration-200 hover:text-primary-500"
      >
        {{ item.label }}
      </NuxtLink>

      <!-- Current Page -->
      <span v-else class="font-medium text-gray-900">
        {{ item.label }}
      </span>

      <!-- Separator -->
      <LucideChevronRight v-if="index < breadcrumbs.length - 1" :size="12" />
    </template>
  </nav>
</template>

<script lang="ts" setup>
interface BreadcrumbItem {
  label: string;
  href: string;
}

defineProps({
  breadcrumbs: {
    type: Array as PropType<BreadcrumbItem[]>,
    required: true,
  },
});
</script>
