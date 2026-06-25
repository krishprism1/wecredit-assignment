import { EligibilityResult } from 'shared';
export declare class EligibilityService {
    runAssessment(applicationId: string): Promise<EligibilityResult>;
}
