<template>
  <div class="space-y-6">
    <!-- Main Content Card -->
    <div class="rounded-lg border border-neutral-200 bg-white p-6">
      <h2 class="mb-4 text-xl font-semibold text-neutral-900">
        Page Title
      </h2>
      <p class="text-neutral-600">
        Add your page description here.
      </p>
    </div>

    <!-- Example: Grid of Cards -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div class="rounded-lg border border-neutral-200 bg-white p-6">
        <div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
          <LucideRocket class="text-primary" :size="24" />
        </div>
        <h3 class="mb-2 font-semibold text-neutral-900">Feature 1</h3>
        <p class="text-sm text-neutral-600">
          Description of feature 1
        </p>
      </div>

      <div class="rounded-lg border border-neutral-200 bg-white p-6">
        <div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
          <LucideSettings class="text-primary" :size="24" />
        </div>
        <h3 class="mb-2 font-semibold text-neutral-900">Feature 2</h3>
        <p class="text-sm text-neutral-600">
          Description of feature 2
        </p>
      </div>

      <div class="rounded-lg border border-neutral-200 bg-white p-6">
        <div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
          <LucideUsers class="text-primary" :size="24" />
        </div>
        <h3 class="mb-2 font-semibold text-neutral-900">Feature 3</h3>
        <p class="text-sm text-neutral-600">
          Description of feature 3
        </p>
      </div>
    </div>

    <!-- Example: Button Group -->
    <div class="flex flex-wrap gap-3">
      <button
        class="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        @click="handlePrimaryAction"
      >
        <LucidePlus :size="16" />
        Primary Action
      </button>

      <button
        class="flex items-center gap-2 rounded-md border border-primary bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
        @click="handleSecondaryAction"
      >
        <LucideSave :size="16" />
        Secondary Action
      </button>
    </div>

    <!-- Example: Using Prototype Store -->
    <div class="rounded-lg border border-neutral-200 bg-white p-6">
      <h3 class="mb-4 text-lg font-semibold text-neutral-900">Store Example</h3>
      <p class="mb-2 text-neutral-600">Counter: {{ store.counter }}</p>
      <p class="mb-4 text-neutral-600">Message: {{ store.message }}</p>

      <div class="flex gap-2">
        <button
          @click="store.increment()"
          class="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary-700"
        >
          Increment
        </button>
        <button
          @click="store.decrement()"
          class="rounded-md bg-neutral-200 px-4 py-2 text-sm hover:bg-neutral-300"
        >
          Decrement
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * Template Page for Prototype Environment
 *
 * This is a starter template with common patterns and examples.
 * Copy this file to create new prototype pages.
 *
 * To use:
 * 1. Copy this file to /pages/prototype/your-page-name.vue
 * 2. Update the page title in definePageMeta
 * 3. Modify the content as needed
 * 4. Add navigation link in /components/prototype/Sidebar.vue
 */

definePageMeta({
  title: "Template Page",
  layout: "prototype",
});

// Access the prototype store
const store = usePrototypeAppStore();

// Example action handlers
const handlePrimaryAction = () => {
  console.log("Primary action triggered");
  store.setMessage("Primary action clicked!");
};

const handleSecondaryAction = () => {
  console.log("Secondary action triggered");
  store.setMessage("Secondary action clicked!");
};
</script>
