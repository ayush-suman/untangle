export type Role = "system" | "user" | "assistant";
export type MessageContent = string | Record<string, unknown>;

export type ChatMessage = {
  role: Role;
  message: MessageContent;
};
