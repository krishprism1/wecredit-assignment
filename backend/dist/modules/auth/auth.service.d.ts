import { AuthResponseData } from 'shared';
export declare class AuthService {
    register(email: string, password: string, fullName: string): Promise<AuthResponseData>;
    login(email: string, password: string): Promise<AuthResponseData>;
    logout(token: string): Promise<void>;
}
