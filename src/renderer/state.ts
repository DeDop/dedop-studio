export interface State {
    data: DataState;
    communication: CommunicationState;
    control: ControlState;
    session: SessionState;
    location: LocationState; // not used
}

export interface DataState {
}

export interface CommunicationState {
}

export interface ControlState {
    mainPanelTitle ?: string;
}

export interface SessionState {
}

export interface LocationState {
}

export enum ProcessingStatus {
    DONE,
    IN_PROGRESS,
    FAILED,
    CANCELLED
}

export interface ProcessingItem {
    id: string;
    name: string;
    configuration: string;
    startedTime: string;
    status: string;
    processingDuration: string;
}

export interface GlobalMetadata {
    id: string;
    name: string;
    type: string;
    value: string;
}
