<template>
  <footer
    class="flex w-full flex-shrink flex-grow-0 items-center justify-center shadow-lg"
  >
    <div
      class="flex w-full max-w-6xl flex-col items-center justify-center gap-12 px-5 py-20 sm:px-10"
    >
      <!-- Mobile Layout -->
      <div
        class="flex w-full flex-col items-center justify-center gap-8 lg:hidden"
      >
        <!-- Navigation Links -->
        <div
          class="flex flex-col items-center justify-center gap-6 text-center"
        >
          <!-- TODO: Add hjelp -->
          <!-- <button
            class="text-sm font-medium text-gray duration-200 hover:-translate-y-1"
          >
            Hjelp
          </button> -->
          <!-- TODO: Add vilkår -->
          <!-- <button
            class="text-sm font-medium text-gray duration-200 hover:-translate-y-1"
          >
            Vilkår
          </button> -->
          <NuxtLink
            class="text-sm font-medium text-gray duration-200 hover:-translate-y-1"
            to="/personvern"
          >
            Personvern
          </NuxtLink>
        </div>

        <!-- Logo -->
        <div class="flex items-center justify-center">
          <IconsNHBigLogo />
        </div>

        <!-- Company Info -->
        <div
          class="flex flex-col items-center justify-center gap-4 text-center"
        >
          <div>
            <div class="text-xs font-normal text-gray">Organisasjonsnummer</div>
            <div class="text-sm text-gray-light">933295125</div>
          </div>

          <div>
            <div class="text-xs font-normal text-gray">Adresse</div>
            <div class="text-sm text-gray-light">Hovstegen 16, 1813 Askim</div>
          </div>

          <div>
            <div class="text-xs font-normal text-gray">Email</div>
            <a
              href="mailto:post@nabolagshelse.no"
              class="text-sm text-gray-light duration-200 hover:opacity-70"
            >
              post@nabolagshelse.no
            </a>
          </div>
        </div>
      </div>

      <!-- Desktop Layout -->
      <div
        class="hidden w-full lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-8"
      >
        <!-- Logo -->
        <div class="flex items-center justify-center">
          <IconsNHBigLogo />
        </div>

        <!-- Company Info Row -->
        <div class="flex w-full items-center justify-center gap-16">
          <div class="text-center">
            <div class="text-xs font-normal text-gray">Adresse</div>
            <div class="text-sm font-medium text-gray">
              Hovstegen 16, 1813 Askim
            </div>
          </div>

          <div class="text-center">
            <div class="text-xs font-normal text-gray">Email</div>
            <a
              href="mailto:post@nabolagshelse.no"
              class="text-sm font-medium text-gray duration-200 hover:opacity-70"
            >
              post@nabolagshelse.no
            </a>
          </div>

          <div class="text-center">
            <div class="text-xs font-normal text-gray">Organisasjonsnummer</div>
            <div class="text-sm font-medium text-gray">933295125</div>
          </div>
        </div>

        <!-- Divider Line -->
        <div class="w-full max-w-4xl border-t border-gray-200"></div>

        <!-- Navigation Links Row -->
        <div class="flex items-center justify-center gap-16">
          <!-- TODO: Add hjelp -->
          <!-- <button
            class="text-sm font-medium text-gray duration-200 hover:-translate-y-1"
          >
            Hjelp
          </button> -->
          <!-- TODO: Add support -->
          <!-- <button
            class="text-sm font-medium text-gray duration-200 hover:-translate-y-1"
          >
            Support
          </button> -->
          <!-- TODO: Add vilkår -->
          <!-- <button
            class="text-sm font-medium text-gray duration-200 hover:-translate-y-1"
          >
            Vilkår
          </button> -->
          <NuxtLink
            class="text-sm font-medium text-gray duration-200 hover:-translate-y-1"
            to="/personvern"
          >
            Personvern
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
// .preview-bg {
//   background-repeat: no-repeat;
//   background-clip: content-box;
//   background-size: cover;
//   background-position: top;
//   background-image: url("public/footer-vector.svg");
// }
</style>
