import { defineStore } from "pinia";

/**
 * Prototype App Store
 *
 * This store is isolated to the prototype environment and will not affect
 * the main application state. Use this for experimenting with state management
 * patterns and features.
 */
export const usePrototypeAppStore = defineStore("prototypeApp", {
  state: () => ({
    // Add your prototype state here
    isLoading: false,
    message: "Welcome to the prototype environment!",
    counter: 0,
  }),

  getters: {
    // Add your computed properties here
    doubleCounter: (state) => state.counter * 2,
  },

  actions: {
    // Add your actions here
    increment() {
      this.counter++;
    },

    decrement() {
      this.counter--;
    },

    setMessage(newMessage: string) {
      this.message = newMessage;
    },

    setLoading(loading: boolean) {
      this.isLoading = loading;
    },
  },
});
