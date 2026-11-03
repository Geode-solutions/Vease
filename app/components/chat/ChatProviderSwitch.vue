<script setup lang="ts">
const CHAT_PROVIDER = { LLAMA: "llama", GATEWAY: "gateway" } as const;
type ChatProvider = (typeof CHAT_PROVIDER)[keyof typeof CHAT_PROVIDER];

interface Props {
  provider: ChatProvider;
  cloudUnavailableReason?: string;
  disabled?: boolean;
  loading?: boolean;
}

const {
  provider,
  cloudUnavailableReason = undefined,
  disabled = false,
  loading = false,
} = defineProps<Props>();

const emit = defineEmits<{ select: [provider: ChatProvider] }>();

const PROVIDERS = [
  {
    value: CHAT_PROVIDER.LLAMA,
    label: "Local",
    icon: "mdi-laptop",
    description:
      "Runs on this computer: private and available offline, but slower and less capable.",
  },
  {
    value: CHAT_PROVIDER.GATEWAY,
    label: "Cloud",
    icon: "mdi-cloud-outline",
    description: "Runs on a cloud AI service: faster and more capable, messages are sent online.",
  },
] as const;

const CLOUD_UNAVAILABLE_MESSAGES: Record<string, string> = {
  signed_out: "Sign in to use the cloud AI",
  not_entitled: "The cloud AI is restricted to authorized accounts",
};

const activeProvider = computed(
  () => PROVIDERS.find((option) => option.value === provider) ?? PROVIDERS[0],
);
const cloudUnavailableMessage = computed(() =>
  cloudUnavailableReason === undefined
    ? undefined
    : (CLOUD_UNAVAILABLE_MESSAGES[cloudUnavailableReason] ?? "The cloud AI is unavailable"),
);

function select(nextProvider: ChatProvider | undefined): void {
  if (nextProvider !== undefined && nextProvider !== provider) {
    emit("select", nextProvider);
  }
}
</script>

<template>
  <div class="provider-switch">
    <v-btn-toggle
      data-testid="chatProviderSwitch"
      :model-value="provider"
      mandatory
      density="compact"
      variant="outlined"
      divided
      rounded="lg"
      color="primary"
      class="w-100"
      :disabled="disabled"
      @update:model-value="select"
    >
      <v-btn
        v-for="option in PROVIDERS"
        :key="option.value"
        :value="option.value"
        :data-testid="`chatProvider-${option.value}`"
        :loading="loading && option.value !== provider"
        :disabled="option.value === CHAT_PROVIDER.GATEWAY && cloudUnavailableMessage !== undefined"
        class="flex-grow-1 text-none"
        size="small"
      >
        <v-icon size="16" class="mr-1">
          {{
            option.value === CHAT_PROVIDER.GATEWAY && cloudUnavailableMessage !== undefined
              ? "mdi-lock-outline"
              : option.icon
          }}
        </v-icon>
        {{ option.label }}
      </v-btn>
    </v-btn-toggle>
    <div class="text-caption text-medium-emphasis mt-1">
      {{ activeProvider.description }}
    </div>
    <div
      v-if="cloudUnavailableMessage !== undefined"
      data-testid="cloudUnavailableMessage"
      class="text-caption text-medium-emphasis d-flex align-center"
    >
      <v-icon size="12" class="mr-1">mdi-lock-outline</v-icon>
      {{ cloudUnavailableMessage }}
    </div>
  </div>
</template>
