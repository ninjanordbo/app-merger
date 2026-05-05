<!-- eslint-disable vue/no-v-html -->
<template>
  <main
    class="dotted-hero-background relative flex w-full flex-col items-center bg-gray-50"
  >
    <!-- Dotted hero background -->
    <div
      class="flex w-full flex-col items-center justify-center gap-5 pt-36 sm:pt-48 lg:px-5"
    >
      <!-- Hero section -->
      <div
        class="relative z-10 flex max-w-[90%] flex-col items-center justify-center gap-5 px-5 md:max-w-2xl lg:max-w-3xl"
      >
        <h1
          class="w-full text-center text-3xl font-semibold text-gray md:text-5xl lg:text-6xl"
        >
          Bedre oversikt over folkehelse og levekår i kommunen
        </h1>

        <div class="px-4 text-center text-base font-light">
          Fra kompleks statistikk til et solid beslutningsgrunnlag. Få et
          komplett verktøy for analyse, folkehelsearbeid og levekårskartlegging
          i din kommune.
        </div>

        <NuxtLink
          to="https://tally.so/r/3lWdYk"
          class="relative flex items-center justify-center gap-2 rounded-3xl bg-secondary-400 px-10 py-2 text-sm font-medium transition-all duration-200"
        >
          <span class="tracking-wider text-white">Bestill tilgang i dag</span>
        </NuxtLink>
      </div>

      <!-- Platform features -->
      <div
        class="hidden w-full max-w-xl grid-cols-2 items-start justify-center gap-5 px-5 pt-10 xxs:grid sm:flex-row md:max-w-6xl md:grid-cols-4"
      >
        <LandingPlatformBenefitBullet
          v-for="item in platformBenefitsArray"
          v-bind="item"
          :key="item.title"
        />
      </div>
    </div>

    <!-- Mockup -->
    <div
      class="mockup-section-background relative flex w-full items-center justify-center pb-12"
    >
      <div
        class="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center gap-12 px-5"
      >
        <img
          src="/mockup.png"
          alt="Skjermbilde av Nabolagshelse-plattformens interaktive dashbord som inkluderer kart, diagrammer, nøkkeltall og grafer."
          class="pointer-events-none relative z-10 h-auto w-full"
        />
      </div>
    </div>

    <!-- Et verktøy som Section -->

    <div class="flex w-full items-center justify-center py-24">
      <div class="flex w-full max-w-4xl flex-col items-center gap-10">
        <div
          class="relative z-10 flex max-w-xl flex-col items-center justify-center gap-5 py-10"
        >
          <h2
            class="text-center text-2xl leading-none text-gray md:text-2xl lg:text-3xl"
          >
            Et verktøy som forenkler hverdagen
          </h2>
          <div class="px-4 text-center text-sm font-light text-gray-light">
            Med oppdaterte levekårs- og folkehelsedata på sonenivå gjør
            verktøyet det enkelt å analysere og visualisere komplekse
            sammenhenger. Dette gir et tryggere grunnlag for beslutninger i
            folkehelsearbeidet, og forenkler jobben både med levekårskartlegging
            og folkehelserapporter.
          </div>
        </div>
        <div class="flex w-full flex-row items-center justify-center gap-12">
          <!-- Card 1 -->
          <div
            class="dotted-background-bg flex h-64 w-64 flex-col items-center rounded-xl border-[0.5px] border-primary/50 bg-white p-5 shadow-md"
          >
            <img
              src="/tool1.png"
              alt="Illustrasjon av en person som noterer på et ark med en sjekkliste, symboliserer redusert tidsbruk og effektivitet i folkehelsearbeidet."
              class="mb-4 h-32 w-32 object-contain"
            />
            <div class="py-4 text-center text-base font-medium">
              Mindre tidsbruk
            </div>
          </div>
          <!-- Card 2 -->
          <div
            class="dotted-background-bg flex h-64 w-64 flex-col items-center rounded-xl border-[0.5px] border-primary/50 bg-white p-5 shadow-md"
          >
            <img
              src="/tool2.png"
              alt="Illustrasjon av en lyspære med en hjerne inni, symboliserer bedre forståelse og innsikt fra analyse av levekårsdata."
              class="mb-4 h-32 w-32 object-contain"
            />
            <div class="py-4 text-center text-base font-medium">
              Bedre forståelse
            </div>
          </div>
          <!-- Card 3 -->
          <div
            class="dotted-background-bg flex h-64 w-64 flex-col items-center rounded-xl border-[0.5px] border-primary/50 bg-white p-5 shadow-md"
          >
            <img
              src="/tool3.png"
              alt="Illustrasjon av et diagram med piler og et pengesymbol, symboliserer tryggere beslutninger basert på solid statistikk og dataanalyse."
              class="mb-4 h-32 w-32 object-contain"
            />
            <div class="py-4 text-center text-base font-medium">
              Tryggere beslutninger
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Test demo av platformen -->
    <div class="flex w-full flex-col items-center justify-center py-24">
      <div
        class="relative z-10 flex max-w-xl flex-col items-center justify-center gap-5 pb-12"
      >
        <h2
          class="text-center text-2xl leading-none text-gray md:text-2xl lg:text-3xl"
        >
          Nysgjerrig på hvordan Nabolagshelse fungerer?
        </h2>
        <div class="px-4 text-center text-sm font-light text-gray-light">
          Utforsk vårt kartbaserte analyseverktøy. Velg en indikator og se
          hvordan levekårsdata for en valgfri kommune umiddelbart blir
          visualisert.
        </div>
      </div>
      <div
        class="green-circle-bg flex w-full max-w-6xl flex-col items-center justify-center gap-5 border-[0.5px] border-primary/50 bg-white bg-none pt-10 sm:py-10 lg:w-11/12 lg:rounded-xl lg:px-10 lg:shadow-md"
      >
        <LandingDashboardPreview />
      </div>
    </div>

    <!-- Alt på ett sted -->
    <div
      class="relative z-10 flex w-full flex-col items-center justify-center gap-10 py-24"
    >
      <div
        class="relative z-10 flex max-w-md flex-col items-center justify-center gap-5"
      >
        <h2
          class="text-center text-2xl leading-none text-gray md:text-2xl lg:text-3xl"
        >
          Endelig all innsikt samlet i én plattform
        </h2>
        <div class="px-4 text-center text-sm font-light text-gray-light">
          En brukervennlig løsning for folkehelse- og levekårsdata. Få full
          oversikt over status i din kommune, presentert enkelt, oversiktlig og
          klart til bruk.
        </div>
      </div>

      <!-- Benefits Section -->
      <div
        class="flex w-full max-w-6xl flex-col items-center justify-center gap-5 px-5"
      >
        <div class="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
          <!-- Card 1 -->
          <div
            class="dotted-background-bg relative flex h-64 flex-col overflow-hidden rounded-xl p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl md:h-80"
          >
            <div
              class="relative z-20 flex flex-1 flex-col items-center justify-center text-center text-gray md:items-start md:justify-start md:text-left lg:pt-10"
            >
              <h3 class="mb-2 text-lg leading-none lg:text-xl">
                Skreddersydde dashbord
              </h3>
              <p class="text-sm leading-relaxed">
                Bygg interaktive dashbord for enkle analyser av helsedata eller
                sammenligning mellom ulike soner og grunnkretser.
              </p>
            </div>
            <div
              class="absolute -bottom-20 right-0 z-10 hidden h-72 w-72 translate-x-8 translate-y-8 md:block md:translate-x-12 md:translate-y-12"
            >
              <img
                src="/benefits/dashboard1.png"
                alt="Skjermbilde av Nabolagshelseplattformens interaktive dashbord som viser kart og diagrammer med folkehelsedata og levekårsindikatorer."
                class="h-full w-full object-contain drop-shadow-lg"
              />
            </div>
            <div
              class="absolute -bottom-20 right-20 z-20 hidden h-72 w-72 translate-x-4 translate-y-4 md:block md:translate-x-8 md:translate-y-8"
            >
              <img
                src="/benefits/dashboard2.png"
                alt="Illustrasjon av team som samarbeider rundt Nabolagshelse-plattformen for å analysere folkehelsedata."
                class="h-full w-full object-contain drop-shadow-xl"
              />
            </div>
          </div>

          <!-- Card 2 -->
          <div
            class="dotted-background-bg relative flex h-64 flex-col overflow-hidden rounded-xl p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl md:row-span-2 md:h-auto lg:pt-10"
          >
            <div
              class="relative z-20 flex flex-1 flex-col items-center justify-center text-center text-gray md:items-start md:justify-start md:text-left"
            >
              <h3 class="mb-2 text-lg leading-none lg:text-xl">
                Komplett befolkningsdata
              </h3>
              <p class="mb-4 text-sm leading-relaxed">
                Få tilgang til SSBs indikatorer på sonenivå for alle kommuner.
                Vi samler statistikk fra flere kilder for å gi deg det beste
                grunnlaget for å kartlegge helseforskjeller.
              </p>
            </div>
            <img
              src="/benefits/indicatorlist1.png"
              alt="Skjermbilde av et interaktivt dashbord i Nabolagshelse som viser geografisk analyse av helsedata og levekårsindikatorer for ulike soner og grunnkretser i en kommune."
              class="relative -bottom-10 -right-10 z-10 mt-auto hidden h-auto w-full object-contain drop-shadow-lg md:block"
            />
          </div>

          <!-- Card 3 -->
          <div
            class="dotted-background-bg relative flex h-64 flex-col overflow-hidden rounded-xl p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl md:h-80"
          >
            <div
              class="relative z-20 flex flex-1 flex-col items-center justify-center text-center text-gray md:items-start md:justify-start md:text-left lg:pt-10"
            >
              <h3 class="mb-2 text-lg leading-none lg:text-xl">
                Effektiv rapportering
              </h3>
              <p class="text-sm leading-relaxed">
                Eksporter grafer og kart direkte til bruk i folkehelserapporten
                eller kommunale temaplaner.
              </p>
            </div>
            <div
              class="absolute -bottom-20 right-0 z-10 hidden h-72 w-72 translate-x-8 translate-y-8 md:block md:translate-x-12 md:translate-y-12"
            >
              <img
                src="/benefits/indicator3.png"
                alt="Skjermbilde av Nabolagshelse som presenterer en detaljert oversikt over befolkningsdata og levekårsindikatorer fra SSB, inkludert demografi, oppvekst, utdanning og økonomi."
                class="h-full w-full object-contain drop-shadow-lg"
              />
            </div>
            <div
              class="absolute -bottom-20 right-28 z-20 hidden h-72 w-72 translate-x-4 translate-y-4 md:block md:translate-x-8 md:translate-y-8"
            >
              <img
                src="/benefits/indicator2.png"
                alt="Skjermbilde av Nabolagshelse som viser eksportfunksjoner for grafer og kart, klare til bruk i folkehelserapporter og kommunale temaplaner."
                class="h-full w-full object-contain drop-shadow-xl"
              />
            </div>
          </div>

          <!-- Card 4 -->
          <div
            class="dotted-background-bg relative col-span-1 flex h-48 flex-col items-center justify-center overflow-hidden rounded-xl bg-cover bg-center px-16 py-8 shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl md:col-span-2 md:h-56 md:flex-row md:items-center md:justify-between"
          >
            <div
              class="relative z-10 flex-1 text-center text-gray md:text-left"
            >
              <h3 class="mb-3 text-lg leading-none lg:text-xl">
                Kontinuerlig og oppdatert oversikt
              </h3>
              <p class="mx-auto max-w-2xl text-sm leading-relaxed md:mx-0">
                Nabolagshelse plattformen gir deg alltid oppdatert statistikk
                over levekår og helse, helt uten manuelt arbeid.
              </p>
            </div>
            <div class="relative z-10 hidden md:block">
              <img
                src="/benefits/character.png"
                alt="Illustrasjon av en person som peker oppover mens hun bruker en laptop, symboliserer kontinuerlig og oppdatert oversikt over levekår og folkehelse i Nabolagshelse-plattformen."
                class="h-40 w-auto object-contain drop-shadow-lg lg:h-48"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vanlige spørsmål -->
    <div class="relative z-10 flex w-full items-center justify-center pt-10">
      <div
        class="flex w-full flex-col items-center justify-center gap-14 px-5 pb-24 lg:px-0"
      >
        <h2 class="text-2xl leading-none text-gray md:text-3xl lg:text-4xl">
          Vanlige spørsmål
        </h2>

        <!-- FAQ Items -->
        <div class="flex w-full max-w-4xl flex-col gap-3">
          <div
            v-for="faq in faqArray"
            :key="faq.question"
            class="faq-item w-full rounded-md bg-[#EFF1F1] transition-all duration-300"
          >
            <!-- Question Header -->
            <button
              class="flex w-full cursor-pointer items-center justify-between px-6 py-4 text-left"
              @click="toggleFaq(faq.question)"
            >
              <span class="pr-4 text-base font-normal text-gray">{{
                faq.question
              }}</span>
              <div class="flex flex-shrink-0 items-center">
                <LucidePlus
                  v-if="!openFaqs[faq.question]"
                  class="h-6 w-6 text-gray transition-transform duration-200"
                />
                <LucideX
                  v-else
                  class="h-6 w-6 text-gray transition-transform duration-200"
                />
              </div>
            </button>

            <!-- Answer Content -->
            <div
              v-if="openFaqs[faq.question]"
              class="border-t border-gray-200 px-6 py-4"
            >
              <div
                class="text-sm leading-relaxed text-gray-light md:text-base"
                v-html="faq.answer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Våre kunder Section -->

    <div class="flex w-full items-center justify-center py-20">
      <div
        class="flex w-full max-w-6xl flex-col items-center justify-center gap-12 px-5"
      >
        <h2 class="text-2xl leading-none text-gray md:text-3xl lg:text-4xl">
          Våre kunder
        </h2>
        <!-- Customer Logos Grid -->
        <div class="grid w-full grid-cols-2 gap-4 px-4 md:grid-cols-4 lg:gap-6">
          <div
            v-for="customer in customerLogos"
            :key="customer.name"
            class="flex items-center justify-center"
          >
            <img
              :src="customer.logo"
              :alt="customer.name"
              class="h-16 w-40 rounded-xl object-contain p-4 transition-all duration-200 hover:scale-105"
              style="background-color: #eff1f1"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Levekårssoner Section -->
    <div
      class="green-circle-bg flex max-w-7xl items-center justify-center border-[0.5px] border-primary/50 px-8 py-20 lg:w-11/12 lg:rounded-xl lg:px-10 lg:shadow-md"
    >
      <div
        class="flex w-full max-w-6xl flex-col items-center justify-center gap-12 px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-20"
      >
        <!-- Content Column -->
        <div
          class="flex w-full flex-col items-center justify-center gap-6 text-center lg:w-2/3 lg:items-start lg:text-left"
        >
          <!-- Heading -->
          <h2
            class="text-xl font-normal leading-tight text-gray md:text-2xl lg:text-3xl"
          >
            Mangler din kommune levekårssoner?
          </h2>

          <!-- Description Text -->
          <div class="flex max-w-xl flex-col gap-4 text-gray lg:max-w-full">
            <p class="text-sm leading-relaxed">
              Uten gode soner blir folkehelsearbeidet upresist. Mange kommuner
              mangler oppdaterte inndelinger, noe som gjør det vanskelig å
              målrette tiltak der behovet er størst.
            </p>

            <p class="text-sm leading-relaxed">
              Med Sonebyggeren etablerer dere nye soner på rekordtid. Få et
              solid statistikkgrunnlag og spar måneder med manuelt arbeid. Vi
              veileder dere hele veien.
            </p>
          </div>

          <!-- Buttons Container -->
          <div
            class="flex flex-row flex-wrap justify-center gap-3 lg:justify-start"
          >
            <!-- Primary Button - Bestill nå -->
            <NuxtLink
              to="https://tally.so/r/3lWdYk"
              class="relative flex items-center justify-center gap-2 rounded-3xl bg-secondary-400 px-10 py-2 text-sm font-medium transition-all duration-200"
            >
              <span class="tracking-wider text-white"
                >Bestill tilgang i dag</span
              >
            </NuxtLink>

            <!-- Secondary Button - Les mer om Sonebyggeren -->
            <NuxtLink
              to="/sonebyggeren"
              class="group relative flex items-center justify-center gap-2 rounded-3xl bg-white px-5 py-3 text-sm font-medium shadow-btn-primary transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <span class="tracking-wider text-gray"
                >Les mer om Sonebyggeren</span
              >
            </NuxtLink>
          </div>
        </div>

        <!-- Image Column -->
        <div class="flex w-full items-center justify-center lg:w-1/3">
          <div class="flex max-w-md items-center justify-center lg:max-w-lg">
            <img
              src="/side-sec-illustration.svg"
              alt="Illustrasjon av personer som diskuterer soneinndeling og levekårssoner, relatert til Sonebyggeren-verktøyet."
              class="h-auto w-full max-w-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Om oss -->
    <div class="flex w-full items-center justify-center py-20">
      <div
        class="pb-18 flex w-full flex-col items-center justify-center gap-14 px-5 pt-16 lg:px-0"
      >
        <!-- Description Text -->
        <div
          class="flex max-w-2xl flex-col gap-6 rounded-lg bg-white p-10 text-center text-gray"
        >
          <h2 class="text-2xl leading-none text-gray md:text-3xl lg:text-4xl">
            Om oss
          </h2>
          <p class="text-sm leading-relaxed md:text-base lg:text-lg">
            Nabolagshelse har et en visjon om å skape sosialt bærekraftige
            lokalsamfunn med god livskvalitet og helse for alle. Vår
            analyseplattform bruker kvalitetssikret data for å gi løpende
            oversikt over og innsikt i folkehelsen i kommuner, levekårssoner.
          </p>

          <p class="text-sm leading-relaxed md:text-base lg:text-lg">
            Slik kan kommuner, helsemyndigheter og organisasjoner ta bedre
            beslutninger som fremmer befolkningens helse og utjevner sosiale
            forskjeller. Våre verktøy identifiserer hvor skoen trykker på hvert
            enkelt sted og kan identifisere lokale utfordringer og ressurser. Vi
            samler, kvalitetssikrer og tilrettelegger data om trivsel,
            bokkvalitet, sosiale og miljømessige forhold, skoler og barnehager,
            psykisk og somatisk sykdom, skader og utfordringer på ett sted.
          </p>
        </div>
      </div>
    </div>

    <!-- Teamet bak Nabolagshelse & Støttet av (Merged Column Layout) -->
    <div
      class="dotted-background-bg flex w-full items-center justify-center py-20"
    >
      <div
        class="flex w-full flex-col items-center justify-center gap-14 px-5 pb-24 pt-16 lg:px-0"
      >
        <h2
          class="text-center text-2xl leading-none text-gray md:text-3xl lg:text-4xl"
        >
          Teamet bak Nabolagshelse
        </h2>

        <div class="w-full max-w-3xl text-center text-sm lg:text-lg">
          Vi er et tverrfaglig team av forskere og utviklere med bakgrunn fra
          forskningssenteret PROMENTA ved Universitetet i Oslo. Vi kombinerer
          solid akademisk kompetanse med moderne teknologi. Målet er å gi
          kommunene bedre verktøy for å forstå folkehelsen, forebygge
          utenforskap og utjevne sosiale forskjeller.
        </div>

        <div class="flex w-full flex-wrap items-center justify-center gap-5">
          <LandingBioCard
            v-for="bio in bioArray"
            :key="bio.name"
            :bio="bio"
            :alt="bio.alt"
          />
        </div>

        <!-- Støttet av Section (always below in column layout) -->
        <h2 class="pt-20 text-2xl leading-none text-gray md:text-3xl">
          Støttet av
        </h2>

        <div
          class="grid w-full max-w-4xl grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-8"
        >
          <!-- First Row Mobile / Left Side Desktop -->
          <div
            v-for="supporter in supportersArray.slice(0, 2)"
            :key="supporter.name"
            class="flex items-center justify-center"
          >
            <div
              class="flex h-16 w-full items-center justify-center md:h-20 lg:h-24"
            >
              <img
                :src="supporter.logo"
                :alt="supporter.name"
                class="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          <!-- SPARK - Always centered in the row -->
          <div
            class="col-span-2 flex items-center justify-center md:col-span-1"
          >
            <div
              class="flex h-20 w-full items-center justify-center md:h-24 lg:h-28"
            >
              <img
                src="/supporters/sparksi.png"
                alt="SPARK"
                class="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          <!-- Second Row Mobile / Right Side Desktop -->
          <div
            v-for="supporter in supportersArray.slice(2, 4)"
            :key="supporter.name"
            class="flex items-center justify-center"
          >
            <div
              class="flex h-16 w-full items-center justify-center md:h-20 lg:h-24"
            >
              <img
                :src="supporter.logo"
                :alt="supporter.name"
                class="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
// FAQ Data
const faqArray: { question: string; answer: string }[] = [
  {
    question: "Hva er Nabolagshelse.no?",
    answer:
      "Nabolagshelse.no er en digital plattform som gir kommuner og samarbeidspartnere tilgang til geografiske folkehelsedata og levekårsdata på detaljert nivå – helt ned til grunnkretser og levekårssoner. Plattformen hjelper med å identifisere hvor skoen trykker og styrker kunnskapsgrunnlaget for planlegging og tiltak.",
  },
  {
    question: "Hvilke data er i plattformen?",
    answer:
      "Visjonen med plattformen er å samle alle data på ett sted. Vi har så langt integrert SSBs omfattende datasett med 25 levekårsindikatorer i plattformen, slik at alle landets kommuner for første gang kan få detaljert oversikt over levekår på sonenivå. I tillegg har vi flere indikatorer om sosiodemografi fra Geodata AS. Vi jobber kontinuerlig med å få inn nye datakilder og fremtidige data inkluderer Fylkeshelseundersøkelsene, informasjon om natur og grøntområder, fastleger, bruk av helsetjenester og medikamenter, informasjon om skoler og barnehager, Ungdata, Kreftregisteret, trafikksikkerhet, luftforurensning, og mobilitet (Telia Crowd Insights).",
  },
  {
    question: "Hvilke funksjoner finnes i plattformen?",
    answer:
      "Det er nå mulighet for å lage ulike typer diagrammer, sammenligne områder med kartgrafikk, og vise nøkkeltall for en rekke ulike datakilder, på grunnkrets-, levekårssone-, kommune- og fylkes-nivå. Funksjoner som lanseres fortløpende inkluderer:<br><br><ul class='list-disc ml-6 space-y-1'><li>Se på utvikling over tid</li><li>Dele prosjekter og tverrsektorielt samarbeid</li><li>Publisere resultater på nettsider</li><li>Maler for levekårskartlegging og folkehelserapporter</li></ul>",
  },
  {
    question: "Hvem kan bruke plattformen?",
    answer:
      "Plattformen er laget for kommuner og fylkeskommuner:<br><br><ul class='list-disc ml-6 space-y-1'><li>Folkehelsekoordinatorer</li><li>Samfunnsplanleggere</li><li>Kommuneadministrasjon</li><li>Politikere</li><li>Andre aktører innen folkehelsearbeid, byutvikling og frivillighet</li></ul>",
  },
  {
    question:
      "Hvordan skiller dette seg fra SSB eller Helsedirektoratets statistikk?",
    answer:
      "Nabolagshelse samler data på tvers av mange kilder og visualiserer dem på en brukervennlig og lokalt tilpasset måte. Vi tar på alvor at mye av folkehelsen formes i de små geografiske områdene der folk faktisk bor, og er de første som tilbyr et omfattende statistikkgrunnlag på levekårssone-nivå. I tillegg tilbyr vi mulighet for analyser, eksport og rådgivningstjenester for å kartlegge helseforskjeller.",
  },
  {
    question: "Hva er en levekårssone, og hvorfor bruker vi det?",
    answer:
      "Levekårssoner er geografiske områder (minimum ca. 1500 innbyggere) som er utviklet for å gi mer presis og lokal innsikt i levekår og helseforhold. Dette gir kommunene bedre grunnlag for målretting av tiltak mot sosiale ulikheter innad i kommunen.",
  },
  {
    question: "Hvordan kan jeg bruke plattformen i folkehelsearbeidet vårt?",
    answer:
      "Du kan bruke Nabolagshelse.no til å:<br><br><ul class='list-disc ml-6 space-y-1'><li>Lage oversiktsdokumenter med tilpasset datagrunnlag</li><li>Identifisere geografiske ulikheter og levekårsutfordringer</li><li>Prioritere og evaluere tiltak basert på lokale data</li><li>Vurdere utvikling over tid (kommer)</li></ul>",
  },
  {
    question: "Må vi ha egne levekårssoner for å bruke plattformen?",
    answer:
      "Nei. Hvis kommunen ikke har egne levekårssoner, hjelper vi dere med å etablere soner basert på grunnkretser og statistiske retningslinjer fra SSB. Vi har utviklet et eget verktøy (Sonebyggeren) som kan brukes til å lage algoritmebaserte forslag til levekårssoner, som deretter kan justeres av kommunen basert på lokalkunnskap.",
  },
  {
    question: "Kan vi eksportere data ut fra plattformen?",
    answer:
      "Ja. Eksportfunksjoner (Excel, CSV) er under utvikling. Dette er høyt prioritert basert på brukernes ønsker, slik at data enkelt kan brukes i folkehelserapporter og planverk.",
  },
  {
    question: "Hva koster det å bruke Nabolagshelse.no?",
    answer:
      "Plattformen er i en pilotfase. Endelig prismodell er under utvikling, men vil variere etter kommunestørrelse og behov. Vi har i tillegg svært fordelaktige betingelser for kommuner og fylkeskommuner som ønsker å bli pilotkunde.",
  },
  {
    question: "Kan vi få hjelp til analyse og tolkning av data?",
    answer:
      "Ja. Vi tilbyr rådgivning og forskningsstøtte fra vårt fagteam, inkludert hjelp med tolkning, rapportering og vurdering av tiltak for å møte folkehelseutfordringer.",
  },
  {
    question: "Hvordan kommer vi i gang?",
    answer:
      "Ta kontakt på <a href=\"mailto:post@nabolagshelse.no\" class=\"text-blue-600 hover:underline\">post@nabolagshelse.no</a>, så setter vi opp en introduksjonssamtale. Vi kan også hjelpe dere med onboarding og datagrunnlag.",
  },
];

// FAQ State Management
const openFaqs = ref<{ [key: string]: boolean }>({});

const toggleFaq = (question: string) => {
  openFaqs.value[question] = !openFaqs.value[question];
};

// Customer logos data
const customerLogos: { name: string; logo: string }[] = [
  {
    name: "Logoer fra Akershus fylkeskommune",
    logo: "/customers/akershus.png",
  },
  {
    name: "Vestfold fylkeskommune",
    logo: "/customers/vestfold.png",
  },
  {
    name: "Telemark fylkeskommune",
    logo: "/customers/telemark.png",
  },
  {
    name: "Larvik Kommune",
    logo: "/customers/larvik.png",
  },
  {
    name: "Holmestrand Kommune",
    logo: "/customers/holmestrand.png",
  },
  {
    name: "Horten Kommune",
    logo: "/customers/horten.png",
  },
  {
    name: "Sandefjord Kommune",
    logo: "/customers/sandefjord.png",
  },
  {
    name: "Færder kommune",
    logo: "/customers/faerder.png",
  },
];

// Bio array

const bioArray: {
  avatarLink: string;
  name: string;
  role: string;
  alt: string;
  links: { linkedIn: string };
}[] = [
  {
    avatarLink: "/tilmann.png",
    name: "Tilmann von Soest",
    alt: "Portrettbilde av Tilmann von Soest, Gründer og psykolog i Nabolagshelse.",
    role: "Gründer, psykolog, professor ved Universitet i Oslo",
    links: {
      linkedIn: "https://www.linkedin.com/in/tilmann-von-soest-148a371b9/",
    },
  },
  {
    avatarLink: "/vidar.png",
    alt: "Portrettbilde av Vidar Sandsaunet Ulset, Gründer, psykologspesialist og førsteamanuensis ved NHI i Nabolagshelse.",
    name: "Vidar Sandsaunet Ulset",
    role: "Gründer, psykologspesialist, førsteamanuensis ved NIH",
    links: {
      linkedIn: "https://www.linkedin.com/in/vidar-ulset/",
    },
  },
  {
    avatarLink: "/nina.png",
    alt: "Portrettbilde av Nina Nordbø, Produkt designer & frontend developer i Nabolagshelse.",
    name: "Nina Nordbø",
    role: "Produkt designer & frontend developer",
    links: {
      linkedIn: "https://www.linkedin.com/in/ninanordbo/",
    },
  },
  {
    avatarLink: "/artiom.jpg",
    alt: "Portrettbilde av Artiom Gutsu, Fullstack developer i Nabolagshelse.",
    name: "Artiom Gutsu",
    role: "Fullstack developer",
    links: {
      linkedIn: "https://www.linkedin.com/in/artiom-gutu-135487235/",
    },
  },
  {
    avatarLink: "/ali-profile.jpeg",
    alt: "Portrettbilde av Ali Munir, Frontend developer i Nabolagshelse.",
    name: "Ali Munir",
    role: "Frontend developer",
    links: {
      linkedIn: "https://www.linkedin.com/in/ali14/",
    },
  },
];

// Supporters data
const supportersArray: { name: string; logo: string }[] = [
  {
    name: "Støttet av Forskningsrådet",
    logo: "/supporters/Stottet_av_Forskningsradet.png",
  },
  {
    name: "Innovasjon Norge",
    logo: "/supporters/Innovasjon.png",
  },
  {
    name: "UiO",
    logo: "/supporters/uio.png",
  },
  {
    name: "Telia Company",
    logo: "/supporters/telia.png",
  },
];

const platformBenefitsArray = [
  {
    title: "Enkel å bruke",
    mainText: "Vi gjør kompleks helsedata <br/> tilgjengelig for alle",
  },
  {
    title: "Sammenlign enkelt",
    mainText: "Se ulikheter mellom <br/> geografiske områder",
  },
  {
    title: "Spar tid",
    mainText: "Fokuser på innsikt, <br/> ikke databehandling",
  },
  {
    title: "Målrettede tiltak",
    mainText: "Finn områdene der behovet er størst",
  },
];
</script>

<style lang="scss" scoped>
.faq-item {
  min-height: 60px;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.green-circle-bg {
  background-repeat: no-repeat;
  background-clip: border-box;
  background-size: 450%;
  background-position: top 10% center;
  background-image: url("public/green-circle.svg");
}
.dotted-background-bg {
  background-repeat: no-repeat, no-repeat;
  background-clip: border-box;
  background-size:
    1200px 1200px,
    450%;
  background-position:
    center,
    top 10% center;
  background-image:
    url("public/dotted-background.svg"), url("public/green-circle.svg");
  position: relative;
}

.dotted-hero-background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60vh;
  max-height: 60vh;
  background-image: url("public/dotted-background.svg");
  background-repeat: no-repeat;
  background-position: center bottom;
  pointer-events: none;
  background-size: 1600px 1600px;
  z-index: 0;
}

.mockup-section-background {
  background-position:
    center 50%,
    top 10% center;
}

.mockup-section-background::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background-image:
    url("public/dotted-background.svg"), url("public/green-circle.svg");
  background-repeat: repeat, no-repeat;
  background-size: auto, 450%;
  background-position:
    center center,
    top 10% center;
  pointer-events: none;
  z-index: 0;
}
</style>
