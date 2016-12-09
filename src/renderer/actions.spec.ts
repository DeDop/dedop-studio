import * as assert from 'assert';
import * as actions from './actions';

describe("Test actions", function () {
    it('can update panel title', function () {
        let updatePanelTitleAction = actions.updatePanelTitle("New Title");
        assert.equal(updatePanelTitleAction.type, "UPDATE_PANEL_TITLE");
        assert.equal(updatePanelTitleAction.payload, "New Title");
    });
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
    it('can delete a configuration', function () {
        let deleteConfigAction = actions.deleteConfigName(1);
        assert.equal(deleteConfigAction.type, "DELETE_CONFIG_NAME");
        assert.equal(deleteConfigAction.payload, 1);
    });
    it('can update main tab selection', function () {
        let updateMainTabAction = actions.updateMainTab(3);
        assert.equal(updateMainTabAction.type, "UPDATE_MAIN_TAB");
        assert.equal(updateMainTabAction.payload, 3);
    });
});
