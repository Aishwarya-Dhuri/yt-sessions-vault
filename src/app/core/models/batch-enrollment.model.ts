export class BatchEnrollmentModel {
    enrollmentId: number;
    batchId: number;
    candidateId: number;
    enrollmentDate: Date;
    isActive: boolean;

    constructor() {
        this.enrollmentId = 0;
        this.batchId = 0;
        this.candidateId = 0;
        this.enrollmentDate = new Date();
         this.isActive = false;

    }
}