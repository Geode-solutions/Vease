<template>
  <VRow align="center" justify="center">
    <VCol>
      <VForm v-model="valid">
        <VContainer>
          <VRow>
            <VCol cols="12" md="4" justify="center">
              <VTextField v-model="name" label="Name" required />
            </VCol>
            <VCol cols="12" md="4">
              <VTextField
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
              />
            </VCol>
            <VCol cols="12" md="4">
              <VCheckbox label="Launch the app" v-model="launch" />
            </VCol>
          </VRow>
        </VContainer>
      </VForm>
    </VCol>
  </VRow>
  <VRow align="center" justify="center">
    <VCol align="center" justify="center">
      <VBtn
        :text="props.button_label"
        :color="props.button_color"
        @click="submit_recaptcha"
      />
    </VCol>
  </VRow>
</template>

<script setup>
const props = defineProps({
  button_label: {
    type: String,
    required: false,
    default: "Click to launch the app",
  },
  button_color: {
    type: String,
    required: false,
    default: "primary",
  },
});
const infra_store = useInfraStore();
const name = ref("");
const email = ref("");
const launch = ref(false);
const emailRules = [
  (value) => {
    if (value) return true;

    return "E-mail is required.";
  },
  (value) => {
    if (/.+@.+\..+/.test(value)) return true;

    return "E-mail must be valid.";
  },
];

onMounted(() => {
  if (import.meta.client) {
    if (
      process.env.NODE_ENV !== "production" ||
      infra_store.app_mode !== appMode.appMode.CLOUD
    ) {
      infra_store.$patch({ is_captcha_validated: true });
    }
  }
});
async function submit_recaptcha() {
  $fetch(
    `/.netlify/functions/recaptcha?name=${name.value}&email=${email.value}&launch=${launch.value}`,
    {
      onRequestError({ error }) {
        console.log("onRequestError", error);
      },
      onResponse({ response }) {
        if (response.ok) {
          infra_store.$patch({
            is_captcha_validated: response.status == 200,
          });
        }
      },
      onResponseError({ response }) {},
    }
  );
}
</script>
