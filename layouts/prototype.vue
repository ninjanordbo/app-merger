<template>
  <div class="flex h-screen w-full overflow-hidden">
    <!-- Sidebar -->
    <PrototypeSidebar />

    <!-- Main Content Area -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Header -->
      <PrototypeHeader>
        <template #actions>
          <slot name="header-actions" />
        </template>
      </PrototypeHeader>

      <!-- Page Content -->
      <main class="flex-1 overflow-auto bg-neutral-50 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
// This layout is dedicated to the prototype environment
// It provides a consistent UI structure with sidebar and header
// All pages under /prototype will use this layout
</script>
