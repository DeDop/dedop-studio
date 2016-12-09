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
});
