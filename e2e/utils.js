import electron from 'electron';
import { Application } from 'spectron';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

var beforeEach = function () {
    chai.should();
    chai.use(chaiAsPromised);

    this.timeout(10000);
    this.app = new Application({
        path: electron,
        args: ['app'],
        startTimeout: 10000,
        waitTimeout: 10000,
    });
    return this.app.start();
};

var afterEach = function () {
    this.timeout(10000);
    if (this.app && this.app.isRunning()) {
        return this.app.stop();
    }
};

export default {
    beforeEach: beforeEach,
    afterEach: afterEach,
};
