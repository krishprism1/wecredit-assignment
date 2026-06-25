import { CreditScore } from 'shared';
export declare class CreditService {
    getLatestScore(userId: string): Promise<CreditScore | null>;
    generateScore(userId: string): Promise<CreditScore>;
}
