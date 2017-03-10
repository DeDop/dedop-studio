import * as assert from "assert";
import * as actions from "./actions";

describe("Test actions", function () {
    it('can update configuration selection', function () {
        let updateConfigSelectionAction = actions.updateConfigSelection("Config2");
        assert.equal(updateConfigSelectionAction.type, "UPDATE_CONFIG_SELECTION");
        assert.equal(updateConfigSelectionAction.payload, "Config2");
    });
    it('can select current configuration', function () {
        let selectCurrentConfigAction = actions.selectCurrentConfig("newCurrentConfig");
        assert.equal(selectCurrentConfigAction.type, "SELECT_CURRENT_CONFIG");
        assert.equal(selectCurrentConfigAction.payload, "newCurrentConfig");
    });
    // commented out because of a new delete config implementation with async backend call
    // it('can delete a configuration', function () {
    //     let deleteConfigAction = actions.removeConfig("Config1");
    //     assert.equal(deleteConfigAction.type, "DELETE_CONFIG_NAME");
    //     assert.equal(deleteConfigAction.payload, "Config1");
    // });
    it('can update main tab selection', function () {
        let updateMainTabAction = actions.updateMainTab(3);
        assert.equal(updateMainTabAction.type, "UPDATE_MAIN_TAB");
        assert.equal(updateMainTabAction.payload, 3);
    });
});
