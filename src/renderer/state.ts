export interface State {
    data: DataState;
    communication: CommunicationState;
    control: ControlState;
    session: SessionState;
    location: LocationState; // not used
}

export interface DataState {
    chd: ProcessConfigurations;
    cnf: ProcessConfigurations;
    cst: ProcessConfigurations;
}

export interface CommunicationState {
}

export interface ControlState {
    mainPanelTitle ?: string;
    selectedConfiguration ?: string;
    currentConfiguration ?: string;
    currentMainTabPanel ?: number;
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

export interface ProcessConfigurations {
    [key: string]: ConfigurationItem
}

export interface ConfigurationItem {
    units: string,
    value: string|number|boolean,
    description: string
}

export interface ConfigurationFile {
    id: string;
    name: string;
    lastUpdated: string;
}
