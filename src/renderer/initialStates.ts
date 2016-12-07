import {ProcessingItems, ProcessingStatus} from "./state";

export const processingItems: ProcessingItems[] = [
    {
        id: "1",
        name: "Task1",
        configuration: "config1",
        startedTime: "12:00",
        status: ProcessingStatus[ProcessingStatus.DONE],
        elapsedTime: "1 min 37 s"
    },
    {
        id: "2",
        name: "Task2",
        configuration: "config2",
        startedTime: "12:00",
        status: ProcessingStatus[ProcessingStatus.CANCELLED],
        elapsedTime: "1 min 37 s"
    },
    {
        id: "3",
        name: "Task3",
        configuration: "config3",
        startedTime: "12:00",
        status: ProcessingStatus[ProcessingStatus.FAILED],
        elapsedTime: "1 min 37 s"
    }
];
