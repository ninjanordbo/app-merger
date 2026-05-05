<template>
  <div
    :class="[
      'sticky left-0 top-0 z-50 flex h-screen flex-col items-center justify-between gap-5 bg-dark-blue pb-5 shadow-lg duration-200',
      isCollapsed ? 'w-24' : 'w-60',
    ]"
  >
    <div class="flex w-full flex-col items-center justify-between gap-10">
      <!-- Logo -->
      <NuxtLink
        to="/"
        :class="[
          'relative mb-10 flex flex-col items-center overflow-x-clip overflow-y-visible px-3 pt-5 duration-200',
          isCollapsed ? 'w-24' : 'w-60',
        ]"
      >
        <IconsNHLogo v-if="isCollapsed" class="z-40" />
        <IconsNHLogoTop v-else class="z-40" />
        <div
          :class="[
            'absolute top-0 z-10 aspect-square rounded-full bg-white duration-200',
            isCollapsed ? 'w-60 -translate-y-[55%]' : 'w-96 -translate-y-[60%]',
          ]"
        />
      </NuxtLink>

      <!-- Profile -->
      <div
        class="relative flex w-full flex-col items-center justify-center px-3"
      >
        <div
          :class="[
            'content-center rounded-full bg-white text-center text-4xl font-thin text-dark-blue',
            isCollapsed ? 'size-14' : 'size-16',
          ]"
        >
          {{ user?.username?.[0] }}
        </div>

        <div class="break-all text-center text-white">
          {{ shortenedUsername }}
        </div>

        <button
          v-if="isLg"
          class="absolute right-0 top-1/2 z-50 flex -translate-y-1/2 translate-x-full items-center justify-center rounded-r-md bg-dark-blue px-2 py-6 text-white shadow-lg"
          @click.stop="isCollapsed = !isCollapsed"
        >
          <LucideChevronLeft
            :class="[
              'absolute right-0 duration-200',
              isCollapsed ? '-scale-x-100' : 'scale-x-100',
            ]"
          />
        </button>
      </div>

      <div class="flex w-full flex-col items-center justify-center gap-3 px-3">
        <DashboardNavLink path="/dashboard">
          <template #icon>
            <LucideLayoutDashboard :size="20" />
          </template>
          <template v-if="!isCollapsed" #text>Prosjekter</template>
        </DashboardNavLink>

        <div
          :class="[
            'flex items-center justify-start rounded-md bg-none px-3 py-2.5 text-white',
            !isCollapsed ? 'w-full gap-5' : 'w-min gap-0',
          ]"
        >
          <div :class="'text-white'">
            <LucideUsers :size="20" />
          </div>
          <div v-if="!isCollapsed" class="mt-1 leading-5">Kontakter</div>
        </div>

        <div
          :class="[
            'flex items-center justify-start rounded-md bg-none px-3 py-2.5 text-white',
            !isCollapsed ? 'w-full gap-5' : 'w-min gap-0',
          ]"
        >
          <div :class="'text-white'">
            <LucideMessageCircle :size="20" />
          </div>
          <div v-if="!isCollapsed" class="mt-1 leading-5">Meldinger</div>
        </div>
      </div>
    </div>

    <button
      class="mb-1 flex w-full items-center justify-center gap-2 self-end justify-self-end text-sm text-white"
      @click="() => logOut('/login?redirect=/dashboard')"
    >
      <div v-if="!isCollapsed" class="mt-1">Logg ut</div>
      <LucideLogOut :size="isCollapsed ? 20 : 14" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useBreakpoints } from "@vueuse/core";

const { user } = storeToRefs(useAuth());
const { logOut } = useAuth();

const shortenedUsername = computed(() => {
  return user.value?.username.split("@")[0];
});

const bps = {
  lg: 1400,
  sm: 0,
};

const breakpoints = useBreakpoints(bps);
const isLg = breakpoints.greaterOrEqual("lg");

const isCollapsed = ref(!isLg.value);

watch(isLg, () => (isCollapsed.value = !isLg.value));
</script>
