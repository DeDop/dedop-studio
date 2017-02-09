import {WebAPIServiceMock} from "./WebAPIServiceMock";
import {expect} from "chai";

describe('WebAPIServiceMock', function () {
    let serviceMock;

    beforeEach(function () {
        serviceMock = new WebAPIServiceMock();
    });

    it('can mock test action', function () {
        expect(serviceMock.test_action("any_parameter")).to.deep.equal({
            status: "ok",
            content: "successful test",
            arg: "any_parameter"
        });

    });
});
