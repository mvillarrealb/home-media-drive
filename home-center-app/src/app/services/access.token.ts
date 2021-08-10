import { Action } from "./action";

export interface Payload {
    name: string;
    lastName: string;
    email: string;
}

export interface AccessToken {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    accountId: string;
    createdAt: Date;
    expiresAt: Date;
    payload: Payload;
    roles: Action[];
}
  