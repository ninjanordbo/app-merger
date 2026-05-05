<template>
  <AreaSelectionCard
    :id="0"
    :card-height="3"
    :card-width="2"
    :draggable="false"
    :no-move="true"
    :no-resize="true"
    :locked="true"
    :deletable="false"
    title="Sonekart"
  >
    <template #header-content>
      <AreaSelectionMapHeader />
    </template>
    <CommonMap map-type="zone" />
  </AreaSelectionCard>

  <AreaSelectionZonesCard />
</template>

<script lang="ts" setup></script>
