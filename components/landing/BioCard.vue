<template>
  <div
    class="flex h-full min-h-72 w-full max-w-64 flex-col items-center justify-between gap-3 rounded-lg bg-white p-5 duration-200"
  >
    <img class="size-28 rounded-full" :src="bio.avatarLink" alt="avatar-link" />
    <div class="text-xs font-bold uppercase">
      {{ bio.name }}
    </div>
    <div class="text-center text-sm font-light text-neutral-700">
      {{ bio.role }}
    </div>
    <div class="flex gap-2">
      <a
        class="p-1 duration-200 hover:-translate-y-0.5"
        :href="bio.links.linkedIn"
        target="_blank"
      >
        <IconsLinkedIn color="gray" />
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Bio {
  avatarLink: string;
  name: string;
  role: string;
  links: { [key: string]: string };
}

defineProps({
  bio: {
    type: Object as PropType<Bio>,
    required: true,
  },
});
</script>
