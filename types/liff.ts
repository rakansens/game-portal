import { Liff } from '@line/liff';

declare global {
  interface Window {
    liff: Liff;
  }
}

export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
  email?: string;
}
