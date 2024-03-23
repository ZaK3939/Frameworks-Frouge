import { FrameValidationData } from '@coinbase/onchainkit';

export function validButton(message?: FrameValidationData) {
    return message?.button && message?.button > 0 && message?.button < 5;
  }