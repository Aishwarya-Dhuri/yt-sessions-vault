export class BatchSessionModel {
    sessionId: number;
    durationInMinutes: number;
    displayOrder: number;
    topicName: string;
    sessionDate: string;
    batchName: string;
    topicDescription:string;
    youtubeVideoId:string;
    createdAt:string;
    updatedAt:string;

    constructor() {
        this.sessionId = 0;
        this.durationInMinutes = 0;
        this.displayOrder = 0;
        this.topicName = '';
        this.sessionDate = '';
        this.batchName = '';
        this.topicDescription = '';
        this.youtubeVideoId = '';
        this.createdAt = '';
        this.updatedAt = '';

    }
}