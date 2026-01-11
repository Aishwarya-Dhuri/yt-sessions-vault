export class BatchEnrollmentModel {
    enrollmentId: number;
    batchId: number;
    candidateId: number;
    enrollmentDate: string;
    isActive: boolean;
    fullName: string;
    batchName:string;

    constructor() {
        this.enrollmentId = 0;
        this.batchId = 0;
        this.candidateId = 0;
        this.enrollmentDate = '';
        this.isActive = false;
        this.fullName = '';
        this.batchName = '';

    }
}