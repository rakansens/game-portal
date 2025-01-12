export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export interface LiffUser {
  id: string;
  displayName: string;
  pictureUrl: string | null;
}

export interface LiffError {
  code: string;
  message: string;
}
