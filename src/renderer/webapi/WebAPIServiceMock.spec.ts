import {WebAPIServiceMock} from "./WebAPIServiceMock";
import {expect} from "chai";

describe('WebAPIServiceMock', function () {
    let serviceMock;

    beforeEach(function () {
        serviceMock = new WebAPIServiceMock();
    });

    it('can mock new_workspace action', function () {
        expect(serviceMock.new_workspace("new_workspace")).to.deep.equal({
            name: "new_workspace",
            inputs: [],
            configs: []
        });
        expect(serviceMock.mockWorkspaces).to.deep.equal([
            {
                name: "workspace1",
                inputs: [],
                configs: []
            },
            {
                name: "workspace2",
                inputs: [],
                configs: []
            },
            {
                name: "workspace3",
                inputs: [],
                configs: []
            },
            {
                name: "new_workspace",
                inputs: [],
                configs: []
            }
        ]);
    });
    it('can mock delete_workspace action', function () {
        serviceMock.new_workspace("test");
        expect(serviceMock.mockWorkspaces).to.deep.equal(
            [
                {
                    name: "workspace1",
                    inputs: [],
                    configs: []
                },
                {
                    name: "workspace2",
                    inputs: [],
                    configs: []
                },
                {
                    name: "workspace3",
                    inputs: [],
                    configs: []
                },
                {
                    name: "test",
                    inputs: [],
                    configs: []
                }
            ]
        );
        serviceMock.delete_workspace("test");
        expect(serviceMock.mockWorkspaces).to.deep.equal(
            [
                {
                    name: "workspace1",
                    inputs: [],
                    configs: []
                },
                {
                    name: "workspace2",
                    inputs: [],
                    configs: []
                },
                {
                    name: "workspace3",
                    inputs: [],
                    configs: []
                }
            ]
        );
    });
    it('can mock copy_workspace action', function () {
        expect(serviceMock.copy_workspace("old_workspace", "new_workspace")).to.deep.equal({
            name: "new_workspace"
        });
        expect(serviceMock.mockWorkspaces).to.deep.equal(
            [
                {
                    name: "workspace1",
                    inputs: [],
                    configs: []
                },
                {
                    name: "workspace2",
                    inputs: [],
                    configs: []
                },
                {
                    name: "workspace3",
                    inputs: [],
                    configs: []
                },
                {
                    name: "new_workspace",
                    inputs: [],
                    configs: []
                }
            ]
        );
    });
    it('can mock rename_workspace action', function () {
        serviceMock.rename_workspace("workspace3", "new_workspace");
        expect(serviceMock.mockWorkspaces).to.deep.equal(
            [
                {
                    name: "workspace1",
                    inputs: [],
                    configs: []
                },
                {
                    name: "workspace2",
                    inputs: [],
                    configs: []
                },
                {
                    name: "new_workspace",
                    inputs: [],
                    configs: []
                }
            ]
        );
    });
    it('can mock set_ and get_current_workspace action', function () {
        expect(serviceMock.get_current_workspace()).to.deep.equal({
            name: "workspace1",
            inputs: [],
            configs: []
        });
        expect(serviceMock.set_current_workspace("workspace3")).to.deep.equal({
            name: "workspace3",
            inputs: [],
            configs: []
        });
        expect(serviceMock.get_current_workspace()).to.deep.equal({
            name: "workspace3",
            inputs: [],
            configs: []
        });
    });
    it('can mock get_all_workspaces action', function () {
        expect(serviceMock.get_all_workspaces()).to.deep.equal({
                workspaces: [
                    "workspace1",
                    "workspace2",
                    "workspace3"
                ]
            }
        );
    });
});
