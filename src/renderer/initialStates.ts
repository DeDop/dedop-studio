import {
    ProcessingItem, ProcessingStatus, GlobalMetadata, ProcessConfigurations, ConfigurationFile, ControlState, DataState,
    SourceFile,
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

export const dummyInputL1aFiles: SourceFile[] = [
    {
        name: "S6_P4_SIM_RAW_L1A__20190119T064000_20190119T064019_T01.nc",
        size: 100,
        lastUpdated: "09/12/2016 08:01:22"
    },
    {
        name: "S6_P4_SIM_RAW_L1A__20210929T064000_20210929T064019_T02.nc",
        size: 200,
        lastUpdated: "10/12/2016 08:01:22"
    },
    {
        name: "S6_P4_SIM_RAW_L1A__20210929T064000_20210929T064019_T03.nc",
        size: 300,
        lastUpdated: "11/12/2016 08:01:22"
    },
    {
        name: "S6_P4_SIM_RMC_L1A__20190119T064000_20190119T064019_T01.nc",
        size: 400,
        lastUpdated: "12/12/2016 08:01:22"
    },
    {
        name: "S6_P4_SIM_RMC_L1A__20210929T064000_20210929T064019_T02.nc",
        size: 500,
        lastUpdated: "13/12/2016 08:01:22"
    },
    {
        name: "S6_P4_SIM_RMC_L1A__20210929T064000_20210929T064019_T03.nc",
        size: 600,
        lastUpdated: "13/12/2016 08:01:22"
    }
];

const dummyConfigFileList: ConfigurationFile[] = [
    {
        id: "1",
        name: "Alternate Delay-Doppler Processing",
        lastUpdated: "09/12/2016 08:01:22"
    },
    {
        id: "2",
        name: "Modified Surface Locations",
        lastUpdated: "02/12/2016 18:22:13"
    },
    {
        id: "3",
        name: "Experimental",
        lastUpdated: "03/12/2016 13:44:23"
    },
    {
        id: "4",
        name: "Test",
        lastUpdated: "04/12/2016 11:18:40"
    }
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

const defaultChdConfigurations: ProcessConfigurations = {
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

const defaultCnfConfigurations: ProcessConfigurations = {
    "flag_cal2_correction_cnf": {
        "value": false,
        "units": "flag",
        "description": "Flag that activates the CAL2 corrections: Deactivated (false); Activated (true)"
    },
    "flag_uso_correction_cnf": {
        "value": true,
        "units": "flag",
        "description": "Flag that activates the USO correction: Deactivated (false); Activated (true)"
    },
    "flag_cal1_corrections_cnf": {
        "value": true,
        "units": "flag",
        "description": "Flag that activates the CAL1 corrections: Deactivated (false); Activated (true)"
    },
    "flag_cal1_intraburst_corrections_cnf": {
        "value": true,
        "units": "flag",
        "description": "Flag that activates the CAL1 intraburst corrections: Deactivated (false); Activated (true)"
    },
    "flag_surface_focusing_cnf": {
        "value": false,
        "units": "flag",
        "description": "Flag that activates the surface focussing: Deactivated (false); Activated (true)"
    },
    "surface_focusing_lat_cnf": {
        "value": null,
        "units": "Degrees North",
        "description": "Location of the surface focusing target (latitude)"
    },
    "surface_focusing_lon_cnf": {
        "value": null,
        "units": "Degrees East",
        "description": "Location of the surface focusing target (longitude)"
    },
    "surface_focusing_alt_cnf": {
        "value": null,
        "units": "m",
        "description": "Location of the surface focusing target (altitude)"
    },
    "flag_azimuth_processing_method_cnf": {
        "value": 0,
        "units": "flag",
        "description": "Flag that indicates the azimuth processing method: Surface dependant (0); Approximate (1); Exact (2)"
    },
    "flag_postphase_azimuth_processing_cnf": {
        "value": false,
        "units": "flag",
        "description": "Flag that enables the post-phase azimuth processing: Deactivated (false); Activated (true)"
    },
    "flag_azimuth_windowing_method_cnf": {
        "value": "none",
        "units": "flag",
        "description": "Flag the sets the azimuth windowing method: Disabled ('none'); Boxcar ('boxcar'); Hamming ('hamming'); Hanning ('hanning')"
    },
    "azimuth_window_width_cnf": {
        "value": 64,
        "units": "count",
        "description": "Width of Azimuth window (minimum value: 32, maximum value: 64)"
    },
    "flag_doppler_range_correction_cnf": {
        "value": false,
        "units": "flag",
        "description": "Flag that activates the Doppler range correction in the geometry corrections: Deactivated (false); Activated (true)"
    },
    "flag_slant_range_correction_cnf": {
        "value": true,
        "units": "flag",
        "description": "Flag that activates the slant range correction in the geometry corrections: Deactivated (false); Activated (true)"
    },
    "flag_window_delay_alignment_method_cnf": {
        "value": 0,
        "units": "flag",
        "description": "Flag to indicate the window delay alignment method: Surface dependent (0); Beam max integrated power (1); Satellite position above surface (2); Look angle 0 (3); Doppler angle 0 (4)"
    },
    "elevation_reference_value_cnf": {
        "value": null,
        "units": null,
        "description": "NOT YET IMPLEMENTED"
    },
    "flag_stack_masking_cnf": {
        "value": true,
        "units": "flag",
        "description": "Flag that activates the Stack Masking algorithm: Activated (true); Deactivated (false)"
    },
    "flag_remove_doppler_ambiguities_cnf": {
        "value": false,
        "units": "flag",
        "description": "Flag that indicates if the Doppler ambiguities will be removed: No (false); Yes (true)"
    },
    "ambiguity_mask_margin_cnf": {
        "value": null,
        "units": null,
        "description": "NOT YET IMPLEMENTED"
    },
    "flag_avoid_zeros_in_multilooking_cnf": {
        "value": true,
        "units": "flag",
        "description": "Flag that indicates if the samples set to zero in the beams will be avoided when averaging in multi-looking: No (false); Yes (true)"
    },
    "flag_surface_weighting_cnf": {
        "value": true,
        "units": "flag",
        "description": "Flag that activates the surface weighting: Deactivated (false); Activated (true)"
    },
    "flag_antenna_weighting_cnf": {
        "value": false,
        "units": "flag",
        "description": "Flag that activates the antenna weighting: Deactivated (false); Activated (true)"
    },
    "zp_fact_range_cnf": {
        "value": 2,
        "units": null,
        "description": "Zero padding factor used during range compression"
    },
    "N_looks_stack_cnf": {
        "value": 240,
        "units": null,
        "description": "Number of looks in 1 stack"
    }
};

const defaultCstConfigurations: ProcessConfigurations = {
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

export const initialControlState: ControlState = {
    mainPanelTitle: null,
    selectedConfiguration: null,
    currentConfiguration: "Alternate Delay-Doppler Processing",
    currentMainTabPanel: 0,
    codeEditorActive: false
};

export const initialDataState: DataState = {
    chd: defaultChdConfigurations,
    cnf: defaultCnfConfigurations,
    cst: defaultCstConfigurations,
    configurations: dummyConfigFileList,
    sourceFiles: dummyInputL1aFiles
};
