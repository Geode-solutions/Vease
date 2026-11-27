const CHAT_PROVIDER = { LLAMA: "llama", GATEWAY: "gateway" } as const;
type ChatProvider = (typeof CHAT_PROVIDER)[keyof typeof CHAT_PROVIDER];

const CLOUD_UNAVAILABLE_REASON = {
  SIGNED_OUT: "signed_out",
  NOT_ENTITLED: "not_entitled",
} as const;
type CloudUnavailableReason =
  (typeof CLOUD_UNAVAILABLE_REASON)[keyof typeof CLOUD_UNAVAILABLE_REASON];

export { CHAT_PROVIDER, CLOUD_UNAVAILABLE_REASON };
export type { ChatProvider, CloudUnavailableReason };
