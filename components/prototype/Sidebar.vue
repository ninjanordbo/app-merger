<template>
  <div
    :class="[
      'sticky left-0 top-0 z-50 flex h-screen flex-col items-center justify-between gap-5 bg-dark-blue pb-5 shadow-lg duration-200',
      isCollapsed ? 'w-20' : 'w-60',
    ]"
  >
    <div class="flex w-full flex-col items-center justify-between gap-6">
      <!-- Logo -->
      <NuxtLink
        to="/prototype"
        :class="[
          'relative flex flex-col items-center overflow-x-clip overflow-y-visible px-3 pt-5 duration-200',
          isCollapsed ? 'w-20' : 'w-60',
        ]"
      >
        <div
          :class="[
            'flex items-center justify-center rounded-full bg-white text-primary font-bold duration-200',
            isCollapsed ? 'size-12 text-xl' : 'size-16 text-2xl',
          ]"
        >
          P
        </div>
        <span
          v-if="!isCollapsed"
          class="mt-2 text-white font-medium text-sm"
        >
          Prototype
        </span>
      </NuxtLink>

      <!-- User Profile -->
      <div class="relative flex w-full flex-col items-center justify-center px-3">
        <div
          :class="[
            'content-center rounded-full bg-primary text-center font-medium text-white',
            isCollapsed ? 'size-10 text-lg' : 'size-12 text-xl',
          ]"
        >
          U
        </div>

        <div v-if="!isCollapsed" class="mt-1 text-center text-white text-sm">
          User
        </div>

        <button
          v-if="isLg"
          class="absolute right-0 top-1/2 z-50 flex -translate-y-1/2 translate-x-full items-center justify-center rounded-r-md bg-dark-blue px-2 py-6 text-white shadow-lg"
          @click.stop="isCollapsed = !isCollapsed"
        >
          <LucideChevronLeft
            :class="[
              'duration-200',
              isCollapsed ? '-scale-x-100' : 'scale-x-100',
            ]"
            :size="16"
          />
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex w-full flex-col items-center justify-center gap-2 px-3">
        <PrototypeNavLink path="/prototype">
          <template #icon>
            <LucideHome :size="20" />
          </template>
          <template v-if="!isCollapsed" #text>Hjem</template>
        </PrototypeNavLink>

        <PrototypeNavLink path="/prototype/dashboard">
          <template #icon>
            <LucideLayoutDashboard :size="20" />
          </template>
          <template v-if="!isCollapsed" #text>Dashboard</template>
        </PrototypeNavLink>

        <PrototypeNavLink path="/prototype/settings">
          <template #icon>
            <LucideSettings :size="20" />
          </template>
          <template v-if="!isCollapsed" #text>Innstillinger</template>
        </PrototypeNavLink>
      </nav>
    </div>

    <!-- Logout Button -->
    <button
      class="mb-1 flex w-full items-center justify-center gap-2 self-end justify-self-end text-sm text-white hover:text-primary transition-colors"
    >
      <span v-if="!isCollapsed">Logg ut</span>
      <LucideLogOut :size="isCollapsed ? 20 : 14" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useBreakpoints } from "@vueuse/core";

const bps = {
  lg: 1400,
  sm: 0,
};

const breakpoints = useBreakpoints(bps);
const isLg = breakpoints.greaterOrEqual("lg");

const isCollapsed = ref(!isLg.value);

watch(isLg, () => (isCollapsed.value = !isLg.value));
</script>
