import type { ChatMessage } from "$lib/types";

declare global {
  var __MESSAGE_VIEWER_STORE__: Array<{ tag: string, messages: ChatMessage[], createdAt: Date, response?: ChatMessage, responseAt?: Date}> | undefined;
}

export const store: Array<{ tag: string, messages: ChatMessage[], createdAt: Date, response?: ChatMessage, responseAt?: Date }> =
  globalThis.__MESSAGE_VIEWER_STORE__ ?? (globalThis.__MESSAGE_VIEWER_STORE__ = new Array());
