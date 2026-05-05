<template>
  <!-- Backdrop -->
  <Transition name="backdrop">
    <div
      v-if="isCardEditOpen"
      class="fixed inset-0 z-40 bg-black/30"
      @click="closeCardEdit"
    />
  </Transition>

  <!-- Drawer -->
  <Transition name="drawer">
    <div
      v-if="isCardEditOpen"
      class="fixed right-0 top-0 z-50 flex h-screen shadow-2xl"
      style="width: 84%"
    >
      <!-- Left: Preview area -->
      <div ref="leftPanelRef" class="flex w-[45%] flex-col gap-3 overflow-y-auto border-r border-gray-200 bg-white p-5">

        <!-- Header -->
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">Forhåndsvisning</p>

        <!-- ① Chart card -->
        <div class="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
          <template v-if="selectedIndicator">
            <div class="border-b border-gray-100 px-4 pt-3 pb-2">
              <p class="text-sm font-semibold leading-tight text-gray-700">{{ cardTitle }}</p>
              <p class="mt-0.5 text-xs text-gray-400">{{ chartData.unit }}</p>
            </div>
            <ApexChart
              :key="chartKey"
              :width="chartWidth"
              height="200"
              :type="apexChartType"
              :options="chartOptions"
              :series="chartSeries"
            />
            <p class="px-4 pb-2 text-[10px] text-gray-300">Mockdata — ikke reelle verdier</p>
          </template>
          <template v-else>
            <div class="flex h-48 flex-col items-center justify-center gap-2">
              <LucideBarChart2 :size="36" class="text-gray-200" />
              <span class="text-xs text-gray-300">Velg en indikator for forhåndsvisning</span>
            </div>
          </template>
        </div>

        <!-- ② Controls: Visning + diagram type + måltall -->
        <div class="flex flex-col gap-2.5">
          <!-- Visning toggle -->
          <div class="flex flex-col gap-1.5">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Visning</p>
            <div class="flex rounded-lg border border-gray-200 bg-gray-100 p-0.5">
              <button
                v-for="v in visningOptions"
                :key="v.value"
                :class="[
                  'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150',
                  selectedVisning === v.value
                    ? 'bg-primary-800 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
                @click="selectedVisning = v.value"
              >
                {{ v.label }}
              </button>
            </div>
          </div>

          <!-- Diagram type icons + Måltall -->
          <div class="flex items-center justify-between gap-3">
            <div class="flex gap-1">
              <button
                v-for="dt in diagramTypes"
                :key="dt.value"
                :title="dt.label"
                :class="[
                  'flex h-8 w-8 items-center justify-center rounded-md transition-all duration-150',
                  selectedDiagramType === dt.value
                    ? 'bg-primary-800 text-white'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600',
                ]"
                @click="selectedDiagramType = dt.value"
              >
                <component :is="dt.icon" :size="14" />
              </button>
            </div>
            <div class="flex rounded-lg border border-gray-200 bg-gray-100 p-0.5">
              <button
                v-for="m in maaltallOptions"
                :key="m.value"
                :class="[
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150',
                  selectedMaaltall === m.value
                    ? 'bg-white text-gray-700 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600',
                ]"
                @click="selectedMaaltall = m.value"
              >
                {{ m.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- ③ Indicator description (replaces right-panel strip) -->
        <div v-if="selectedIndicator" class="rounded-xl border border-gray-200 bg-white p-4">
          <p class="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Indikatorbeskrivelse</p>
          <!-- Name + source row -->
          <div class="mb-2 flex items-center gap-2 flex-wrap">
            <div class="h-2.5 w-2.5 shrink-0 rounded-full bg-primary-800" />
            <span class="text-sm font-semibold text-gray-800">{{ selectedIndicator.name }}</span>
            <span class="text-xs text-gray-400">{{ indicatorMeta[selectedIndicator.id]?.source ?? 'Statistisk sentralbyrå (SSB)' }}</span>
          </div>
          <!-- Description -->
          <p class="mb-3 text-xs leading-relaxed text-gray-600">
            {{ indicatorMeta[selectedIndicator.id]?.fullDescription ?? selectedIndicator.description }}
          </p>
          <!-- Tags -->
          <div v-if="indicatorMeta[selectedIndicator.id]?.tags" class="flex flex-wrap gap-1">
            <span
              v-for="tag in indicatorMeta[selectedIndicator.id]?.tags"
              :key="tag"
              class="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500"
            >{{ tag }}</span>
          </div>
        </div>

      </div>

      <!-- Right: Config panel -->
      <div class="flex flex-1 flex-col bg-gray-50">
        <!-- Header: tabs + close -->
        <div
          class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3"
        >
          <div class="flex gap-6">
            <button
              :class="[
                'pb-1 text-sm font-medium transition-colors duration-150',
                activeTab === 'omrade'
                  ? 'border-b-2 border-primary-800 text-primary-800'
                  : 'text-gray-400 hover:text-gray-600',
              ]"
              @click="activeTab = 'omrade'"
            >
              Område
            </button>
            <button
              :class="[
                'pb-1 text-sm font-medium transition-colors duration-150',
                activeTab === 'indikator'
                  ? 'border-b-2 border-primary-800 text-primary-800'
                  : 'text-gray-400 hover:text-gray-600',
              ]"
              @click="activeTab = 'indikator'"
            >
              Indikator
              <span
                v-if="selectedIndicator"
                class="ml-1.5 rounded-full bg-primary-800 px-1.5 py-0.5 text-[10px] text-white"
              >1</span>
            </button>
          </div>

          <button
            class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            @click="closeCardEdit"
          >
            <LucideX :size="20" />
          </button>
        </div>

        <!-- ── OMRÅDE TAB ── -->
        <div v-if="activeTab === 'omrade'" class="flex flex-1 flex-col overflow-hidden">

          <!-- Geo level — full-width segmented control, no wasted space -->
          <div class="flex shrink-0 border-b border-gray-200 bg-white">
            <button
              v-for="level in geoLevels"
              :key="level.value"
              :class="[
                'flex flex-1 items-center justify-center py-3 text-xs font-medium transition-all duration-150 border-b-2',
                selectedGeoLevel === level.value
                  ? 'border-primary-800 text-primary-800 bg-primary-800/5'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50',
              ]"
              @click="selectGeoLevel(level.value)"
            >
              {{ level.label }}
            </button>
          </div>

          <!-- Hele landet -->
          <div v-if="selectedGeoLevel === 'hele-landet'" class="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <LucideGlobe2 :size="40" class="text-gray-200" />
            <p class="text-sm font-medium text-gray-500">Hele landet er valgt</p>
            <p class="text-xs text-gray-400">Dataene vises aggregert for hele Norge</p>
          </div>

          <!-- Specific level: map + comparisons + search + list -->
          <template v-else>
            <!-- Map — edge-to-edge at top -->
            <DashboardDrawerMapPicker
              :geo-level="selectedGeoLevel"
              :selected-area-id="selectedArea?.id ?? null"
              class="shrink-0 rounded-none border-x-0 border-t-0"
              style="height: 260px"
              @select="selectedArea = $event"
            />

            <!-- Sammenligningsområde — directly under the map -->
            <div class="shrink-0 border-b border-gray-200 bg-white">
              <!-- Section header -->
              <div class="flex items-center justify-between px-5 pt-3 pb-2">
                <p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Sammenligningsområde</p>
                <span v-if="comparisonAreas.length >= 5" class="text-[10px] text-gray-300">Maks 5 nådd</span>
              </div>

              <!-- Added comparison rows -->
              <div v-if="comparisonAreas.length > 0" class="space-y-1 px-5 pb-2">
                <div
                  v-for="(comp, i) in comparisonAreas"
                  :key="comp.id"
                  class="flex items-center gap-2.5 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                >
                  <div
                    class="h-2.5 w-2.5 shrink-0 rounded-full"
                    :style="{ backgroundColor: COMPARISON_COLORS[i] }"
                  />
                  <div class="flex min-w-0 flex-1 flex-col">
                    <span class="truncate text-sm font-medium text-gray-700">{{ comp.label }}</span>
                    <span class="text-[10px] text-gray-400">{{ getLevelLabel(comp.geoLevel) }}</span>
                  </div>
                  <button
                    class="shrink-0 text-gray-300 transition-colors hover:text-red-400"
                    @click="removeComparison(comp.id)"
                  >
                    <LucideX :size="13" />
                  </button>
                </div>
              </div>

              <!-- Add button + inline picker -->
              <div class="px-5 pb-3">
                <button
                  v-if="comparisonAreas.length < 5"
                  :class="[
                    'flex w-full items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-xs font-medium transition-colors',
                    showAddComparison
                      ? 'border-primary-800 text-primary-800'
                      : 'border-gray-200 text-gray-400 hover:border-primary-800 hover:text-primary-800',
                  ]"
                  @click="showAddComparison = !showAddComparison"
                >
                  <LucidePlus :size="13" />
                  Legg til sammenligningsområde
                </button>

                <!-- Inline picker -->
                <div v-if="showAddComparison" class="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <!-- Geo level pills -->
                  <div class="flex flex-wrap gap-1.5 border-b border-gray-100 p-3">
                    <button
                      v-for="level in geoLevels"
                      :key="level.value"
                      :class="[
                        'rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors',
                        selectedComparisonLevel === level.value
                          ? 'bg-primary-800 text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
                      ]"
                      @click="selectedComparisonLevel = level.value; comparisonSearch = ''"
                    >
                      {{ level.label }}
                    </button>
                  </div>

                  <!-- Search -->
                  <div class="relative border-b border-gray-100 p-2">
                    <LucideSearch :size="12" class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      v-model="comparisonSearch"
                      type="text"
                      placeholder="Søk..."
                      class="w-full rounded-md border border-gray-200 bg-gray-50 py-1.5 pl-7 pr-3 text-xs text-gray-700 placeholder-gray-300 outline-none focus:border-primary-800"
                    />
                  </div>

                  <!-- Area list -->
                  <div class="max-h-36 overflow-y-auto">
                    <button
                      v-for="area in filteredComparisonAreas"
                      :key="area.id"
                      class="flex w-full items-center gap-2 border-b border-gray-50 px-4 py-2 text-left text-xs text-gray-600 last:border-b-0 hover:bg-gray-50"
                      @click="addComparison(area)"
                    >
                      <LucidePlus :size="11" class="shrink-0 text-gray-300" />
                      {{ area.label }}
                    </button>
                    <div v-if="filteredComparisonAreas.length === 0" class="py-4 text-center text-xs text-gray-300">
                      Ingen tilgjengelige områder
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Search + selected chip row -->
            <div class="shrink-0 border-b border-gray-200 bg-white px-5 py-3">
              <div class="flex items-center gap-2">
                <div class="relative flex-1">
                  <LucideSearch :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    v-model="areaSearch"
                    type="text"
                    :placeholder="`Søk ${geoLevels.find(l => l.value === selectedGeoLevel)?.label?.toLowerCase() ?? 'sted'}...`"
                    class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-4 text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-primary-800 focus:ring-1 focus:ring-primary-800"
                  />
                </div>
                <!-- Selected chip inline -->
                <transition name="chip">
                  <span
                    v-if="selectedArea"
                    class="flex shrink-0 items-center gap-1.5 rounded-full bg-primary-800 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    {{ selectedArea.label }}
                    <button class="ml-0.5 opacity-70 hover:opacity-100" @click="selectedArea = null">
                      <LucideX :size="11" />
                    </button>
                  </span>
                </transition>
              </div>
            </div>

            <!-- Area list — fills all remaining space -->
            <div class="flex-1 overflow-y-auto bg-white">
              <button
                v-for="area in filteredAreas"
                :key="area.id"
                :class="[
                  'flex w-full items-center justify-between border-b border-gray-100 px-5 py-2.5 text-left text-sm transition-colors duration-100 last:border-b-0',
                  selectedArea?.id === area.id
                    ? 'bg-primary-800/5 font-medium text-primary-800'
                    : 'text-gray-600 hover:bg-gray-50',
                ]"
                @click="selectedArea = area"
              >
                <span>{{ area.label }}</span>
                <LucideCheck v-if="selectedArea?.id === area.id" :size="14" class="text-primary-800" />
              </button>
              <div v-if="filteredAreas.length === 0" class="py-8 text-center text-sm text-gray-300">
                Ingen treff for «{{ areaSearch }}»
              </div>
            </div>
          </template>
        </div>

        <!-- ── INDIKATOR TAB ── -->
        <div v-if="activeTab === 'indikator'" class="flex flex-1 flex-col overflow-hidden">

          <!-- ① Search + Filter (sticky) -->
          <div class="shrink-0 border-b border-gray-200 bg-white px-6 py-3">
            <div class="flex gap-2">
              <div class="relative flex-1">
                <LucideSearch :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  v-model="indicatorSearch"
                  type="text"
                  placeholder="Søk indikator..."
                  class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-primary-800 focus:ring-1 focus:ring-primary-800"
                />
              </div>
              <button
                :class="[
                  'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-150',
                  showFilterPanel
                    ? 'border-primary-800 bg-primary-800 text-white'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700',
                ]"
                @click="showFilterPanel = !showFilterPanel"
              >
                <LucideSlidersHorizontal :size="14" />
                Filter
                <span
                  v-if="activeFilterCount > 0"
                  class="ml-0.5 rounded-full px-1.5 text-[10px] font-semibold"
                  :class="showFilterPanel ? 'bg-white/25 text-white' : 'bg-primary-800/10 text-primary-800'"
                >{{ activeFilterCount }}</span>
              </button>
            </div>

            <!-- Filter panel (inline dropdown) -->
            <div v-if="showFilterPanel" class="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <p class="text-sm font-semibold text-gray-700">Filtrer indikatorer</p>
                <button v-if="activeFilterCount > 0" class="text-xs text-gray-400 hover:text-red-400" @click="clearFilters">Nullstill</button>
              </div>
              <div class="grid grid-cols-3 divide-x divide-gray-100">
                <!-- Kategori -->
                <div class="px-4 py-3">
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Kategori</p>
                  <div class="space-y-1.5">
                    <label v-for="cat in categories" :key="cat.id" class="flex cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 hover:bg-gray-50">
                      <input type="checkbox" :checked="filterCategories.has(cat.id)" class="h-3.5 w-3.5 rounded border-gray-300 accent-primary-800" @change="toggleFilterCategory(cat.id)" />
                      <span class="text-sm text-gray-600">{{ cat.label }}</span>
                    </label>
                  </div>
                </div>
                <!-- Visualisering -->
                <div class="px-4 py-3">
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Visualisering</p>
                  <div class="space-y-1.5">
                    <label v-for="v in visningOptions" :key="v.value" class="flex cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 hover:bg-gray-50">
                      <input type="checkbox" :checked="filterVisualisering.has(v.value)" class="h-3.5 w-3.5 rounded border-gray-300 accent-primary-800" @change="toggleFilterVisualisering(v.value)" />
                      <span class="text-sm text-gray-600">{{ v.label }}</span>
                    </label>
                  </div>
                </div>
                <!-- Geografisk nivå -->
                <div class="px-4 py-3">
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Geografisk nivå</p>
                  <div class="space-y-1.5">
                    <label v-for="level in geoLevels" :key="level.value" class="flex cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 hover:bg-gray-50">
                      <input type="checkbox" :checked="filterGeoLevels.has(level.value)" class="h-3.5 w-3.5 rounded border-gray-300 accent-primary-800" @change="toggleFilterGeoLevel(level.value)" />
                      <span class="text-sm text-gray-600">{{ level.label }}</span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                <p class="text-xs text-gray-400">
                  {{ activeFilterCount === 0 ? 'Ingen filtre valgt' : activeFilterCount + ' filter' + (activeFilterCount > 1 ? 'e' : '') + ' valgt' }}
                </p>
                <button class="rounded-lg bg-primary-800 px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90" @click="showFilterPanel = false">
                  Bruk filter
                </button>
              </div>
            </div>

            <p v-if="!showFilterPanel" class="mt-2 text-xs text-gray-400">
              Viser {{ filteredCategories.reduce((n, c) => n + c.indicators.length, 0) }}
              <template v-if="activeFilterCount > 0"> av {{ categories.reduce((n, c) => n + c.indicators.length, 0) }}</template>
              indikatorer
            </p>
          </div>

          <!-- ② Indicator list — single column, full width -->
          <div class="flex-1 overflow-y-auto">
            <div
              v-for="category in filteredCategories"
              :key="category.id"
              class="border-b border-gray-100 last:border-b-0"
            >
              <!-- Category header -->
              <button
                class="flex w-full items-center justify-between bg-white px-5 py-3 text-left transition-colors duration-100 hover:bg-gray-50"
                @click="toggleCategory(category.id)"
              >
                <div class="flex items-center gap-2.5">
                  <component :is="category.icon" :size="15" class="text-gray-400 shrink-0" />
                  <span class="text-sm font-semibold text-gray-700">{{ category.label }}</span>
                  <span class="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-400">{{ category.indicators.length }}</span>
                </div>
                <LucideChevronDown
                  :size="14"
                  :class="['shrink-0 text-gray-400 transition-transform duration-200', openCategories.has(category.id) ? 'rotate-180' : '']"
                />
              </button>

              <!-- Indicator rows — full width, single column -->
              <div v-if="openCategories.has(category.id)">
                <button
                  v-for="ind in category.indicators"
                  :key="ind.id"
                  :class="[
                    'flex w-full items-center gap-3 border-t border-gray-100 px-5 py-2.5 text-left transition-colors duration-100',
                    selectedIndicator?.id === ind.id
                      ? 'bg-primary-800/[0.04]'
                      : 'bg-white hover:bg-gray-50',
                  ]"
                  @click="selectIndicator(ind)"
                >
                  <!-- Radio -->
                  <div
                    :class="[
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150',
                      selectedIndicator?.id === ind.id
                        ? 'border-primary-800 bg-primary-800'
                        : 'border-gray-300 bg-white',
                    ]"
                  >
                    <div v-if="selectedIndicator?.id === ind.id" class="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                  <span :class="['text-sm', selectedIndicator?.id === ind.id ? 'font-medium text-primary-800' : 'text-gray-700']">
                    {{ ind.name }}
                  </span>
                </button>
              </div>
            </div>

            <div v-if="filteredCategories.length === 0" class="py-12 text-center text-sm text-gray-300">
              Ingen indikatorer funnet
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
          <p v-if="selectedIndicator || selectedArea" class="text-xs text-gray-400">
            <span v-if="selectedIndicator">{{ selectedIndicator.name }}</span>
            <span v-if="selectedIndicator && selectedArea"> · </span>
            <span v-if="selectedArea">{{ selectedArea.label }}</span>
          </p>
          <p v-else class="text-xs text-gray-300">Ingen indikator valgt</p>
          <button
            :class="[
              'rounded-lg px-6 py-2 text-sm font-medium transition-all duration-200',
              selectedIndicator
                ? 'bg-primary-800 text-white hover:-translate-y-0.5 hover:opacity-90'
                : 'cursor-not-allowed bg-gray-200 text-gray-400',
            ]"
            :disabled="!selectedIndicator"
            @click="handleAddCard"
          >
            + Legg til kort
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const { isCardEditOpen } = storeToRefs(useCreateCard())
const { closeCardEdit } = useCreateCard()

// ── ALL REFS DECLARED FIRST so the watch callback can reference them ──
const activeTab = ref<'omrade' | 'indikator'>('omrade')

// Left panel DOM ref + measured pixel width for ApexCharts
const leftPanelRef = ref<HTMLElement | null>(null)
const chartWidth = ref(380)

// Visning + diagram + måltall
const selectedVisning = ref('hovedomrade')
const selectedDiagramType = ref('bar')
const selectedMaaltall = ref('antall')

// Område
const selectedGeoLevel = ref('kommune')
const areaSearch = ref('')
interface Area { id: string; label: string }
const selectedArea = ref<Area | null>(null)

// Indikator
interface Indicator { id: string; name: string; description: string }
const indicatorSearch = ref('')
const selectedIndicator = ref<Indicator | null>(null)
const openCategories = ref<Set<string>>(new Set())

// Filter panel
const showFilterPanel = ref(false)
const filterCategories = ref<Set<string>>(new Set())
const filterVisualisering = ref<Set<string>>(new Set())
const filterGeoLevels = ref<Set<string>>(new Set())
const activeFilterCount = computed(
  () => filterCategories.value.size + filterVisualisering.value.size + filterGeoLevels.value.size,
)

function toggleSet(set: Set<string>, id: string): Set<string> {
  const s = new Set(set)
  if (s.has(id)) { s.delete(id) } else { s.add(id) }
  return s
}
function toggleFilterCategory(id: string) {
  filterCategories.value = toggleSet(filterCategories.value, id)
}
function toggleFilterVisualisering(v: string) {
  filterVisualisering.value = toggleSet(filterVisualisering.value, v)
}
function toggleFilterGeoLevel(v: string) {
  filterGeoLevels.value = toggleSet(filterGeoLevels.value, v)
}
function clearFilters() {
  filterCategories.value = new Set()
  filterVisualisering.value = new Set()
  filterGeoLevels.value = new Set()
}

const DEFAULT_INDICATOR: Indicator = { id: 'innbyggere', name: 'Antall innbyggere', description: 'Totalt antall innbyggere i området' }

watch(isCardEditOpen, (open) => {
  if (open) {
    activeTab.value = 'omrade'
    selectedGeoLevel.value = 'kommune'
    selectedArea.value = null
    areaSearch.value = ''
    indicatorSearch.value = ''
    openCategories.value = new Set()
    showFilterPanel.value = false
    filterCategories.value = new Set()
    filterVisualisering.value = new Set()
    filterGeoLevels.value = new Set()
    comparisonAreas.value = [{ ...DEFAULT_COMPARISON }]
    showAddComparison.value = false
    comparisonSearch.value = ''
    selectedComparisonLevel.value = 'hele-landet'
    // Default to first Befolkning indicator so the preview is never empty
    selectedIndicator.value = { ...DEFAULT_INDICATOR }
    // Measure the left panel's actual rendered width (getBoundingClientRect
    // works correctly even in scaled iframe preview environments)
    nextTick(() => {
      const w = leftPanelRef.value?.getBoundingClientRect().width ?? 380
      chartWidth.value = Math.max(w - 40, 100)
    })
  }
}, { immediate: true })

// ── VISNING ──
const visningOptions = [
  { value: 'hovedomrade', label: 'Hovedområde' },
  { value: 'sammenligning', label: 'Underområder' },
]

// ── DIAGRAM TYPES — icons match the data explorer toolbar ──
const diagramTypes = [
  { value: 'bar',        label: 'Stolpe',     icon: 'LucideBarChart2' },
  { value: 'line',       label: 'Linje',      icon: 'LucideLineChart' },
  { value: 'pie',        label: 'Kake',       icon: 'LucidePieChart' },
  { value: 'keynumbers', label: 'Nøkkeltall', icon: 'LucideLayoutGrid' },
]

// ── MÅLTALL ──
const maaltallOptions = [
  { value: 'antall', label: 'Antall' },
  { value: 'prosent', label: 'Prosent' },
]

// ── OMRÅDE ──
const geoLevels = [
  { value: 'hele-landet', label: 'Hele landet' },
  { value: 'fylke',       label: 'Fylke' },
  { value: 'kommune',     label: 'Kommune' },
  { value: 'levekaar',    label: 'Levekårssone' },
  { value: 'grunnkrets',  label: 'Grunnkrets' },
]
const areaMock: Record<string, Area[]> = {
  fylke: [
    { id: 'f03', label: 'Innlandet' },
    { id: 'f11', label: 'Rogaland' },
    { id: 'f15', label: 'Møre og Romsdal' },
    { id: 'f18', label: 'Nordland' },
    { id: 'f38', label: 'Telemark' },
    { id: 'f42', label: 'Agder' },
    { id: 'f50', label: 'Trøndelag' },
    { id: 'f54', label: 'Troms og Finnmark' },
    { id: 'f30', label: 'Viken' },
    { id: 'f34', label: 'Innlandet' },
    { id: 'f01', label: 'Oslo' },
  ],
  kommune: [
    { id: 'k0301', label: 'Oslo' },
    { id: 'k1001', label: 'Kristiansand' },
    { id: 'k1103', label: 'Stavanger' },
    { id: 'k1201', label: 'Bergen' },
    { id: 'k1505', label: 'Kristiansund' },
    { id: 'k1507', label: 'Ålesund' },
    { id: 'k1804', label: 'Bodø' },
    { id: 'k4204', label: 'Lindesnes' },
    { id: 'k5001', label: 'Trondheim' },
    { id: 'k5401', label: 'Tromsø' },
    { id: 'k3201', label: 'Kongsvinger' },
    { id: 'k3205', label: 'Lillehammer' },
    { id: 'k0602', label: 'Drammen' },
    { id: 'k0605', label: 'Ringerike' },
  ],
  levekaar: [
    // Oslo — levekårssoner (~1 500 innb. hver)
    { id: 'lk-osl-01', label: 'Grünerløkka' },
    { id: 'lk-osl-02', label: 'Tøyen' },
    { id: 'lk-osl-03', label: 'Sagene' },
    { id: 'lk-osl-04', label: 'Torshov' },
    { id: 'lk-osl-05', label: 'Sinsen' },
    { id: 'lk-osl-06', label: 'Frogner' },
    { id: 'lk-osl-07', label: 'Majorstuen' },
    { id: 'lk-osl-08', label: 'Bislett' },
    { id: 'lk-osl-09', label: 'Gamlebyen' },
    { id: 'lk-osl-10', label: 'Grønland' },
    // Lindesnes — levekårssoner
    { id: 'lk-lin-01', label: 'Mandal sentrum' },
    { id: 'lk-lin-02', label: 'Mandal vest' },
    { id: 'lk-lin-03', label: 'Vigeland' },
    { id: 'lk-lin-04', label: 'Spangereid' },
    { id: 'lk-lin-05', label: 'Lohne' },
    { id: 'lk-lin-06', label: 'Øyslebø' },
    { id: 'lk-lin-07', label: 'Holum' },
    { id: 'lk-lin-08', label: 'Bjelland' },
  ],
  grunnkrets: [
    // Grunnkrets er SSBs minste geografiske enhet — typisk noen hundre innbyggere
    { id: 'gk-0301-0101', label: '0101 Kvadraturen' },
    { id: 'gk-0301-0102', label: '0102 Pipervika' },
    { id: 'gk-0301-0201', label: '0201 Grønland øst' },
    { id: 'gk-0301-0202', label: '0202 Grønland vest' },
    { id: 'gk-0301-0301', label: '0301 Tøyen nord' },
    { id: 'gk-0301-0302', label: '0302 Tøyen sør' },
    { id: 'gk-0301-0401', label: '0401 Kampen' },
    { id: 'gk-0301-0402', label: '0402 Vålerenga' },
    { id: 'gk-0301-0501', label: '0501 Bjølsen' },
    { id: 'gk-0301-0502', label: '0502 Sandaker' },
    { id: 'gk-0301-0601', label: '0601 Storo' },
    { id: 'gk-0301-0602', label: '0602 Nydalen' },
    { id: 'gk-0301-0701', label: '0701 Uranienborg' },
    { id: 'gk-0301-0702', label: '0702 Skillebekk' },
    { id: 'gk-4204-0101', label: '0101 Mandal sentrum' },
    { id: 'gk-4204-0102', label: '0102 Ime' },
    { id: 'gk-4204-0201', label: '0201 Malmø' },
    { id: 'gk-4204-0202', label: '0202 Hestehagen' },
  ],
}

const filteredAreas = computed(() => {
  const list = areaMock[selectedGeoLevel.value] ?? []
  if (!areaSearch.value) return list
  return list.filter((a) =>
    a.label.toLowerCase().includes(areaSearch.value.toLowerCase()),
  )
})

function selectGeoLevel(level: string) {
  selectedGeoLevel.value = level
  selectedArea.value = null
  areaSearch.value = ''
}

// ── COMPARISON AREAS ──
interface ComparisonArea { id: string; label: string; geoLevel: string }
const DEFAULT_COMPARISON: ComparisonArea = { id: 'hele-landet', label: 'Norge', geoLevel: 'hele-landet' }
const comparisonAreas = ref<ComparisonArea[]>([{ ...DEFAULT_COMPARISON }])
const showAddComparison = ref(false)
const comparisonSearch = ref('')
const selectedComparisonLevel = ref('hele-landet')

// Palette for comparison series (index 0 = first comparison)
const COMPARISON_COLORS = ['#88b56b', '#6b9e7e', '#4a7a5a', '#a0c890', '#2a4a3a']

function getLevelLabel(level: string): string {
  return geoLevels.find(l => l.value === level)?.label ?? level
}

// Deterministic per-area offset so mock comparison data is stable across renders
function deterministicFactor(seed: string, index: number): number {
  let h = (index + 1) * 997
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) & 0xffff
  return 0.84 + (h % 320) / 1000   // range 0.84–1.16
}

const filteredComparisonAreas = computed(() => {
  const pool: Area[] =
    selectedComparisonLevel.value === 'hele-landet'
      ? [{ id: 'hele-landet', label: 'Norge' }]
      : (areaMock[selectedComparisonLevel.value] ?? [])
  const already = new Set(comparisonAreas.value.map((c) => c.id))
  const q = comparisonSearch.value.toLowerCase()
  return pool
    .filter((a) => !already.has(a.id))
    .filter((a) => !q || a.label.toLowerCase().includes(q))
})

function addComparison(area: Area) {
  if (comparisonAreas.value.length >= 5) return
  comparisonAreas.value.push({ id: area.id, label: area.label, geoLevel: selectedComparisonLevel.value })
  showAddComparison.value = false
  comparisonSearch.value = ''
}

function removeComparison(id: string) {
  comparisonAreas.value = comparisonAreas.value.filter((c) => c.id !== id)
}

// Dynamic card title: "Aldersfordeling i Agder fylke"
const cardTitle = computed(() => {
  if (!selectedIndicator.value) return ''
  if (selectedGeoLevel.value === 'hele-landet' || !selectedArea.value) {
    return `${selectedIndicator.value.name} for hele landet`
  }
  const lvl = geoLevels.find((l) => l.value === selectedGeoLevel.value)?.label?.toLowerCase() ?? ''
  return `${selectedIndicator.value.name} i ${selectedArea.value.label} ${lvl}`
})

// ── INDIKATOR ──
interface Category { id: string; label: string; icon: string; indicators: Indicator[] }

const categories: Category[] = [
  {
    id: 'befolkning',
    label: 'Befolkning',
    icon: 'LucideUsers',
    indicators: [
      { id: 'innbyggere', name: 'Antall innbyggere', description: 'Totalt antall innbyggere i området' },
      { id: 'befolkningsvekst', name: 'Befolkningsvekst', description: 'Prosentvis endring i befolkningen siste år' },
      { id: 'aldersfordeling', name: 'Aldersfordeling', description: 'Fordeling av befolkningen etter aldersgruppe' },
      { id: 'innvandrere', name: 'Andel innvandrere', description: 'Andel innvandrere og norskfødte med innvandrerforeldre' },
    ],
  },
  {
    id: 'helse',
    label: 'Helse',
    icon: 'LucideHeart',
    indicators: [
      { id: 'forventet-levealder', name: 'Forventet levealder', description: 'Gjennomsnittlig forventet levealder ved fødsel' },
      { id: 'psykisk-helse', name: 'Psykisk helse', description: 'Andel med psykiske lidelser registrert hos fastlege' },
      { id: 'overvekt', name: 'Overvekt og fedme', description: 'Andel voksne med BMI over 25' },
      { id: 'roykere', name: 'Andel røykere', description: 'Andel dagligrøykere blant voksne' },
    ],
  },
  {
    id: 'oppvekst',
    label: 'Oppvekst og utdanning',
    icon: 'LucideGraduationCap',
    indicators: [
      { id: 'barnehagedekning', name: 'Barnehagedekning', description: 'Andel barn 1–5 år med barnehageplass' },
      { id: 'grunnskolepoeng', name: 'Grunnskolepoeng', description: 'Gjennomsnittlige grunnskolepoeng ved avsluttet 10. trinn' },
      { id: 'fullfort-vgs', name: 'Fullført videregående', description: 'Andel som fullfører videregående opplæring innen 5 år' },
      { id: 'hoyere-utdanning', name: 'Høyere utdanning', description: 'Andel med høyere utdanning i befolkningen' },
    ],
  },
  {
    id: 'arbeidsliv',
    label: 'Arbeidsliv og stønader',
    icon: 'LucideBriefcase',
    indicators: [
      { id: 'arbeidsledighet', name: 'Arbeidsledighet', description: 'Andel arbeidsledige av arbeidsstyrken' },
      { id: 'uforetrygd', name: 'Uføretrygd', description: 'Andel uføretrygdede i yrkesaktiv alder' },
      { id: 'sosialhjelp', name: 'Sosialhjelp', description: 'Andel som mottar sosialhjelp' },
      { id: 'sykefravær', name: 'Sykefravær', description: 'Gjennomsnittlig sykefraværsprosent' },
    ],
  },
  {
    id: 'okonomi',
    label: 'Økonomi',
    icon: 'LucideTrendingUp',
    indicators: [
      { id: 'medianinntekt', name: 'Medianinntekt', description: 'Medianinntekt for husholdninger etter skatt' },
      { id: 'lavinntekt', name: 'Lavinntekt', description: 'Andel husholdninger med inntekt under 60 % av medianinntekten' },
      { id: 'gjeld', name: 'Gjeld per innbygger', description: 'Gjennomsnittlig gjeld per innbygger' },
    ],
  },
  {
    id: 'bolig',
    label: 'Bolig',
    icon: 'LucideHome',
    indicators: [
      { id: 'boligpris', name: 'Boligpriser', description: 'Gjennomsnittlig kvadratmeterpris for boliger' },
      { id: 'boligtype', name: 'Boligtype', description: 'Fordeling av boligtyper (enebolig, leilighet, rekkehus)' },
      { id: 'leietakere', name: 'Andel leietakere', description: 'Andel husholdninger som leier bolig' },
    ],
  },
  {
    id: 'geografi',
    label: 'Geografi',
    icon: 'LucideMapPin',
    indicators: [
      { id: 'areal', name: 'Areal', description: 'Totalt areal i kvadratkilometer' },
      { id: 'befolkningstetthet', name: 'Befolkningstetthet', description: 'Antall innbyggere per kvadratkilometer' },
      { id: 'boligpris', name: 'Boligpriser', description: 'Gjennomsnittlig kvadratmeterpris for boliger' },
    ],
  },
]

const filteredCategories = computed(() => {
  const q = indicatorSearch.value.toLowerCase()
  const activeCatFilter = filterCategories.value

  return categories
    .filter((cat) => activeCatFilter.size === 0 || activeCatFilter.has(cat.id))
    .map((cat) => ({
      ...cat,
      indicators: q
        ? cat.indicators.filter(
            (ind) =>
              ind.name.toLowerCase().includes(q) ||
              ind.description.toLowerCase().includes(q),
          )
        : cat.indicators,
    }))
    .filter((cat) => cat.indicators.length > 0)
})

function toggleCategory(id: string) {
  openCategories.value = toggleSet(openCategories.value, id)
}

function selectIndicator(ind: Indicator) {
  selectedIndicator.value = selectedIndicator.value?.id === ind.id ? null : ind
}

// ── INDICATOR META — rich descriptions shown in the side panel ──
interface IndicatorMeta { fullDescription: string; source: string; date: string; tags?: string[] }
const indicatorMeta: Record<string, IndicatorMeta> = {
  innbyggere: {
    fullDescription: 'Totalt antall registrerte innbyggere i området per 1. januar hvert år. Tallene hentes fra Folkeregisteret via SSB og inkluderer alle bosatte, uavhengig av statsborgerskap.',
    source: 'Statistisk sentralbyrå (SSB)',
    date: '01.01.2024',
    tags: ['Folkemengde', 'Bostedsregistrert'],
  },
  befolkningsvekst: {
    fullDescription: 'Prosentvis endring i folkemengden fra 1. januar foregående år til 1. januar gjeldende år. Inkluderer fødselsoverskudd og nettoinnflytting.',
    source: 'Statistisk sentralbyrå (SSB)',
    date: '01.01.2024',
    tags: ['Vekst', 'Nettoinnflytting', 'Fødselsoverskudd'],
  },
  aldersfordeling: {
    fullDescription: 'Befolkningens fordeling på fem brede aldersgrupper. Beregnes som andel av total folkemengde. Gir innsikt i områdets demografiske struktur og tjenestebehovet fremover.',
    source: 'Statistisk sentralbyrå (SSB)',
    date: '01.01.2024',
    tags: ['Aldersgrupper', 'Demografi'],
  },
  innvandrere: {
    fullDescription: 'Andel innvandrere og norskfødte med to innvandrerforeldre av totalbefolkningen. Definisjonene følger SSBs standard for innvandrerbefolkningen.',
    source: 'Statistisk sentralbyrå (SSB)',
    date: '01.01.2024',
    tags: ['Innvandring', 'Norskfødte'],
  },
  'forventet-levealder': {
    fullDescription: 'Forventet gjenstående levetid ved fødsel, beregnet som et gjennomsnitt for begge kjønn. Basert på aldersspesifikke dødsrater i perioden. Et høyt tall indikerer god folkehelse.',
    source: 'Folkehelseinstituttet (FHI)',
    date: '31.12.2023',
    tags: ['Levealder', 'Dødelighet'],
  },
  'psykisk-helse': {
    fullDescription: 'Andel av befolkningen 18 år og eldre som er registrert med en psykisk lidelse (F-diagnoser) hos fastlege eller i spesialisthelsetjenesten siste 12 måneder.',
    source: 'Folkehelseinstituttet (FHI)',
    date: '31.12.2023',
    tags: ['Psykiatri', 'Fastlege', 'Spesialist'],
  },
  overvekt: {
    fullDescription: 'Andel voksne (18 år og eldre) med KMI (kroppsmasseindeks) ≥ 25, basert på selvrapporterte høyde- og vektmålinger fra helseundersøkelser.',
    source: 'Folkehelseinstituttet (FHI)',
    date: '31.12.2022',
    tags: ['KMI', 'Livsstil', 'Kosthold'],
  },
  roykere: {
    fullDescription: 'Andel dagligrøykere blant voksne 16–74 år, basert på levekårsundersøkelsen. Tallet viser en klar nedadgående trend og brukes som indikator på tobakksrelatert sykdomsrisiko.',
    source: 'Statistisk sentralbyrå (SSB)',
    date: '31.12.2023',
    tags: ['Tobakk', 'Livsstil'],
  },
  barnehagedekning: {
    fullDescription: 'Andel barn 1–5 år med barnehageplass. Beregnes som antall barn i barnehage delt på antall bosatte barn i aldersgruppen per 15. desember.',
    source: 'Utdanningsdirektoratet (Udir)',
    date: '15.12.2023',
    tags: ['Barnehage', 'Oppvekst'],
  },
  grunnskolepoeng: {
    fullDescription: 'Gjennomsnittlig karakterpoeng fra 10. trinn, inkl. standpunkt- og eksamenskarakterer. Maks 60 poeng. Brukes som mål på læringsutbytte og sosial reproduksjon.',
    source: 'Utdanningsdirektoratet (Udir)',
    date: '31.07.2023',
    tags: ['Karakterer', 'Ungdom', 'Læringsutbytte'],
  },
  'fullfort-vgs': {
    fullDescription: 'Andel elever som fullfører og består videregående opplæring innen fem år etter påbegynt Vg1. Inkluderer alle utdanningsprogrammer.',
    source: 'Statistisk sentralbyrå (SSB)',
    date: '31.08.2023',
    tags: ['Videregående', 'Frafall', 'Kompetanse'],
  },
  'hoyere-utdanning': {
    fullDescription: 'Andel av befolkningen 25 år og eldre med fullført høyere utdanning (bachelor eller høyere). Korrelerer med inntektsnivå og helseadferd.',
    source: 'Statistisk sentralbyrå (SSB)',
    date: '01.10.2023',
    tags: ['Universitet', 'Høyskole', 'Kompetansenivå'],
  },
  arbeidsledighet: {
    fullDescription: 'Registrert arbeidsledighet som andel av arbeidsstyrken, inkl. deltakere på arbeidsmarkedstiltak. Kilde er NAVs registre.',
    source: 'NAV',
    date: '31.12.2023',
    tags: ['Sysselsetting', 'NAV'],
  },
  uforetrygd: {
    fullDescription: 'Andel mottakere av uføretrygd i aldersgruppen 18–66 år. Inkluderer kun personer med vedtak om varig uføretrygd fra NAV.',
    source: 'NAV',
    date: '31.12.2023',
    tags: ['Trygd', 'Arbeidsevne'],
  },
  sosialhjelp: {
    fullDescription: 'Andel av befolkningen 18 år og eldre som mottar økonomisk sosialhjelp i løpet av et kalenderår. Indikerer lavinntektsproblematikk i befolkingen.',
    source: 'Statistisk sentralbyrå (SSB)',
    date: '31.12.2023',
    tags: ['Lavinntekt', 'Stønad'],
  },
  'sykefravær': {
    fullDescription: 'Gjennomsnittlig legemeldt sykefraværsprosent for sysselsatte. Beregnes som tapte dagsverk i prosent av avtalte dagsverk. Sesongkorrigert for Q4.',
    source: 'NAV / Statistisk sentralbyrå (SSB)',
    date: '31.12.2023',
    tags: ['Arbeidsmiljø', 'Legemeldt'],
  },
  medianinntekt: {
    fullDescription: 'Medianinntekt etter skatt for alle husholdninger. Beløpet er i nominelle kroner og er ikke justert for husholdningsstørrelse (ekvivalert inntekt).',
    source: 'Statistisk sentralbyrå (SSB)',
    date: '31.12.2022',
    tags: ['Inntekt', 'Husholdning', 'Skatt'],
  },
  lavinntekt: {
    fullDescription: 'Andel husholdninger med inntekt under 60 % av nasjonal medianinntekt, EU-skalaen. Barn i lavinntektshusholdninger er inkludert i beregningen.',
    source: 'Statistisk sentralbyrå (SSB)',
    date: '31.12.2022',
    tags: ['Fattigdom', 'Lavinntektsgrense'],
  },
  gjeld: {
    fullDescription: 'Gjennomsnittlig samlet gjeld per innbygger, alle aldre inkludert. Inkluderer boliglån, studielån og forbruksgjeld registrert i likningsdata.',
    source: 'Statistisk sentralbyrå (SSB)',
    date: '31.12.2022',
    tags: ['Boliglån', 'Gjeldsgrad'],
  },
  boligpris: {
    fullDescription: 'Gjennomsnittlig kvadratmeterpris for omsatte boliger, alle boligtyper. Beregnet fra omsetninger registrert i Eiendomsverdi AS og Finn.no.',
    source: 'Eiendomsverdi AS / Statistisk sentralbyrå (SSB)',
    date: '31.12.2023',
    tags: ['Kvadratmeterpris', 'Eiendom'],
  },
  boligtype: {
    fullDescription: 'Fordeling av bebodde boliger etter bygningstype: enebolig, rekkehus/tomannsbolig og leilighet. Basert på matrikkelen per 1. januar.',
    source: 'Statistisk sentralbyrå (SSB)',
    date: '01.01.2024',
    tags: ['Enebolig', 'Leilighet', 'Bygningstype'],
  },
  leietakere: {
    fullDescription: 'Andel husholdninger som leier bolig (ikke eierbolig). Basert på folke- og boligtellingen og løpende oppdaterte registerdata.',
    source: 'Statistisk sentralbyrå (SSB)',
    date: '01.01.2024',
    tags: ['Leiemarked', 'Boforhold'],
  },
  areal: {
    fullDescription: 'Totalt landareal i kvadratkilometer, ekskl. ferskvann og sjø. Arealtallene hentes fra Kartverkets administrative grenser og oppdateres ved kommunesammenslåinger.',
    source: 'Kartverket',
    date: '01.01.2024',
    tags: ['Areal', 'Kartverket'],
  },
  befolkningstetthet: {
    fullDescription: 'Antall bosatte innbyggere per kvadratkilometer landareal. Beregnes som folkemengde delt på landareal og gir et mål på by- vs. landlig karakter.',
    source: 'Statistisk sentralbyrå (SSB) / Kartverket',
    date: '01.01.2024',
    tags: ['Tetthet', 'Urbanisering'],
  },
}

// ── APEX CHART ── same import pattern as components/charts/Bar.vue
import ApexChart from 'vue3-apexcharts'

// Per-indicator mock datasets — realistic Norwegian public health figures
const INDICATOR_DATA: Record<string, { series: number[]; categories: string[]; unit: string }> = {
  innbyggere:          { categories: ['2019','2020','2021','2022','2023'], series: [21800, 21950, 22100, 22280, 22430], unit: 'Antall' },
  befolkningsvekst:    { categories: ['2019','2020','2021','2022','2023'], series: [0.4, 0.3, 0.7, 0.8, 0.7], unit: '%' },
  aldersfordeling:     { categories: ['0–17','18–34','35–49','50–66','67+'], series: [24, 19, 21, 22, 14], unit: '%' },
  innvandrere:         { categories: ['2019','2020','2021','2022','2023'], series: [7.2, 7.5, 7.8, 8.1, 8.4], unit: '%' },
  'forventet-levealder': { categories: ['2015','2017','2019','2021','2023'], series: [81.2, 81.5, 81.8, 81.6, 82.1], unit: 'År' },
  'psykisk-helse':     { categories: ['2019','2020','2021','2022','2023'], series: [8.1, 9.3, 10.2, 9.8, 9.4], unit: '%' },
  overvekt:            { categories: ['2019','2020','2021','2022','2023'], series: [38, 39, 41, 40, 39], unit: '%' },
  roykere:             { categories: ['2019','2020','2021','2022','2023'], series: [13, 12, 11, 10, 9], unit: '%' },
  barnehagedekning:    { categories: ['2019','2020','2021','2022','2023'], series: [91, 92, 93, 93, 94], unit: '%' },
  grunnskolepoeng:     { categories: ['2019','2020','2021','2022','2023'], series: [42.1, 42.8, 43.0, 42.5, 43.4], unit: 'Poeng' },
  'fullfort-vgs':      { categories: ['2019','2020','2021','2022','2023'], series: [74, 75, 76, 77, 78], unit: '%' },
  'hoyere-utdanning':  { categories: ['2019','2020','2021','2022','2023'], series: [31, 32, 33, 34, 35], unit: '%' },
  arbeidsledighet:     { categories: ['2019','2020','2021','2022','2023'], series: [2.8, 4.6, 3.9, 3.1, 2.6], unit: '%' },
  uforetrygd:          { categories: ['2019','2020','2021','2022','2023'], series: [9.8, 10.1, 10.3, 10.2, 10.0], unit: '%' },
  sosialhjelp:         { categories: ['2019','2020','2021','2022','2023'], series: [3.2, 3.8, 3.5, 3.3, 3.1], unit: '%' },
  'sykefravær':        { categories: ['2019','2020','2021','2022','2023'], series: [6.1, 6.4, 7.1, 7.3, 6.8], unit: '%' },
  medianinntekt:       { categories: ['2019','2020','2021','2022','2023'], series: [510000, 525000, 541000, 562000, 581000], unit: 'kr' },
  lavinntekt:          { categories: ['2019','2020','2021','2022','2023'], series: [10.2, 10.5, 10.8, 11.1, 10.9], unit: '%' },
  gjeld:               { categories: ['2019','2020','2021','2022','2023'], series: [480000, 510000, 540000, 560000, 575000], unit: 'kr' },
  areal:               { categories: ['Lindesnes'], series: [796], unit: 'km²' },
  befolkningstetthet:  { categories: ['2019','2020','2021','2022','2023'], series: [27, 27.4, 27.7, 28.0, 28.3], unit: 'per km²' },
  boligpris:           { categories: ['2019','2020','2021','2022','2023'], series: [28500, 31000, 34500, 32000, 31500], unit: 'kr/m²' },
}

const DEFAULT_DATA = { categories: ['2019','2020','2021','2022','2023'], series: [40, 45, 42, 48, 51], unit: 'Verdi' }

const chartData = computed(() => {
  if (!selectedIndicator.value) return DEFAULT_DATA
  return INDICATOR_DATA[selectedIndicator.value.id] ?? DEFAULT_DATA
})

// Map diagramType → ApexCharts type
const apexChartType = computed(() => {
  if (selectedDiagramType.value === 'line') return 'line'
  if (selectedDiagramType.value === 'pie') return 'donut'
  return 'bar'
})

// Force re-mount when type or comparisons change
const chartKey = computed(() =>
  `${selectedIndicator.value?.id}-${selectedDiagramType.value}-${selectedMaaltall.value}-${comparisonAreas.value.map((c) => c.id).join(',')}`,
)

const DARK_GREEN = '#3d5a4a'
const LIGHT_GREEN = '#88b56b'

// All series colors: main area first, then comparison palette
const seriesColors = computed(() => [
  DARK_GREEN,
  ...COMPARISON_COLORS.slice(0, comparisonAreas.value.length),
])

const hasComparisons = computed(() => comparisonAreas.value.length > 0)

const chartOptions = computed(() => {
  const isPie = apexChartType.value === 'donut'
  const isLine = apexChartType.value === 'line'
  const data = chartData.value

  const base: Record<string, any> = {
    chart: {
      toolbar: { show: false },
      animations: { enabled: true, speed: 400 },
      fontFamily: 'Epilogue, sans-serif',
      background: 'transparent',
      sparkline: { enabled: false },
    },
    colors: seriesColors.value,
    grid: {
      borderColor: '#f0f0f0',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { left: 4, right: 4 },
    },
    tooltip: {
      y: {
        formatter: (val: number) =>
          selectedMaaltall.value === 'prosent'
            ? val.toFixed(1) + ' %'
            : val.toLocaleString('nb-NO') + ' ' + data.unit,
      },
    },
    dataLabels: { enabled: false },
    legend: {
      show: hasComparisons.value || isPie,
      position: 'bottom',
      fontSize: '11px',
      fontFamily: 'Epilogue, sans-serif',
      markers: { size: 6 },
      itemMargin: { horizontal: 10 },
    },
  }

  if (isPie) {
    return {
      ...base,
      labels: data.categories,
      plotOptions: { pie: { donut: { size: '60%' } } },
    }
  }

  return {
    ...base,
    xaxis: {
      categories: data.categories,
      labels: { style: { fontSize: '10px', colors: '#9ca3af' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: '10px', colors: '#9ca3af' },
        formatter: (val: number) =>
          selectedMaaltall.value === 'prosent'
            ? val.toFixed(1) + '%'
            : val >= 1000
              ? (val / 1000).toFixed(0) + 'k'
              : String(val),
      },
    },
    plotOptions: isLine ? {} : { bar: { borderRadius: 4, columnWidth: '55%' } },
    stroke: isLine
      ? { curve: 'smooth', width: 2.5 }
      : hasComparisons.value
        ? { show: false }
        : { show: false },
    markers: isLine ? { size: 4, strokeWidth: 0 } : {},
  }
})

const chartSeries = computed(() => {
  const data = chartData.value
  const mainLabel = selectedArea.value?.label ?? 'Hele landet'

  if (apexChartType.value === 'donut') return data.series

  const series: { name: string; data: number[] }[] = [
    { name: mainLabel, data: data.series },
  ]
  // Add one series per comparison area with deterministic mock offsets
  comparisonAreas.value.forEach((comp, i) => {
    const f = deterministicFactor(comp.id, i)
    series.push({
      name: comp.label,
      data: data.series.map((v) => parseFloat((v * f).toFixed(1))),
    })
  })
  return series
})

function handleAddCard() {
  if (!selectedIndicator.value) return
  closeCardEdit()
}
</script>

<style scoped>
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.desc-strip-enter-from,
.desc-strip-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.desc-strip-enter-active,
.desc-strip-leave-active {
  transition: opacity 0.2s ease, max-height 0.25s ease, padding 0.2s ease;
  max-height: 300px;
  overflow: hidden;
}
</style>
