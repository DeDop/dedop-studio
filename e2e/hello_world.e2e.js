import {expect} from 'chai';
import testUtils from './utils';

describe('application launch', function () {

    beforeEach(testUtils.beforeEach);
    afterEach(testUtils.afterEach);

    // TODO (hans-permana, 20161104: broken. Need to understand more on how mocha and chai are being used.
    // it('launches the application at the right size', function () {
    //     return this.app.client.windowHandles().then(function (response) {
    //         expect(response.value.length).to.equal(1);
    //     }).browserWindow.getBounds().should.eventually.deep.equal({
    //         x: 25,
    //         y: 35,
    //         width: 200,
    //         height: 100
    //     }).waitUntilTextExists('html', 'Hello')
    //         .getTitle().should.eventually.equal('Test')
    // });
    it('launches the application', function () {
        return this.app.client.windowHandles().then(function (response) {
            expect(response.value.length).to.equal(1);
        });
    });
    it('shows hello world text on screen after launch', function () {
        return this.app.client.getText('#title').then(function (text) {
            expect(text).to.equal('Welcome to DeDop Studio!');
        });
    });
});
