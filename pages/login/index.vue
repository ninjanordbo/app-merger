<template>
  <div
    class="flex h-full w-full flex-grow items-center justify-center bg-gray-50 px-5 pb-20 pt-36 sm:pt-48"
  >
    <form
      class="m-auto flex w-full max-w-md flex-col items-center gap-10 rounded-2xl border bg-white px-5 py-10 shadow-lg"
      @submit.prevent="login"
    >
      <!-- Welcome Title -->
      <div class="text-center">
        <h1 class="mb-2 text-3xl font-semibold text-gray">Velkommen</h1>
        <p class="text-sm text-gray-light">Logg inn for å fortsette</p>
      </div>

      <!-- Login Form -->
      <div class="flex w-full flex-col items-center justify-center gap-4">
        <label class="flex w-full flex-col items-center text-base">
          <CommonLineInput
            v-model="username"
            placeholder="Brukernavn"
            :name="'nbusername'"
            class="w-full"
          />
        </label>
        <label class="flex w-full flex-col items-center text-base">
          <CommonPasswordInput
            v-model="password"
            :name="'nbpassword'"
            placeholder="Passord"
            class="w-full"
          />
        </label>
      </div>

      <!-- Login Button - Updated to match landing page style -->
      <button
        class="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-secondary-400 bg-gradient-to-b from-[rgba(255,255,255,0.16)] to-transparent px-6 py-3 text-sm font-medium text-white shadow-btn-primary transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        type="submit"
      >
        <span class="tracking-[-0.006em]">Logg inn</span>
        <LucideChevronRight
          :size="16"
          class="transition-transform duration-200 group-hover:translate-x-1"
        />
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { until } from "@vueuse/core";

const username = ref("");
const password = ref("");

const router = useRouter();
const { authenticateUser, checkForToken } = useAuth();
const { loading } = storeToRefs(useAuth());

const login = async () => {
  await authenticateUser(username.value, password.value, redirect.value ?? "/");
  await navigateTo(redirect.value || "/");
};

const { query } = useRoute();

onBeforeMount(async () => {
  // Go to main page if user is already logged in
  await until(loading).toBe(false);
  if (await checkForToken()) {
    router.push(redirect.value ?? "/");
  }
});

const redirect = computed(() => {
  return query.redirect as string;
});

definePageMeta({
  layout: "landing",
  title: "Logg inn",
});
</script>

<style lang="scss" scoped></style>
