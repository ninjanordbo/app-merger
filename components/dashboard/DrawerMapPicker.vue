<template>
  <div class="relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
    <!-- Map container -->
    <div ref="mapContainer" class="h-full w-full" style="min-height: 240px" />

    <!-- Hover tooltip -->
    <div
      v-if="hoveredName"
      class="pointer-events-none absolute left-3 top-3 rounded-md bg-dark-blue px-2.5 py-1 text-xs font-medium text-white shadow"
    >
      {{ hoveredName }}
    </div>

    <!-- No-token fallback — inline SVG map of Norway (no network request) -->
    <div v-if="noToken" class="absolute inset-0 overflow-hidden bg-[#d0e4ef]">
      <svg
        viewBox="0 0 260 390"
        xmlns="http://www.w3.org/2000/svg"
        class="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <!-- Sea -->
        <rect width="260" height="390" fill="#d0e4ef"/>

        <!-- Lat/lon grid -->
        <g stroke="#bdd2e6" stroke-width="0.4">
          <line x1="0" y1="97"  x2="260" y2="97"/>
          <line x1="0" y1="194" x2="260" y2="194"/>
          <line x1="0" y1="291" x2="260" y2="291"/>
          <line x1="65"  y1="0" x2="65"  y2="390"/>
          <line x1="130" y1="0" x2="130" y2="390"/>
          <line x1="195" y1="0" x2="195" y2="390"/>
        </g>

        <!-- Norway mainland (simplified clockwise path from Lindesnes) -->
        <path
          fill="#a8c490"
          stroke="#e4eedc"
          stroke-width="1.2"
          d="M 26 374
             L 75 368
             L 79 338 L 82 304 L 84 269 L 86 234 L 88 198
             L 90 165 L 94 135 L 100 108
             L 120 98 L 140 85 L 160 75 L 180 65
             L 210 57 L 228 50 L 238 43
             L 235 37 L 200 22 L 175 24
             L 152 44 L 115 68 L 95 103
             L 78 133 L 68 165 L 54 195
             L 38 222 L 22 240 L 16 253
             L 9 278 L 9 312 L 13 348 L 26 374 Z"
        />

        <!-- Suggested county divisions -->
        <g stroke="#c0daa8" stroke-width="0.7">
          <line x1="30" y1="362" x2="78"  y2="356"/>
          <line x1="11" y1="312" x2="82"  y2="304"/>
          <line x1="14" y1="270" x2="84"  y2="265"/>
          <line x1="34" y1="225" x2="87"  y2="225"/>
          <line x1="76" y1="165" x2="90"  y2="158"/>
          <line x1="95" y1="103" x2="140" y2="85"/>
          <line x1="115" y1="68" x2="180" y2="65"/>
        </g>

        <!-- City dots -->
        <circle cx="69"  cy="321" r="3"   fill="#3a6440"/>
        <circle cx="10"  cy="311" r="2.5" fill="#3a6440"/>
        <circle cx="66"  cy="228" r="2.5" fill="#3a6440"/>
        <circle cx="79"  cy="133" r="2"   fill="#3a6440"/>
        <circle cx="115" cy="68"  r="2"   fill="#3a6440"/>

        <!-- City labels -->
        <text x="73"  y="324" font-size="7.5" fill="#2a5030" font-family="sans-serif" font-weight="600">Oslo</text>
        <text x="14"  y="314" font-size="7"   fill="#2a5030" font-family="sans-serif">Bergen</text>
        <text x="70"  y="231" font-size="7"   fill="#2a5030" font-family="sans-serif">Trondheim</text>
        <text x="83"  y="136" font-size="7"   fill="#2a5030" font-family="sans-serif">Bodø</text>
        <text x="119" y="71"  font-size="7"   fill="#2a5030" font-family="sans-serif">Tromsø</text>
      </svg>

      <!-- Bottom caption bar -->
      <div class="absolute inset-x-0 bottom-0 flex items-center justify-between bg-white/80 px-3 py-1.5 backdrop-blur-sm">
        <div class="flex items-center gap-1.5">
          <LucideMousePointerClick :size="12" class="text-gray-400" />
          <p class="text-[11px] text-gray-500">Klikk på et område for å velge</p>
        </div>
        <p class="text-[10px] text-gray-300">Interaktivt i prod.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import mapboxgl from 'mapbox-gl'

const props = defineProps<{
  geoLevel: string          // 'hele-landet' | 'fylke' | 'kommune' | 'bydel' | 'levekaar'
  selectedAreaId: string | null
}>()

const emit = defineEmits<{
  (e: 'select', area: { id: string; label: string }): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
const hoveredName = ref<string | null>(null)
const noToken = ref(false)

let map: mapboxgl.Map | null = null
let hoveredFeatureId: string | number | null = null

// Map geo level → Mapbox tileset layer name
const LAYER_MAP: Record<string, string> = {
  'fylke':      'fylker',
  'kommune':    'kommuner',
  'levekaar':   'soner',
  'grunnkrets': 'soner',   // fallback — reuse soner tileset in prototype
}

const LAYER_ID_FIELD: Record<string, string> = {
  'fylker':   'fylke_id',
  'kommuner': 'kommune_id',
  'soner':    'zone_id',
}

const NAME_FIELD: Record<string, string> = {
  'fylker':   'navn',
  'kommuner': 'navn',
  'soner':    'name',
}

function getTilesetLayer(geoLevel: string): string {
  return LAYER_MAP[geoLevel] ?? 'kommuner'
}

const SOURCE_ID = 'drawer-areas'
const FILL_LAYER = 'drawer-fill'
const LINE_LAYER = 'drawer-line'
const SELECTED_LAYER = 'drawer-selected'

function removeAreaLayers() {
  if (!map) return
  ;[SELECTED_LAYER, FILL_LAYER, LINE_LAYER].forEach((id) => {
    if (map!.getLayer(id)) map!.removeLayer(id)
  })
  if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID)
}

function addAreaLayers(tilesetLayer: string) {
  if (!map) return

  removeAreaLayers()

  map.addSource(SOURCE_ID, {
    type: 'vector',
    url: `mapbox://nabolagshelse.${tilesetLayer}`,
  })

  // Fill — hover highlight
  map.addLayer({
    id: FILL_LAYER,
    type: 'fill',
    source: SOURCE_ID,
    'source-layer': tilesetLayer,
    paint: {
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#88b56b',
        '#e8f0e4',
      ],
      'fill-opacity': 0.6,
    },
  })

  // Selected fill — dark green
  map.addLayer({
    id: SELECTED_LAYER,
    type: 'fill',
    source: SOURCE_ID,
    'source-layer': tilesetLayer,
    paint: {
      'fill-color': '#3f6844',
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        0.75,
        0,
      ],
    },
  })

  // Borders
  map.addLayer({
    id: LINE_LAYER,
    type: 'line',
    source: SOURCE_ID,
    'source-layer': tilesetLayer,
    paint: {
      'line-color': '#ffffff',
      'line-width': 0.8,
    },
  })

  // Hover interaction
  map.on('mousemove', FILL_LAYER, (e) => {
    if (!e.features?.length) return
    map!.getCanvas().style.cursor = 'pointer'
    const feat = e.features[0]
    const layer = getTilesetLayer(props.geoLevel)
    hoveredName.value = feat.properties?.[NAME_FIELD[layer]] ?? null

    if (hoveredFeatureId !== null) {
      map!.setFeatureState(
        { source: SOURCE_ID, sourceLayer: layer, id: hoveredFeatureId },
        { hover: false },
      )
    }
    hoveredFeatureId = feat.id ?? null
    if (hoveredFeatureId !== null) {
      map!.setFeatureState(
        { source: SOURCE_ID, sourceLayer: layer, id: hoveredFeatureId },
        { hover: true },
      )
    }
  })

  map.on('mouseleave', FILL_LAYER, () => {
    map!.getCanvas().style.cursor = ''
    hoveredName.value = null
    if (hoveredFeatureId !== null) {
      const layer = getTilesetLayer(props.geoLevel)
      map!.setFeatureState(
        { source: SOURCE_ID, sourceLayer: layer, id: hoveredFeatureId },
        { hover: false },
      )
      hoveredFeatureId = null
    }
  })

  // Click to select
  map.on('click', FILL_LAYER, (e) => {
    if (!e.features?.length) return
    const feat = e.features[0]
    const layer = getTilesetLayer(props.geoLevel)
    const idField = LAYER_ID_FIELD[layer]
    const id = String(feat.properties?.[idField] ?? feat.id ?? '')
    const label = feat.properties?.[NAME_FIELD[layer]] ?? ''
    emit('select', { id, label })
  })
}

// Mark selected feature on map
function syncSelectedState(tilesetLayer: string, areaId: string | null) {
  if (!map || !map.isStyleLoaded()) return
  // Reset all, then set selected
  map.querySourceFeatures(SOURCE_ID, { sourceLayer: tilesetLayer }).forEach((f) => {
    if (f.id != null) {
      map!.setFeatureState(
        { source: SOURCE_ID, sourceLayer: tilesetLayer, id: f.id },
        { selected: false },
      )
    }
  })
  if (areaId) {
    // Numeric IDs needed for vector tiles feature state
    const features = map.querySourceFeatures(SOURCE_ID, { sourceLayer: tilesetLayer })
    const match = features.find((f) => {
      const idField = LAYER_ID_FIELD[tilesetLayer]
      return String(f.properties?.[idField]) === areaId || String(f.id) === areaId
    })
    if (match?.id != null) {
      map.setFeatureState(
        { source: SOURCE_ID, sourceLayer: tilesetLayer, id: match.id },
        { selected: true },
      )
    }
  }
}

onMounted(() => {
  const config = useRuntimeConfig()
  const token = config.public.mapboxToken as string

  if (!token) {
    noToken.value = true
    return
  }

  mapboxgl.accessToken = token

  map = new mapboxgl.Map({
    container: mapContainer.value!,
    style: 'mapbox://styles/mapbox/light-v11',
    center: [15, 65],    // Norway center
    zoom: 3.5,
    minZoom: 2,
    maxZoom: 12,
    attributionControl: false,
  })

  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right')

  const tilesetLayer = getTilesetLayer(props.geoLevel)

  map.on('load', () => {
    if (props.geoLevel !== 'hele-landet') {
      addAreaLayers(tilesetLayer)
    }
  })
})

// React to geo level changes
watch(() => props.geoLevel, (newLevel) => {
  if (!map || !map.isStyleLoaded()) return
  if (newLevel === 'hele-landet') {
    removeAreaLayers()
    return
  }
  const tilesetLayer = getTilesetLayer(newLevel)
  addAreaLayers(tilesetLayer)
})

// React to selected area changes
watch(() => props.selectedAreaId, (newId) => {
  if (!map) return
  const tilesetLayer = getTilesetLayer(props.geoLevel)
  map.once('idle', () => syncSelectedState(tilesetLayer, newId))
})

onUnmounted(() => {
  map?.remove()
  map = null
})
</script>
