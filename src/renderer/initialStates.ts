import {
    ProcessingItem, ProcessingStatus, GlobalMetadata, ProcessConfigurations,
} from "./state";

export const processingItems: ProcessingItem[] = [
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

export const dummyInputL1aFiles: string[] = [
    "S6_P4_SIM_RAW_L1A__20190119T064000_20190119T064019_T01.nc",
    "S6_P4_SIM_RAW_L1A__20210929T064000_20210929T064019_T02.nc",
    "S6_P4_SIM_RAW_L1A__20210929T064000_20210929T064019_T03.nc",
    "S6_P4_SIM_RMC_L1A__20190119T064000_20190119T064019_T01.nc",
    "S6_P4_SIM_RMC_L1A__20210929T064000_20210929T064019_T02.nc",
    "S6_P4_SIM_RMC_L1A__20210929T064000_20210929T064019_T03.nc"
];

export const dummyGlobalMetadata: GlobalMetadata[] = [
    {
        id: "1",
        name: "name",
        type: "string",
        value: "S6_P4_SIM_RMC_L1A"
    },
    {
        id: "2",
        name: "sensing_start",
        type: "string",
        value: "2019-01-19T06:40:00"
    },
    {
        id: "3",
        name: "sensing_stop",
        type: "string",
        value: "2019-01-19T06:40:36"
    },
    {
        id: "4",
        name: "orbit_num",
        type: "int",
        value: "128"
    },
    {
        id: "5",
        name: "processing_centre",
        type: "string",
        value: "ESA ESRIN"
    }
];

export const defaultChdConfigurations: ProcessConfigurations = {
    "mean_sat_alt_chd": {
        "value": 1347000.0,
        "description": "Mean satellite altitude",
        "units": "m"
    },

    "N_samples_sar_chd": {
        "value": 128,
        "description": "Number of samples per each SAR pulse",
        "units": null
    },
    "N_ku_pulses_burst_chd": {
        "value": 64,
        "description": "Number of Ku-band pulses per burst",
        "units": null
    },

    "freq_ku_chd": {
        "value": 13575000000.0,
        "description": "Emitted frequency in Ku-band",
        "units": "Hz"
    },
    "pulse_length_chd": {
        "value": 0.000032,
        "description": "Pulse length",
        "units": "s"
    },
    "bw_ku_chd": {
        "value": 320000000.0,
        "description": "Ku-band bandwidth",
        "units": "Hz"
    },

    "power_tx_ant_ku_chd": {
        "value": 7.5,
        "description": "Antenna SSPA RF Peak Transmitted Power in Ku band",
        "units": "dB"
    },
    "antenna_gain_ku_chd": {
        "value": 42.1,
        "description": "Antenna gain for Ku-band",
        "units": "dB"
    },

    "uso_freq_nom_chd": {
        "value": 10e6,
        "description": "USO nominal frequency",
        "units": "Hz"
    },
    "alt_freq_multiplier_chd": {
        "value": 32,
        "description": "Factor to convert from USO frequency to altimeter frequency",
        "units": null
    },
    "prf_sar_chd": {
        "value": 17825.311,
        "description": "pulse repetition frequency",
        "units": "s"
    },
    "brf_sar_chd": {
        "value": 78.53069,
        "description": "burst repetition frequency",
        "units": "Hz"
    }
};

export const defaultCstConfigurations: ProcessConfigurations = {
    "semi_major_axis_cst": {
        "units": "m",
        "value": 6378137.0,
        "description": "Semi-major axis of WGS84 ellipsoid"
    },
    "semi_minor_axis_cst": {
        "units": "m",
        "value": 6356752.3142,
        "description": "Semi-minor axis of WGS84 ellipsoid"
    },
    "flat_coeff_cst": {
        "units": null,
        "value": 0.00335281067183084,
        "description": "Flattening coefficient of WGS84 ellipsoid"
    },
    "earth_radius_cst": {
        "units": "m",
        "value": 6378137.0,
        "description": "Earth Radius"
    },
    "pi_cst": {
        "units": null,
        "value": 3.1415926535897932,
        "description": "Pi number"
    },
    "c_cst": {
        "units": "m/s",
        "value": 299792458.0,
        "description": "Speed of light"
    },
    "sec_in_day_cst": {
        "units": "s",
        "value": 86400,
        "description": "Number of seconds in a day"
    }
};
