export interface LineUser {
  id: string;
  displayName: string;
  pictureUrl: string;
  statusMessage?: string;
  email?: string;
  isBlocked: boolean;
  registeredAt: string;
  lastLoginAt: string;
}
