
export class JwtPayload {
    name?: string;
    lastName?: string;
    email?: string;
    scopes: string[];
    accountId: string;
}