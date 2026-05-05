<template>
  <main
    class="relative flex w-full flex-col items-center justify-center bg-gray-50"
  >
    <!-- Hero Sonebyggeren Section -->
    <div
      class="lg:pt-38 relative z-10 flex w-full items-center justify-center pb-24 pt-36 sm:pt-48 lg:px-5"
    >
      <div
        class="flex w-full max-w-7xl flex-col items-center justify-center px-4 text-center"
      >
        <!-- Hero Content Container -->
        <div
          class="flex w-full flex-col items-center justify-center gap-4 lg:gap-6"
        >
          <!-- Heading -->
          <h1
            class="w-full max-w-6xl px-4 text-2xl font-semibold text-gray md:px-8 md:text-4xl lg:px-10 lg:text-6xl"
          >
            Sonebyggeren - den enkleste veien til levekårssoner i din kommune
          </h1>

          <!-- Hero Image -->
          <div
            class="flex w-full max-w-md items-center justify-center lg:max-w-lg xl:max-w-xl"
          >
            <img
              src="/sonebyggeren-hero-pic.svg"
              alt="Data visualization illustration"
              class="h-auto max-h-[124px] w-full max-w-[150px] object-contain md:max-h-[265px] md:max-w-[425px]"
            />
          </div>

          <!-- Description -->
          <div
            class="max-w-lg text-sm font-normal leading-5 text-gray md:text-lg"
          >
            Spar tid og ressurser samtidig som kommunen beholder full kontroll
            over endelig soneinndeling.
          </div>

          <!-- Buttons -->
          <div class="flex w-full flex-row items-center justify-center gap-4">
            <NuxtLink
              to="https://tally.so/r/3lWdYk"
              class="group relative flex items-center justify-center gap-2 rounded-3xl bg-secondary-400 px-5 py-3 text-sm font-medium shadow-btn-primary transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <span class="tracking-wider text-white">Bestill nå</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div
      class="relative z-10 flex w-full flex-col items-center justify-center gap-10 pb-24"
    >
      <div class="flex max-w-md flex-col items-center justify-center gap-5">
        <h2
          class="text-center text-2xl leading-none text-gray md:text-3xl lg:text-4xl"
        >
          Levekårssoner gjør folkehelsearbeidet enkelt
        </h2>
        <div class="text-center text-sm font-light text-gray-light">
          Få oversikt over lokale utfordringer og ressurser i din kommune.
        </div>
      </div>

      <div
        class="relative z-10 grid grid-cols-1 items-stretch justify-center gap-5 px-6 md:grid-cols-2"
      >
        <div
          v-for="feature in featuresArray"
          :key="feature.title"
          class="flex h-full w-full max-w-sm flex-col gap-2 rounded-lg border bg-primary/10 p-5 text-center shadow-md duration-200 lg:max-w-md"
        >
          <div class="text-lg font-semibold text-gray">
            {{ feature.title }}
          </div>
          <div class="text-base font-light text-gray-light">
            {{ feature.description }}
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonials Section -->
    <div class="relative z-10 flex w-full items-center justify-center py-16">
      <div
        class="flex w-full max-w-7xl flex-col items-center justify-center gap-8 rounded-lg bg-white px-4 md:gap-12 md:px-6 lg:px-8"
      >
        <div
          class="flex w-full flex-col items-center justify-between gap-8 rounded-lg p-8 md:flex-row md:gap-12 md:p-12 lg:gap-16 lg:p-16"
        >
          <div
            class="flex w-full items-center justify-center md:w-1/2 md:justify-start md:pl-8"
          >
            <div
              class="flex h-64 w-64 items-center justify-center rounded-full md:h-80 md:w-80"
            >
              <img
                src="/testimonial-pic.svg"
                alt="Testimonials Illustration"
                class="h-full w-full object-contain"
              />
            </div>
          </div>

          <div class="flex w-full flex-col gap-6 md:w-1/2 md:pr-8">
            <div class="flex justify-start">
              <img src="/quotation-mark.svg" alt="Quote Icon" class="h-8 w-8" />
            </div>

            <div
              class="text-lg leading-relaxed text-gray md:text-xl lg:text-2xl"
            >
              {{ currentTestimonial.content }}
            </div>

            <div class="flex flex-col gap-1">
              <div class="font-semibold text-gray">
                - {{ currentTestimonial.name }}
              </div>
              <div class="text-sm font-light text-gray-light">
                {{ currentTestimonial.organization }}
              </div>
            </div>

            <div class="flex items-center gap-4">
              <button
                class="flex h-12 w-12 items-center justify-center rounded-full text-gray transition-all duration-200 hover:-translate-y-1 hover:shadow-btn-primary"
                @click="previousTestimonial"
              >
                <LucideChevronLeft class="h-6 w-6" />
              </button>

              <button
                class="flex h-12 w-12 items-center justify-center rounded-full text-gray transition-all duration-200 hover:-translate-y-1 hover:shadow-btn-primary"
                @click="nextTestimonial"
              >
                <LucideChevronRight class="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Guide section -->

    <div
      class="relative z-10 flex w-full flex-col items-center justify-center gap-10 py-16"
    >
      <!-- Section Header -->
      <div
        class="relative z-10 flex max-w-md flex-col items-center justify-center gap-5 px-4 md:px-0"
      >
        <h2
          class="text-center text-2xl font-semibold leading-none text-gray md:text-3xl lg:text-4xl"
        >
          Hvordan fungerer Sonebyggeren?
        </h2>
        <div class="text-center text-sm font-light text-gray-light md:text-xl">
          En enkel prosess som tar deg fra data til ferdig soneinndeling på
          minutter.
        </div>
      </div>
      <!-- Steps Container -->
      <div
        class="flex w-full max-w-6xl flex-col items-center justify-center gap-8 px-4 md:flex-row md:gap-4 lg:gap-6"
      >
        <template v-for="(step, index) in steps" :key="step.number">
          <!-- Step Card -->
          <div
            class="flex w-full max-w-xs flex-col items-center justify-start gap-4 rounded-lg border bg-primary/10 p-4 text-center shadow-md md:h-[240px] md:max-w-[220px] lg:max-w-[250px]"
          >
            <!-- Step Number -->
            <div
              class="flex h-[30px] w-[30px] items-center justify-center rounded-lg text-xl font-extrabold text-white"
              style="background-color: #282e28"
            >
              {{ step.number }}
            </div>

            <!-- Step Title -->
            <h3
              class="text-lg font-normal text-gray md:text-xl"
              style="font-weight: 400"
            >
              {{ step.title }}
            </h3>

            <!-- Step Description -->
            <p class="text-sm font-light leading-relaxed text-gray-light">
              {{ step.description }}
            </p>
          </div>

          <!-- Arrow (not shown after last step) -->
          <div
            v-if="index < steps.length - 1"
            class="flex items-center justify-center"
          >
            <!-- Desktop Arrow (horizontal) -->
            <div class="hidden md:block">
              <LucideArrowRight class="h-6 w-8 text-gray" />
            </div>

            <div class="block md:hidden">
              <LucideArrowDown class="h-8 w-6 text-gray" />
            </div>
          </div>
        </template>
      </div>

      <!-- Call to Action Buttons -->
      <div class="flex w-full flex-row items-center justify-center gap-4 pt-12">
        <NuxtLink
          to="https://tally.so/r/3lWdYk"
          class="group relative flex items-center justify-center gap-2 rounded-3xl bg-secondary-400 px-5 py-3 text-sm font-medium shadow-btn-primary transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          <span class="tracking-wider text-white">Bestill nå</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Help section -->

    <div class="flex w-full items-center justify-center py-16">
      <div
        class="flex w-full max-w-6xl flex-col items-center justify-center gap-12 bg-white px-20 py-28 lg:flex-row lg:items-center lg:justify-between lg:gap-20"
      >
        <!-- Content Column -->
        <div
          class="flex w-full flex-col items-center justify-center gap-6 text-center lg:w-2/3 lg:items-start lg:text-left"
        >
          <!-- Heading -->
          <h2
            class="text-xl font-normal leading-tight text-gray md:text-2xl lg:text-3xl"
          >
            La oss hjelpe dere med levekårssonene
          </h2>

          <!-- Description Text -->
          <div
            class="flex max-w-xl flex-col gap-4 text-gray-light lg:max-w-full"
          >
            <p class="text-sm leading-relaxed">
              Få kvalitetssikrede soner og faglig støtte gjennom hele prosessen
            </p>
          </div>

          <!-- Buttons Container -->
          <div
            class="flex flex-row flex-wrap justify-center gap-3 lg:justify-start"
          >
            <NuxtLink
              to="https://tally.so/r/3lWdYk"
              class="group relative flex items-center justify-center gap-2 rounded-3xl bg-secondary-400 px-5 py-3 text-sm font-medium shadow-btn-primary transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <span class="tracking-wider text-white"
                >Start med Sonebyggeren</span
              >
            </NuxtLink>
          </div>
        </div>

        <!-- Image Column -->
        <div class="flex w-full items-center justify-center lg:w-1/3">
          <div class="flex max-w-md items-center justify-center lg:max-w-lg">
            <img
              src="/side-sec-illustration.svg"
              alt="Sonebygger illustration"
              class="h-auto w-full max-w-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
// Features array
const featuresArray: { title: string; description: string }[] = [
  {
    title: "Muliggjør målrettede tiltak",
    description:
      "Forstå lokale variasjoner i kommunen og sett inn tiltak og ressurser der det trengs mest",
  },
  {
    title: "Samarbeid på tvers",
    description:
      "Del samme kunnskapsgrunnlag mellom alle kommunens tjenester - fra helse og oppvekst til til plan og infrastruktur",
  },
  {
    title: "Se effekten av tiltak og områdeløft",
    description:
      "Følg utviklingen over tid og identifiser hvilke områder som trenger ekstra oppfølging",
  },
  {
    title: "Enklere rapportering",
    description:
      "Spar tid med ferdig analyserte data på sonenivå som kan brukes direkte i folkehelseoversikter og planverk",
  },
];

// Testimonials data array
const testimonials: { content: string; name: string; organization: string }[] =
  [
    {
      content:
        "Dette verktøyet vil spare oss for mye tid sammenlignet med hvordan vi måtte gjøre dette arbeidet tidligere.",
      name: "Camilla Smedsrud",
      organization: "Nes Kommune",
    },
    {
      content:
        "Verktøyet er veldig brukervennlig og intuitivt. Som en som er streng på universell utforming, må jeg si at dette fungerer veldig bra.",
      name: "Berna Marie Sommerseth",
      organization: "Nes Kommune",
    },
    {
      content:
        "En fantastisk plattform som gir oss mulighet til å se sammenhenger vi ikke så før. Helt uvurderlig for vårt planarbeid.",
      name: "Anne Olsen",
      organization: "Akershus Fylkeskommune",
    },
  ];

// Steps data
const steps: { number: number; title: string; description: string }[] = [
  {
    number: 1,
    title: "Smart start",
    description: "Vår algoritme analyserer data og foreslår soner",
  },
  {
    number: 2,
    title: "Klart forslag",
    description: "Du får soneforslag basert på kommunens sosiodemografi",
  },
  {
    number: 3,
    title: "Enkel justering",
    description: "Tilpass sonene enkelt i en digital kartløsning",
  },
  {
    number: 4,
    title: "Klar til bruk",
    description: "Send inn sonene og få dem ferdigstilt til bruk",
  },
];

// Reactive state
const currentIndex = ref(0);
const currentTestimonial = computed(() => testimonials[currentIndex.value]);

// Navigation functions
function nextTestimonial() {
  if (currentIndex.value === testimonials.length - 1) {
    currentIndex.value = 0; // Loop back to start
  } else {
    currentIndex.value++;
  }
}

function previousTestimonial() {
  if (currentIndex.value === 0) {
    currentIndex.value = testimonials.length - 1; // Loop to end
  } else {
    currentIndex.value--;
  }
}

// Optional: Auto-rotate testimonials
onMounted(() => {
  const interval = setInterval(() => {
    if (currentIndex.value === testimonials.length - 1) {
      currentIndex.value = 0;
    } else {
      currentIndex.value++;
    }
  }, 8000); // Change every 8 seconds

  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>

<style lang="scss" scoped>
.preview-bg {
  background-repeat: no-repeat;
  background-clip: content-box;
  background-size: cover;
  background-position: top center;
  background-image: url("public/Sonebyggeren_header.svg");
}
</style>
