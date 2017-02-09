module.exports = {
    /**
     * DeDop WebAPI service configuration.
     */
    webAPIConfig: {
        /**
         * DeDop WebAPI service executable which points into DeDop's Python environment where dedop-core
         * has be installed, e.g. using "python setup.py develop" or "python setup.py install".
         * In the sample command below, dedop-webapi was installed under pyharm-dedop miniconda environment.
         */
        command: "C:\\Miniconda3\\envs\\pycharm-dedop\\Scripts\\dedop-webapi.exe",
        /**
         * The port used by the DeDop WebAPI service
         */
        servicePort: 9090,
        /**
         * The address used by the DeDop WebAPI service, use empty string to denote localhost (127.0.0.1)
         */
        serviceAddress: '',
        /**
         * The file in which DeDop WebAPI service stores its configuration while it is running.
         */
        serviceFile: 'dedop-webapi-info.json',
        /**
         * Additional process invocation options.
         * For details refer to https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
         */
        processOptions: {},

        /**
         * Ignore all setting above and use a mock service instead, useful for development.
         */
        useMockService: false,
    },

    /**
     * DeDop's user preferences file, default is ~/.dedop/dedop-prefs.json
     */
    prefsFile: null,

    /**
     * Set whether or not DevTools are initially opened.
     */
    devToolsOpened: true,

    /**
     * List of DevTools extensions. Add any of your DevTools extensions paths to this list.
     * For details refer to http://electron.atom.io/docs/tutorial/devtools-extension/
     */
    devToolsExtensions: [],
};
