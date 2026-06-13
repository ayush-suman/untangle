import type { Session } from "$lib/types";

declare global {
  var __MESSAGE_VIEWER_STORE__: Session[];
}

export const store: Session[] =
  globalThis.__MESSAGE_VIEWER_STORE__ ?? (globalThis.__MESSAGE_VIEWER_STORE__ = []);
