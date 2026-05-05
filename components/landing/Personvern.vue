<template>
  <div
    class="flex w-full items-center justify-center self-center bg-gray-50 py-20"
  >
    <div
      class="flex w-full max-w-7xl flex-col items-start justify-start rounded-lg bg-white px-6 py-12 md:px-8"
    >
      <!-- Page Header -->
      <div class="flex flex-col gap-4 text-left">
        <h1 class="text-3xl font-semibold text-gray md:text-4xl lg:text-5xl">
          Personvernerklæring
        </h1>
        <p class="text-base text-gray-light md:text-lg">
          Denne personvernerklæringen forklarer hvordan Nabolagshelse AS
          behandler personopplysninger, hvilke opplysninger vi samler inn, hva
          vi bruker dem til, og hvilke rettigheter du har.
        </p>
      </div>

      <!-- Content Container -->
      <div class="flex w-full flex-col gap-10 text-left">
        <!-- Behandlingsansvarlig Section -->
        <section class="flex flex-col gap-4">
          <h2 class="text-2xl font-semibold text-gray md:text-3xl">
            Behandlingsansvarlig
          </h2>
          <div
            class="flex flex-col gap-4 text-sm leading-relaxed text-gray-light md:text-base"
          >
            <p>
              Nabolagshelse AS er behandlingsansvarlig for virksomhetens
              behandling av personopplysninger.
            </p>
            <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 class="font-semibold text-gray">Kontaktinformasjon:</h3>
              <div class="flex flex-col gap-1 text-sm">
                <p><strong>Nabolagshelse AS</strong></p>
                <p>Organisasjonsnummer: 933 295 125</p>
                <p>Adresse: Hovstegen 16, 1813 Askim</p>
                <p>
                  E-post:
                  <a
                    href="mailto:post@nabolagshelse.no"
                    class="text-blue-600 hover:underline"
                    >post@nabolagshelse.no</a
                  >
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Hvilke personopplysninger Section -->
        <section class="flex flex-col gap-4">
          <h2 class="text-2xl font-semibold text-gray md:text-3xl">
            Hvilke personopplysninger vi behandler
          </h2>
          <div
            class="flex flex-col gap-4 text-sm leading-relaxed text-gray-light md:text-base"
          >
            <p>
              Vi behandler kontaktinformasjon som navn, e-postadresse og
              telefonnummer til:
            </p>
            <ul class="flex list-disc flex-col gap-2 pl-6">
              <li>Samarbeidspartnere og kunder vi har inngått avtaler med</li>
              <li>Personer som har meldt seg på vårt nyhetsbrev/infobrev</li>
            </ul>
            <div>
              <p>
                <strong>Merk:</strong> I Nabolagshelse-plattformen behandler vi
                kun anonymiserte og aggregerte helse- og levekårsdata. Disse
                opplysningene regnes ikke som personopplysninger og omfattes
                derfor ikke av personvernforordningen (GDPR).
              </p>
            </div>
          </div>
        </section>

        <!-- Formål og rettslig grunnlag Section -->
        <section class="flex flex-col gap-4">
          <h2 class="text-2xl font-semibold text-gray md:text-3xl">
            Formål og rettslig grunnlag
          </h2>
          <div
            class="flex flex-col gap-4 text-sm leading-relaxed text-gray-light md:text-base"
          >
            <div class="flex flex-col gap-4">
              <div>
                <h3 class="mb-2 font-semibold text-gray">
                  Kundeliste og samarbeidspartnere:
                </h3>
                <p>
                  Vi behandler personopplysninger for å oppfylle inngåtte
                  avtaler og følge opp samarbeid. Rettslig grunnlag: GDPR art. 6
                  (1) b (nødvendig for å oppfylle en avtale) og art. 6 (1) f
                  (berettiget interesse).
                </p>
              </div>
              <div>
                <h3 class="mb-2 font-semibold text-gray">
                  Infobrev/nyhetsbrev:
                </h3>
                <p>
                  Vi sender ut informasjon til personer som har gitt sitt
                  samtykke. Du kan når som helst trekke tilbake samtykket ved å
                  bruke avmeldingslenken eller kontakte oss. Rettslig grunnlag:
                  GDPR art. 6 (1) a (samtykke).
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Lagringstid Section -->
        <section class="flex flex-col gap-4">
          <h2 class="text-2xl font-semibold text-gray md:text-3xl">
            Lagringstid
          </h2>
          <div
            class="flex flex-col gap-4 text-sm leading-relaxed text-gray-light md:text-base"
          >
            <ul class="flex list-disc flex-col gap-2 pl-6">
              <li>
                Kontaktinformasjon fra kunder og samarbeidspartnere oppbevares
                så lenge kundeforholdet varer, og i henhold til lovpålagte krav
                (f.eks. bokføringsloven).
              </li>
              <li>
                Kontaktinformasjon til mottakere av infobrev oppbevares inntil
                du trekker tilbake samtykket.
              </li>
            </ul>
          </div>
        </section>

        <!-- Deling av opplysninger Section -->
        <section class="flex flex-col gap-4">
          <h2 class="text-2xl font-semibold text-gray md:text-3xl">
            Deling av opplysninger og bruk av databehandlere
          </h2>
          <div
            class="flex flex-col gap-4 text-sm leading-relaxed text-gray-light md:text-base"
          >
            <p>
              Vi deler ikke personopplysninger med andre med mindre vi er
              rettslig forpliktet til det, eller det er nødvendig for å levere
              våre tjenester (f.eks. utsending av nyhetsbrev).
            </p>
            <p>
              Vi kan benytte eksterne tjenesteleverandører (databehandlere) til
              drift av IT-systemer, e-post og nyhetsbrev. Slike leverandører
              behandler kun personopplysninger på våre vegne og etter inngåtte
              databehandleravtaler.
            </p>
          </div>
        </section>

        <!-- Informasjonskapsler Section -->
        <section class="flex flex-col gap-4">
          <h2 class="text-2xl font-semibold text-gray md:text-3xl">
            Informasjonskapsler (cookies)
          </h2>
          <div
            class="flex flex-col gap-4 text-sm leading-relaxed text-gray-light md:text-base"
          >
            <p>
              Nettsiden vår bruker cookies for å samle inn statistikk og
              forbedre brukeropplevelsen.
            </p>
            <h3 class="font-semibold text-gray">Vi benytter blant annet:</h3>
            <div class="flex flex-col gap-4">
              <div class="p-4">
                <h4 class="font-semibold text-gray">Google Analytics</h4>
                <p class="text-sm leading-relaxed text-gray-light">
                  analyserer hvordan besøkende bruker nettsiden (f.eks. besøkte
                  sider, tid brukt på nettstedet). Data anonymiseres så langt
                  det er mulig og benyttes kun i aggregert form.
                </p>
              </div>
              <div class="p-4">
                <h4 class="font-semibold text-gray">Microsoft Clarity</h4>
                <p class="text-sm leading-relaxed text-gray-light">
                  gir innsikt i hvordan besøkende navigerer og interagerer på
                  nettsiden (klikk, musebevegelser, navigasjonsmønstre). Data
                  anonymiseres så langt det lar seg gjøre og brukes kun til
                  analyseformål.
                </p>
              </div>
            </div>
            <div class="p-4">
              <p class="text-sm leading-relaxed text-gray-light">
                <strong>Overføring utenfor EØS:</strong> Ved bruk av disse
                verktøyene kan data bli overført til servere utenfor EØS (f.eks.
                USA). Vi benytter kun løsninger som oppfyller gjeldende krav til
                personvern og dataoverføring.
              </p>
            </div>
            <div class="p-4">
              <p class="text-sm leading-relaxed text-gray-light">
                <strong>Merk:</strong> I Nabolagshelse-plattformen behandler vi
                kun anonymiserte og aggregerte helse- og levekårsdata. Disse
                opplysningene regnes ikke som personopplysninger og omfattes
                derfor ikke av personvernforordningen (GDPR).
              </p>
            </div>
          </div>
        </section>

        <!-- Cookie Management Section -->
        <section class="flex flex-col gap-4">
          <h2 class="text-2xl font-semibold text-gray md:text-3xl">
            Slik kan du styre cookies
          </h2>
          <div
            class="flex flex-col gap-4 text-sm leading-relaxed text-gray-light md:text-base"
          >
            <p>
              Du kan administrere cookies i innstillingene til din nettleser.
              Der kan du:
            </p>
            <ul class="flex list-disc flex-col gap-2 pl-6">
              <li>Slette eksisterende cookies</li>
              <li>Blokkere lagring av cookies automatisk</li>
              <li>Få varsler når et nettsted forsøker å lagre cookies</li>
            </ul>
            <p class="text-sm leading-relaxed text-gray-light">
              Merk at enkelte funksjoner på nettstedet kan fungere dårligere
              uten cookies.
            </p>
          </div>
        </section>

        <!-- Dine rettigheter Section -->
        <section class="flex flex-col gap-4">
          <h2 class="text-2xl font-semibold text-gray md:text-3xl">
            Dine rettigheter
          </h2>
          <div
            class="flex flex-col gap-4 text-sm leading-relaxed text-gray-light md:text-base"
          >
            <p>Som registrert har du rett til å:</p>
            <ul class="flex list-disc flex-col gap-2 pl-6">
              <li>Be om innsyn i hvilke personopplysninger vi har om deg</li>
              <li>Få rettet feilaktige eller ufullstendige opplysninger</li>
              <li>Få slettet opplysninger (dersom vilkårene er oppfylt)</li>
              <li>Be om begrensning av behandlingen</li>
              <li>Protestere mot behandlingen</li>
              <li>
                Be om dataportabilitet (å få utlevert opplysninger du har gitt
                oss, i et strukturert og maskinlesbart format)
              </li>
            </ul>
            <p>
              For å utøve dine rettigheter kan du kontakte oss på
              <a
                href="mailto:post@nabolagshelse.no"
                class="text-blue-600 hover:underline"
                >post@nabolagshelse.no</a
              >. Vi besvarer henvendelser så raskt som mulig, og senest innen 30
              dager.
            </p>
          </div>
        </section>

        <!-- Klagerett Section -->
        <section class="flex flex-col gap-4">
          <h2 class="text-2xl font-semibold text-gray md:text-3xl">
            Klagerett
          </h2>
          <div
            class="flex flex-col gap-4 text-sm leading-relaxed text-gray-light md:text-base"
          >
            <p>
              Hvis du mener vår behandling av personopplysninger er i strid med
              regelverket, kan du klage til:
            </p>
            <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 class="font-semibold text-gray">Datatilsynet</h3>
              <div class="flex flex-col gap-1 text-sm">
                <p>Postboks 458 Sentrum, 0105 Oslo</p>
                <p>
                  E-post:
                  <a
                    href="mailto:postkasse@datatilsynet.no"
                    class="text-blue-600 hover:underline"
                    >postkasse@datatilsynet.no</a
                  >
                </p>
                <p>Telefon: 22 39 69 00</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Endringer Section -->
        <section class="flex flex-col gap-4">
          <h2 class="text-2xl font-semibold text-gray md:text-3xl">
            Endringer i personvernerklæringen
          </h2>
          <div
            class="flex flex-col gap-4 text-sm leading-relaxed text-gray-light md:text-base"
          >
            <p>
              Denne personvernerklæringen vil oppdateres ved behov. Eventuelle
              vesentlige endringer kunngjøres på vårt nettsted.
            </p>
            <p class="font-semibold text-gray">Sist oppdatert: 28.08.2025</p>
          </div>
        </section>
      </div>

      <!-- Back to Home Button -->
      <div class="flex w-full justify-start pt-12">
        <NuxtLink
          to="/"
          class="group relative flex items-center justify-center gap-2 rounded-xl bg-secondary-400 bg-gradient-to-b from-[rgba(255,255,255,0.16)] to-transparent px-6 py-3 text-sm font-medium text-white shadow-btn-primary transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          <LucideArrowLeft
            class="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1"
          />
          <span class="tracking-[-0.006em]">Tilbake til forsiden</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Set page metadata
definePageMeta({
  layout: "landing",
});

// Set page title
useHead({
  title: "Personvernerklæring - Nabolagshelse",
});
</script>
