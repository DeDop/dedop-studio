import {WebAPIClient} from "./webapi/WebAPIClient";
import {JobProgress, JobStatus, JobFailure} from "./webapi/Job";

export interface State {
    data: DataState;
    communication: CommunicationState;
    control: ControlState;
    session: SessionState;
    location: LocationState; // not used
}

export interface DataState {
    processes: ProcessingItem[];
    workspaces?: Workspace[];
    appConfig: AppConfigState;
    version?: Version;
}

export interface CommunicationState {
    webAPIStatus: 'connecting'|'open'|'error'|'closed'|null;

    // A map that stores the current state of any tasks (e.g. data fetch jobs from remote API) given a jobId
    tasks: {[jobId: number]: TaskState;};
}

export interface ControlState {
    sourceFiles: SourceFile[];
    globalAttributes: GlobalAttribute[];
    mainPanelTitle?: string;
    currentMainTabPanel?: number;
    currentConfigurationTabPanel?: number;
    currentSourceFileDirectory?: string;
    currentOutputDirectory?: string;
    currentConfigurationName?: string;
    currentWorkspaceName?: string;
    selectedConfigurationName?: string;
    selectedSourceFileName?: string;
    selectedSourceType?: string;
    codeEditorActive?: boolean;
    processName?: string;
    currentToasterState?: ToasterState[]
}

export interface SessionState {
}

export interface LocationState {
}

export interface Version {
    configuration: ConfigurationVersion;
}

export interface ConfigurationVersion {
    chd: number,
    cnf: number,
    cst: number
}

export interface  ToasterState {
    key: string;
    taskIndex: number;
}

export interface WebAPIConfig {
    // Values read by main.ts from ./dedop-config.js
    command?: string;
    servicePort: number;
    serviceAddress: string;
    serviceFile?: string;
    processOptions?: Object;
    useMockService?: boolean;
    // Values computed in main.ts
    restUrl: string;
    webSocketUrl: string;
}

export interface AppConfigState {
    // Maybe put it into the communication state, see http://jamesknelson.com/5-types-react-application-state/
    // and see https://github.com/trbngr/react-example-pusher
    webAPIClient: WebAPIClient | null;
    webAPIConfig: WebAPIConfig;
}

export interface TaskState {
    title?: string;
    status: JobStatus;
    failure?: JobFailure;
    progress?: JobProgress;
}

export interface Workspace {
    name: string;
    directory: string;
    inputs?: SourceFile[];
    configs?: Configuration[];
}

export interface ProcessingItem {
    id: number;
    name: string;
    workspace: string;
    configuration: string;
    startedTime: string;
    status: string;
    processingDuration: string;
    message?: string;
}

export interface GlobalAttribute {
    name: string;
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
    name: string;
    lastUpdated?: string;
    chd?: ProcessConfigurations;
    cnf?: ProcessConfigurations;
    cst?: ProcessConfigurations;
    outputs?: string[];
}

export interface SourceFile {
    name: string;
    path: string;
    size: number;
    lastUpdated: string;
    globalMetadata: GlobalAttribute[];
}
