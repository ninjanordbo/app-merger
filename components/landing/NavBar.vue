<template>
  <nav
    ref="navElement"
    :class="[
      'fixed left-0 right-0 z-50 flex flex-col items-center justify-between px-5 py-2.5',
      'lg:left-1/2 lg:top-5 lg:w-11/12 lg:max-w-7xl lg:-translate-x-1/2',
      'lg:rounded-full lg:border lg:border-primary lg:shadow-lg',
      'bg-white bg-opacity-95 backdrop-blur-sm',
    ]"
  >
    <div class="relative z-20 flex w-full items-center justify-between">
      <NuxtLink to="/">
        <IconsNHBigLogo />
      </NuxtLink>

      <div
        class="hidden items-center justify-center gap-3 text-sm font-semibold text-gray lg:flex"
      >
        <NuxtLink to="/" class="px-5 py-3 duration-200 hover:-translate-y-1">
          Nabolagshelse
        </NuxtLink>
        <NuxtLink
          to="/sonebyggeren"
          class="px-5 py-3 text-sm font-semibold text-gray duration-200 hover:-translate-y-1"
        >
          Sonebyggeren
        </NuxtLink>

        <!-- TODO: Add priser -->
        <!-- <button
          class="px-5 py-3 duration-200 hover:-translate-y-1"
          @click="scrollToAnchorOnHomePage('#about')"
        >
          Priser
        </button> -->

        <!-- TODO: Add hjelp -->
        <!-- <button
          class="px-5 py-3 duration-200 hover:-translate-y-1"
          @click="scrollToAnchorOnHomePage('#about')"
        >
          Hjelp
        </button> -->

        <NuxtLink
          to="/dashboard"
          class="group relative flex items-center justify-center gap-2 rounded-3xl bg-secondary-400 px-3 py-2 text-sm font-medium shadow-btn-primary transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          <span class="tracking-wider text-white">Logg inn</span>
        </NuxtLink>
      </div>

      <div class="flex items-center justify-center lg:hidden">
        <button @click="toggleMobileMenu">
          <IconsBurgerToX
            :show-cross="isMobileMenuOpen"
            class="size-7 text-gray"
          />
        </button>
      </div>
    </div>

    <Transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
        :style="`top: ${navElement?.clientHeight || 0}px;`"
        @click="closeMobileMenu"
      />
    </Transition>

    <Transition name="slide-from-right">
      <div
        v-if="isMobileMenuOpen"
        class="fixed right-0 top-0 z-50 flex h-screen w-3/4 flex-col items-end justify-start gap-10 bg-white px-5 py-10 shadow-xl lg:hidden"
        :style="`top: ${navElement?.clientHeight || 0}px;`"
      >
        <NuxtLink to="/" class="px-5 py-3 duration-200 hover:-translate-y-1">
          Nabolagshelse
        </NuxtLink>
        <NuxtLink
          to="/sonebyggeren"
          class="px-5 py-3 duration-200 hover:-translate-y-1"
        >
          Sonebyggeren
        </NuxtLink>

        <!-- <button
          class="py-3 text-lg duration-200 hover:-translate-y-1"
          @click="scrollToAnchorOnHomePage('#about')"
        >
          Priser
        </button> -->

        <!-- TODO: Add hjelp -->
        <!-- <button
          class="py-3 text-lg duration-200 hover:-translate-y-1"
          @click="scrollToAnchorOnHomePage('#team')"
        >
          Hjelp
        </button> -->

        <NuxtLink
          to="/dashboard"
          class="group relative flex items-center justify-center gap-2 rounded-3xl bg-secondary-400 px-3 py-2 text-sm font-medium shadow-btn-primary transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          @click="closeMobileMenu"
        >
          <span class="tracking-wider text-white">Logg inn</span>
        </NuxtLink>
      </div>
    </Transition>
  </nav>
</template>

<script lang="ts" setup>
const navElement = ref<HTMLElement | null>(null);
const router = useRouter();

const isMobileMenuOpen = ref(false);

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;

  if (isMobileMenuOpen.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
  document.body.style.overflow = "";
}

// function scrollToAnchorOnHomePage(anchor: string) {
//   closeMobileMenu();

//   if (router.currentRoute.value.path !== "/") {
//     router.push({ path: "/" }).then(() => {
//       setTimeout(() => {
//         scrollToAnchor(anchor, 64, navElement.value?.clientHeight || 0);
//       }, 100);
//     });
//   } else {
//     scrollToAnchor(anchor, 64, navElement.value?.clientHeight || 0);
//   }
// }

watch(
  () => router.currentRoute.value.path,
  () => {
    closeMobileMenu();
  },
);

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<style lang="scss" scoped>
.fade {
  &-enter-active,
  &-leave-active {
    @apply transition-opacity duration-300;
  }

  &-enter-from,
  &-leave-to {
    @apply opacity-0;
  }

  &-enter-to,
  &-leave-from {
    @apply opacity-100;
  }
}

.slide-from-right {
  &-enter-active,
  &-leave-active {
    @apply transition-transform duration-300;
  }

  &-enter-from,
  &-leave-to {
    @apply translate-x-full;
  }

  &-enter-to,
  &-leave-from {
    @apply translate-x-0;
  }
}
</style>
