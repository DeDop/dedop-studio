[![Build Status](https://travis-ci.org/DeDop/dedop-studio.svg?branch=master)](https://travis-ci.org/DeDop/dedop-studio)
[![Build status](https://ci.appveyor.com/api/projects/status/sc73gbyll4jgheuc/branch/master?svg=true)](https://ci.appveyor.com/project/hans-permana/dedop-studio-umje6/branch/master)

# dedop-studio
DeDop Desktop Application

## How-to-start (using the installer)
Instructions on how to get the installer and how to do the installationis available [here](https://github.com/DeDop/dedop-installer#install-dedop-studio).

## How-to-start (using the source)

### Pre-requisites
* nodejs v6.9.1
* npm v3.10.8
* git
* dedop-core 

### How-to-install
* `git clone https://github.com/DeDop/dedop-studio.git`
* `cd dedop-studio`
* `npm install`
* create a dedop-config.js and add webAPIConfig entry to be able to start the web API. Below is a sample configuration. 

  ```
  module.exports = {
    webAPIConfig: {
        command: "C:\\Miniconda3\\envs\\pycharm-dedop\\Scripts\\dedop-webapi.exe",
        servicePort: 2999,
        processOptions: {}
    },
  };
  ```
  Information about each field can be found in `dedop-config.template.js`.
* `npm run compile`
* `npm start`
