import type { ChatMessage } from "$lib/types";

declare global {
  var __MESSAGE_VIEWER_STORE__: {
    id: string,
    name?: string,
    description?: string,
    tags: {
      tag: string,
      messages: ChatMessage[],
      messagesAt: Date,
      response?: ChatMessage,
      responseAt?: Date,
      formatKeys?: Record<string, unknown>,
      schema?: Record<string, unknown>
    }[]
  }[];
}

export const store: {
  id: string,
  name?: string,
  description?: string,
  tags: {
    tag: string,
    messages: ChatMessage[],
    messagesAt: Date,
    response?: ChatMessage,
    responseAt?: Date,
    formatKeys?: Record<string, unknown>,
    schema?: Record<string, unknown>
  }[]
}[] =
  globalThis.__MESSAGE_VIEWER_STORE__ ?? (globalThis.__MESSAGE_VIEWER_STORE__ = new Array());
