<template>
  <div class="p-5">
    <div class="flex w-full flex-col gap-5 rounded-2xl bg-gray-100 p-5">
      <div class="flex items-center justify-start gap-2">
        <div class="h-7 w-0.5 bg-primary-500" />
        <h1 class="translate-y-0.5 text-3xl font-light">Prosjektoversikt</h1>
      </div>

      <div
        class="flex w-full flex-col items-start justify-start gap-5 rounded-xl bg-primary-500 bg-opacity-50 px-8 py-5 text-base"
      >
        Velg en ferdiglagd prosjektmal hvis du foretrekker et raskt
        standardoppsett. Alternativt kan du sette sammen ditt eget tilpassede
        prosjekt med ønskede visninger og indikatorer.
      </div>

      <div class="flex items-center justify-start gap-2">
        <div class="h-7 w-0.5 bg-primary-500" />
        <div class="translate-y-0.5 text-2xl font-light">Prosjektmaler</div>
      </div>

      <div
        class="grid grid-cols-[repeat(auto-fit,minmax(300px,360px))] items-stretch justify-start gap-5"
      >
        <DashboardProjectTemplateCard
          v-for="project in projectTemplates"
          :key="project.name"
          :project
          :apply-project="() => handleCreateProject(project)"
          class="flex flex-col items-start justify-between gap-1 rounded-xl bg-white p-2"
        />
      </div>

      <div class="mt-5 flex items-center justify-start gap-2">
        <div class="h-7 w-0.5 bg-primary-500" />
        <h1 class="translate-y-0.5 text-2xl font-light">Lagrede prosjekter</h1>
      </div>

      <div
        v-if="projectsInProgress"
        class="grid grid-cols-[repeat(auto-fit,minmax(200px,360px))] items-stretch justify-start gap-2.5"
      >
        <div
          v-for="_ in new Array(5)"
          :key="_"
          class="h-52 w-[360px] animate-pulse rounded-lg bg-gray-300"
        />
      </div>
      <div
        v-else
        v-auto-animate
        class="flex flex-col items-center justify-start gap-2.5"
      >
        <DashboardProjectCard
          v-for="project in projects"
          :key="project.id"
          :project
          :delete-project="handleDeleteProject"
          :apply-project="applyProject"
          :duplicate-project="handleDuplicateProject"
        />
      </div>
    </div>
  </div>

  <CommonConfirmationModal
    v-if="modalData"
    v-bind="modalData"
    v-model:is-open="isModalOpen"
  />
</template>

<script lang="ts" setup>
import { projectTemplates } from "~/data/projectTemplates";

const { createProject, clearCurrentProjectData, buildMapCard, upsertCard } =
  useDashboard();
const { handleAreaSelection } = useMap();

async function handleCreateProject(project: ProjectWithItems) {
  await clearCurrentProjectData();
  handleAreaSelection(null);
  upsertCard(buildMapCard());
  const projectId = await createProject({
    ...project,
    description: "Prosjektbeskrivelse",
  });

  if (projectId) {
    useRouter().push(`/dashboard/${projectId}`);
  }
}

const { fetchUserProjects, deleteProject, duplicateProject } = useDashboard();

const projects = ref<Project[]>([]);

const isModalOpen = ref(false);
const modalData = ref<{
  title: string;
  text: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
} | null>(null);

function handleDeleteProject(project: Project) {
  modalData.value = {
    title: "Slette prosjektet",
    text: `Du vil slette prosjekt kalt ${project.name}. Er du sikker?`,
    confirmText: "Ja – Slette",
    cancelText: "Nei – Avbryt",

    onConfirm: async () => {
      await deleteProject(project.id);
      projects.value = projects.value.filter((p) => p.id !== project.id);
    },
  };

  isModalOpen.value = true;
}

async function handleDuplicateProject(project: Project) {
  await duplicateProject(project.id);
  await reloadProjects();
}

function applyProject(project: Project) {
  useRouter().push(`/dashboard/${project.id}`);
}

const {
  execute: getProjects,
  inProgress: projectsInProgress,
  reload: reloadProjects,
} = usePromise(async () => {
  projects.value =
    (await fetchUserProjects().then((res) =>
      res?.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
    )) || [];
});

onMounted(getProjects);

definePageMeta({
  layout: "dashboard",
  title: "Dashbord",
});
useHead({
  title: "Dashbord",
});
</script>
