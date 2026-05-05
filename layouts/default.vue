<template>
  <div class="flex">
    <!-- NavMenu -->
    <div
      v-if="user"
      class="sticky left-0 top-0 flex h-screen w-72 flex-col items-center justify-between bg-gray p-5"
    >
      <h1 class="text-3xl text-white">Nabolagshelse</h1>

      <div class="w-full">
        <div class="flex flex-col gap-5">
          <div class="text-lg text-white">
            <div class="text-sm">Signed in as</div>
            {{ user?.username }}
          </div>
          <button
            class="w-full rounded-lg bg-green-700 px-5 py-2 text-white duration-200 hover:scale-105"
            @click="() => logOut()"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
    <div class="relative h-full w-full">
      <slot />

      <CommonNotification />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

const { user } = storeToRefs(useAuth());
const { logOut } = useAuth();
</script>
