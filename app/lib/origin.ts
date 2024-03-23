import { FrameValidationData } from "@coinbase/onchainkit";

export function allowedOrigin(message?: FrameValidationData) {
  try {
    const url = new URL(message?.raw.action.url ?? "");
    const origin = url.hostname;
    return origin === process.env.ALLOWED_ORIGIN;
  } catch {
    return false;
  }
}
