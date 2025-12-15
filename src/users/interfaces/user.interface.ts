export interface User {
    id: string;
    username: string;
    email: string;
    password_hash: string;
    refresh_token_hash?: string | null;
}
