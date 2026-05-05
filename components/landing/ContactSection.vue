<template>
  <div
    class="flex w-full max-w-7xl flex-col items-center justify-center gap-10 px-5 py-28 lg:px-0"
  >
    <div
      class="flex w-full max-w-2xl flex-col items-center justify-center gap-5"
    >
      <h1 id="contact" class="text-center text-3xl font-bold leading-none">
        Vi hører gjerne fra deg!
      </h1>
      <div class="text-center font-light text-neutral-700">
        Hvis dette høres spennende ut, ta kontakt i dag!
      </div>

      <div
        class="grid w-full grid-cols-1 flex-wrap items-center justify-stretch gap-0 md:grid-cols-2"
      >
        <CommonLineInput
          v-model="emailInput"
          type="email"
          placeholder="Email"
          class="mr-3"
        />
        <CommonLineInput v-model="nameInput" type="text" placeholder="Navn" />

        <CommonErrorMessage
          v-if="invalidEmailInput"
          error-message="Vennligst oppgi din e-postadresse"
        />

        <CommonTextArea
          v-model="textInput"
          class="mt-3 md:col-span-2"
          placeholder="Melding"
        />
        <CommonErrorMessage
          v-if="invalidTextInput"
          error-message="Vennligst skriv inn e-postteksten du ønsker å sende"
        />

        <div class="self-end justify-self-end md:col-span-2">
          <button
            class="flex items-center gap-2 rounded-md bg-amber-500 px-10 py-3 text-sm font-semibold duration-200 hover:-translate-y-1"
            @click="sendEmail"
          >
            Send
            <LucideArrowRight class="-mt-0.5 size-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { sendEmail as sendEmailHelper } from "~/helpers/sendEmail";

const emailInput = ref("");
const nameInput = ref("");
const textInput = ref("");

const emailRegex = /\S+@\S+\.\S+/;

const invalidEmailInput = ref(false);
const invalidTextInput = ref(false);

const { pushNotification } = useNotifications();

async function sendEmail() {
  if (!emailInput.value.match(emailRegex)) {
    invalidEmailInput.value = true;
    return;
  } else {
    invalidEmailInput.value = false;
  }
  if (textInput.value === "") {
    invalidTextInput.value = true;
    return;
  } else {
    invalidTextInput.value = false;
  }

  try {
    await sendEmailHelper(
      "nabolagshelse@gmail.com",
      "New contact",
      `${emailInput.value} ${nameInput.value}:\n${textInput.value}`,
    );

    pushNotification({
      type: "success",
      title: "Meldingen er sendt.",
      message: "Vi tar kontakt med deg så snart som mulig.",
    });

    emailInput.value = "";
    nameInput.value = "";
    textInput.value = "";
  } catch (error: any) {
    pushNotification({
      type: "error",
      title: "Feil under sending av email",
      message: error?.message,
    });
  }
}
</script>
