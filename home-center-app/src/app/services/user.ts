import { AccessToken } from "./access.token";
import { Action } from "./action";

export interface User {
    userId?: string;
    name: string;
    lastName: string;
    email: string;
    actions: Action[];
    token?: AccessToken;
    isSuperUser: boolean;
  }
  