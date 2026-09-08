// Third party imports
import { useChat } from "@ai-sdk/vue";
import { DefaultChatTransport } from "ai";

export function useVeaseChat() {
  const { messages, sendMessage, status, error, stop, clearError } = useChat({
    transport: new DefaultChatTransport({ api: "/api/llm/chat" }),
  });

  return { messages, sendMessage, status, error, stop, clearError };
}
