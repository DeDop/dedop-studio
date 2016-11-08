import {expect} from 'chai';
import * as assert from 'assert';
import testUtils from './utils';

describe('application launch', function () {

    beforeEach(testUtils.beforeEach);
    afterEach(testUtils.afterEach);

    it('launches the application', function () {
        return this.app.client.windowHandles().then(function (response) {
            assert.equal(response.value.length, 1)
        }).browserWindow.getBounds().should.eventually.deep.equal({
            x: 460,
            y: 240,
            width: 1000,
            height: 600
        })
    });
    it('launches the application', function () {
        return this.app.client.windowHandles().then(function (response) {
            expect(response.value.length).to.equal(1);
        });
    });
    it('shows welcome to DeDop Studio text on screen after launch', function () {
        return this.app.client.getText('#title').then(function (text) {
            expect(text).to.equal('Welcome to DeDop Studio!');
        });
    });
});
