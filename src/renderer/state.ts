export enum ProcessingStatus {
    DONE,
    IN_PROGRESS,
    FAILED,
    CANCELLED
}

export interface ProcessingItems {
    id: string;
    name: string;
    configuration: string;
    startedTime: string;
    status: string;
    elapsedTime: string;
}
