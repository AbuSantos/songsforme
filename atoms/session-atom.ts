import { atom } from "recoil";

export interface UserSession {
  userId: string | undefined;
  userEmail: string;
  username: string;
}

export const isConnected = atom<UserSession | null>({
  key: "isConnected",
  default: null,
});
