<template>
  <div class="h-full w-full">
    <div
      v-if="projectInProgress || !isInitialized"
      class="flex h-screen w-full flex-col items-center justify-center"
    >
      <div class="text-primary-500">
        <CommonLoader width="60" height="60" />
      </div>
      <p class="text-xl">Lasting...</p>
    </div>

    <div
      v-else-if="projectId"
      class="flex h-full w-full flex-col items-center justify-start gap-5 p-5"
    >
      <DashboardHeader class="sticky left-0 top-0 z-20">
        <template #text>
          <CommonEditableLine
            v-model="projectName"
            placeholder="Prosjektnavn"
            size="xl"
          />
        </template>
      </DashboardHeader>
      <DashboardBoard class="z-10" />
    </div>

    <DashboardProjectNotFound v-else />
  </div>
</template>

<script lang="ts" setup>
const { projectId, projectName } = storeToRefs(useDashboard());
const { params } = useRoute();
const { isCardEditOpen } = storeToRefs(useCreateCard());
const { closeCardEdit } = useCreateCard();
const { fetchProject } = useDashboard();

const isDemo = String(params.id) === 'demo'

// For the demo route: set state synchronously right now, no async fetch needed.
// This guarantees the board renders on the very first tick — no 404 flash,
// no dependency on onMounted timing or network.
if (isDemo) {
  projectId.value = 'demo'
  projectName.value = 'Demo'
}

const { execute: getProject, inProgress: projectInProgress } = usePromise(() =>
  fetchProject(String(params.id)),
);

// For non-demo routes: guard against the 404 showing before the fetch finishes.
const isInitialized = ref(isDemo)

onMounted(async () => {
  if (!isDemo) {
    await getProject()
    isInitialized.value = true
  }
});

watch(isCardEditOpen, (newIsCardEditOpen) => {
  if (newIsCardEditOpen) {
    handleOpenEdit();
  } else {
    closeCardEdit();
  }
});

function handleOpenEdit() {
  // Drawer opens automatically via isCardEditOpen — area check skipped for prototype
}

definePageMeta({
  layout: "dashboard",
  title: "Dashbord",
});
useHead({
  title: "Dashbord",
});
</script>
