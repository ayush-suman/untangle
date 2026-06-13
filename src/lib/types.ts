export type Role = "system" | "user" | "assistant";
export type MessageContent = string | Record<string, unknown>;

export type ChatMessage = {
  role: Role;
  message: MessageContent;
};

/** A tag's conversation: the request messages and the optional response. */
export type TagThread = {
  tag: string;
  messages: ChatMessage[];
  messagesAt: Date;
  response?: ChatMessage;
  responseAt?: Date;
  formatKeys?: Record<string, unknown>;
  schema?: Record<string, unknown>;
};

export type Session = {
  id: string;
  name?: string;
  description?: string;
  tags: TagThread[];
};
