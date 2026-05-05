<template>
  <div class="flex">
    <AreaSelectionNavPanel class="z-50" />
    <div class="z-10 h-full w-full bg-white">
      <slot />
      <CommonNotification />
    </div>
  </div>
</template>
