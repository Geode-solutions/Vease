// Third party imports
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/vue";

export function useVeaseChat(): Pick<
  ReturnType<typeof useChat>,
  "messages" | "sendMessage" | "status" | "error" | "stop" | "clearError"
> {
  const { messages, sendMessage, status, error, stop, clearError } = useChat({
    transport: new DefaultChatTransport({ api: "/api/llm/chat" }),
  });

  return { messages, sendMessage, status, error, stop, clearError };
}
