<template>
  <div class="w-full">
    <div class="grid gap-2">
      <div
        class="grid grid-cols-[repeat(4,1fr)_min-content] items-center gap-x-2 rounded-xl border-[0.5px] border-primary bg-primary/20 px-5 py-1.5 font-bold text-gray-700"
      >
        <div>Grunnkrets</div>
        <div>Gkr nr</div>
        <div>Innbyggere</div>
        <div>Sone</div>
        <LucidePencil class="text-transparent" :size="16" />
      </div>

      <div class="space-y-2">
        <slot />
      </div>
    </div>
  </div>
</template>
