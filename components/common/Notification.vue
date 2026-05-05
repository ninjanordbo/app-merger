<template>
  <div
    class="fixed bottom-0 right-0 z-[999] flex flex-col-reverse items-center justify-center gap-5 p-5"
  >
    <TransitionGroup name="slide-from-bottom">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="z-50 flex min-w-80 items-start justify-center rounded-lg border bg-white p-4 shadow-lg"
        style="grid-template-columns: min-content 1fr min-content"
      >
        <div
          :class="[
            'w-min rounded-full border-[1.5px] p-[1px]',
            notification.type === 'error' && 'border-red-500 text-red-500',
            notification.type === 'success' &&
              'border-green-500 text-green-500',
            notification.type === 'warning' &&
              'border-yellow-500 text-yellow-500',
          ]"
        >
          <LucideX v-if="notification.type === 'error'" :size="15" />
          <LucideCheck
            v-else-if="notification.type === 'success'"
            color="rgb(34 197 94)"
            :size="15"
          />
          <div
            v-else
            class="flex aspect-square translate-y-[1px] items-center justify-center px-1.5 text-xs"
          >
            !
          </div>
        </div>

        <div class="ml-4 flex-grow">
          <div class="text-sm font-medium">
            {{ notification.title }}
          </div>
          <div class="text-sm font-light text-neutral-600">
            {{ notification.message }}
          </div>
        </div>

        <button
          class="-mr-1 -mt-1 ml-3 w-min justify-self-start text-neutral-600"
          @click="removeNotification(notification.id)"
        >
          <LucideX :size="16" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { useNotifications } from "~/store/notifications";

const { notifications, removeNotification } = useNotifications();
</script>

<style lang="scss" scoped>
@keyframes bounceInUp {
  0% {
    transform: translateY(100%);
  }
  40% {
    transform: translateY(-10%);
  }
  80% {
    transform: translateY(5%);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes bounceOutDown {
  0% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5%);
  }
  80% {
    transform: translateY(10%);
  }
  100% {
    transform: translateY(100%);
  }
}

.slide-from-bottom-enter-active {
  animation: bounceInUp 0.4s ease-out;
}

.slide-from-bottom-leave-active {
  animation: bounceOutDown 0.3s ease-in;
}
</style>
