<template>
  <div
    class="flex h-full w-full flex-col items-center justify-center bg-gray-50 py-24"
  >
    <!-- Hero Section -->
    <div
      class="flex flex-shrink-0 flex-col items-center justify-center px-6 py-8 pb-28"
    >
      <h1 class="mb-6 text-5xl font-bold text-gray">Lurer du på noe?</h1>
      <p class="mb-8 max-w-2xl text-center text-xl text-gray-600">
        Finn svar, lær verktøyet, forstå dataene
      </p>

      <!-- Search Component -->
      <div class="relative w-full max-w-md">
        <div class="relative">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <LucideSearch class="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            class="w-full rounded-full border border-gray-300 py-3 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Søk"
          />
        </div>
      </div>
    </div>

    <!-- Three Cards Section -->
    <div class="flex w-full flex-1 items-center justify-center px-6 pb-8">
      <div class="flex w-full max-w-6xl flex-col gap-8 md:flex-row">
        <!-- Card 1: Hjelp -->
        <NuxtLink
          to="/hjelp/hvordan"
          class="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg"
        >
          <div
            class="flex h-full flex-col items-center justify-center text-center"
          >
            <h3 class="mb-4 text-2xl font-semibold text-gray-900">Hjelp</h3>
            <p class="mb-6 text-gray-600">Brukerstøtte og opplæring</p>

            <!-- Image with Background -->
            <div
              class="relative flex items-center justify-center"
              style="width: 200px; height: 150px"
            >
              <!-- Background Rectangle -->
              <div
                class="absolute bottom-0 left-1/2 -translate-x-1/2 transform rounded-lg"
                style="
                  width: 180px;
                  height: 75px;
                  background-color: #89b56b1a;
                  opacity: 0.1;
                "
              ></div>
              <!-- Image -->
              <img
                src="/hjelp/hjelp-img-1.svg"
                alt="Hjelp illustration"
                class="relative z-10 h-full w-full object-contain"
              />
            </div>
          </div>
        </NuxtLink>

        <!-- Card 2: Forstå -->
        <NuxtLink
          to="/hjelp/innsikt"
          class="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg"
        >
          <div
            class="flex h-full flex-col items-center justify-center text-center"
          >
            <h3 class="mb-4 text-2xl font-semibold text-gray-900">Forstå</h3>
            <p class="mb-6 text-gray-600">Konsepter og begreper</p>

            <!-- Image with Background -->
            <div
              class="relative flex items-center justify-center"
              style="width: 200px; height: 150px"
            >
              <!-- Background Rectangle -->
              <div
                class="absolute bottom-0 left-1/2 -translate-x-1/2 transform rounded-lg"
                style="
                  width: 180px;
                  height: 75px;
                  background-color: #89b56b1a;
                  opacity: 0.1;
                "
              ></div>
              <!-- Image -->
              <img
                src="/hjelp/hjelp-img-2.svg"
                alt="Forstå illustration"
                class="relative z-10 h-full w-full object-contain"
              />
            </div>
          </div>
        </NuxtLink>

        <!-- Card 3: Lær -->
        <NuxtLink
          to="/hjelp/formidling"
          class="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg"
        >
          <div
            class="flex h-full flex-col items-center justify-center text-center"
          >
            <h3 class="mb-4 text-2xl font-semibold text-gray-900">Lær</h3>
            <p class="mb-6 text-gray-600">Nabolagshelsebloggen</p>

            <!-- Image with Background -->
            <div
              class="relative flex items-center justify-center"
              style="width: 200px; height: 150px"
            >
              <!-- Background Rectangle -->
              <div
                class="absolute bottom-0 left-1/2 -translate-x-1/2 transform rounded-lg"
                style="
                  width: 180px;
                  height: 75px;
                  background-color: #89b56b1a;
                  opacity: 0.1;
                "
              ></div>
              <!-- Image -->
              <img
                src="/hjelp/hjelp-img-3.svg"
                alt="Lær illustration"
                class="relative z-10 h-full w-full object-contain"
              />
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Component logic here if needed
</script>
