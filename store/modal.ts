import { defineStore } from "pinia";
import { ref, type Component } from "vue";

export const useModal = defineStore("modal", () => {
  const isOpen = ref(false);

  const component = shallowRef<Component | null>(null);

  const componentProps = ref<Record<string, unknown>>({});

  const modalProps = ref<Record<string, unknown>>({});

  function openModal(
    comp: Component,
    modalPropsObj: Record<string, unknown> = {},
    componentPropsObj: Record<string, unknown> = {},
  ) {
    component.value = markRaw(comp);
    modalProps.value = modalPropsObj;
    componentProps.value = componentPropsObj;
    isOpen.value = true;
  }

  function closeModal() {
    isOpen.value = false;
    component.value = null;
    componentProps.value = {};
    modalProps.value = {};
  }

  return {
    isOpen,
    component,
    componentProps,
    modalProps,
    openModal,
    closeModal,
  };
});
