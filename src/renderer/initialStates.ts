import {ProcessingItems, ProcessingStatus} from "./state";

export const processingItems: ProcessingItems[] = [
    {
        id: "1",
        name: "Task1",
        configuration: "config1",
        startedTime: "05/01/15 12:00:12",
        status: ProcessingStatus[ProcessingStatus.DONE],
        processingDuration: "1 min 37 s"
    },
    {
        id: "2",
        name: "Task2",
        configuration: "config2",
        startedTime: "07/01/15 11:02:31",
        status: ProcessingStatus[ProcessingStatus.CANCELLED],
        processingDuration: "1 min 37 s"
    },
    {
        id: "3",
        name: "Task3",
        configuration: "config3",
        startedTime: "07/07/16 08:23:59",
        status: ProcessingStatus[ProcessingStatus.FAILED],
        processingDuration: "1 min 37 s"
    },
    {
        id: "4",
        name: "Task4",
        configuration: "Alternate Delay-Doppler Processing",
        startedTime: "07/07/16 18:33:00",
        status: ProcessingStatus[ProcessingStatus.FAILED],
        processingDuration: "11 min 37 s"
    },
    {
        id: "11",
        name: "Task11",
        configuration: "Modified Surface Locations",
        startedTime: "13/12/16 10:23:11",
        status: ProcessingStatus[ProcessingStatus.IN_PROGRESS],
        processingDuration: "1 min 37 s"
    }
];
