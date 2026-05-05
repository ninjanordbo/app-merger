<template>
  <div
    class="sticky left-0 top-0 flex h-screen w-max flex-col items-center justify-between gap-5 bg-dark-blue pb-5"
  >
    <div
      class="relative flex w-full flex-col items-center justify-between gap-5 overflow-hidden px-3 py-5"
    >
      <!-- Logo -->
      <NuxtLink to="/" class="mb-10 flex w-full flex-col items-center">
        <IconsNHLogo class="z-50" />
        <div
          class="absolute top-0 z-10 aspect-square w-[200%] -translate-y-[40%] rounded-full bg-white"
        />
      </NuxtLink>

      <!-- Profile -->

      <div class="my-5 flex w-full flex-col items-center justify-center">
        <div
          class="mb-5 size-16 content-center rounded-full bg-white text-center text-4xl font-thin text-dark-blue"
        >
          {{ user?.username?.[0] }}
        </div>
      </div>

      <div class="flex w-full flex-col items-center justify-center gap-3">
        <NuxtLink
          class="rounded-md bg-white p-3 text-primary-700"
          path="/sonebygger"
        >
          <LucideLayoutDashboard :size="20" />
        </NuxtLink>
      </div>
    </div>

    <button
      class="mb-1 flex w-full items-center justify-center gap-2 self-end justify-self-end text-sm text-white"
      @click="() => logOut('/login?redirect=/sonebygger')"
    >
      <LucideLogOut :size="20" />
    </button>
  </div>
</template>

<script lang="ts" setup>
const { user } = storeToRefs(useAuth());
const { logOut } = useAuth();
</script>
