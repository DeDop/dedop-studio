export interface State {
    data: DataState;
    communication: CommunicationState;
    control: ControlState;
    session: SessionState;
    location: LocationState; // not used
}

export interface DataState {
    configurations: Configuration[];
    sourceFiles: SourceFile[];
    addedSourceFiles: SourceFile[];
}

export interface CommunicationState {
}

export interface ControlState {
    mainPanelTitle ?: string;
    selectedConfiguration ?: string;
    currentConfigurationTabPanel ?: number;
    selectedSourceFile ?: string;
    currentSourceFileDirectory ?: string;
    currentConfiguration ?: string;
    currentMainTabPanel ?: number;
    codeEditorActive ?: boolean;
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

export interface Configuration {
    id: string;
    name: string;
    lastUpdated: string;
    chd: ProcessConfigurations;
    cnf: ProcessConfigurations;
    cst: ProcessConfigurations;
}

export interface SourceFile {
    name: string;
    size: number;
    lastUpdated: string;
    globalMetadata: GlobalMetadata[];
}
