export module Translations {
    export class English {
        public static locale: any = {
            CANCEL_BTN: 'Cancel',
            OK_BTN: 'OK',
            FROM: 'from',
            TO: 'to',
            NAVIGATE: 'Start',
            CREATE_SCATTER: 'Create scatter with',
            EXPAND_ALL: 'Expand all',
            COLLAPSE_ALL: 'Collapse all',
            SELECT_ALL: 'Select all',
            DESELECT_ALL: 'Deselect all',
            CHOOSE_DROPDOWN: 'Choose...',
            ENABLE_LOCATION_FILTER: 'Enable location filter',
            DISABLE_LOCATION_FILTER: 'Disable location filter',
            SELECT_A_FEATURE: 'Select a feature',
            SELECT_FEATURE_FOR_WIDGET: 'Please select a feature to show the widget.',
            SELECT_FEATURE_FOR_STYLE: 'Please select a feature to before setting the style.',
            SELECT_LAYER_GROUP: 'Select Layers',
            SELECT_CATEGORY: 'Select Category',
            SELECT_PROPERTIES: 'Select Properties',
            NO_RELATIONS_FOUND: 'No relations can be shown for the selected feature. Either the zoom level is too low, there are too many features in the view or there are no relations defined.',
            BASESTYLES: 'Baselayers',
            MAP: 'Maps',
            MAP_LABEL: 'Map',
            TABLE_LABEL: 'Table',
            LAYERS: 'Layers',
            DIRECTORY: 'Available layers',
            CREATELAYER: 'Create new layer',
            ADDFEATURES: 'Add items',
            ADDTYPE: 'Add new type',
            DONE: 'done',
            FILTERS: 'Filters',
            FILTER_INFO: 'At the moment, no filters have been selected. In order to add a filter, click on an icon or area on the map, and click on the filter icon (<span class="fa fa-filter"></span>) in the right menu. This will create a filter for the selected property.',
            STYLES: 'Styles',
            STYLE_INFO: 'At the moment, no style has been selected. In order to add a style, click on an icon or area on the map, and click on the style icon (<span class="smallStyleIcon"></span>) in the right menu. This will create a filter for the selected property.',
            FEATURES: 'Features',
            LEGEND: 'Legend',
            SEARCH: 'Search',
            HIDE_PANEL: 'Hide this panel',
            EDIT_INDICATORS: 'Edit indicators',
            RELATED_FEATURES: 'Show related features',
            FEATURE_INFO: 'Show information about the selected feature',
            MAP_FEATURES: 'Map features',
            NEARBY_FEATURES: 'Nearby features',
            TOGGLE_MENU: 'Toggle menu visibility',
            DASHBOARD_SELECTION: 'Dashboard selection',
            SETTINGS: 'Settings',
            SPEEDS_TAOUFIK: 'speed colors Taoufik',
            SPEEDS_GOOGLEMAPS: 'speed colors Google Maps',
            VERWARMINGSSYSTEEM: 'Heating system',
            PERCENTAGES_V1: 'percentages v1',
            ORANGE_RED: 'orange - red',
            WHITE_RED: 'white - red',
            RED_WHITE: 'red - white',
            RED_WHITE_BLUE: 'red - white - blue',
            GREEN_RED: 'green - red',
            RED_GREEN: 'red - green',
            BLUE_RED: 'blue - red',
            RED_BLUE: 'red - blue',
            WHITE_BLUE: 'white - blue',
            BLUE_WHITE: 'blue - white',
            WHITE_GREEN: 'white - green',
            GREEN_WHITE: 'green - white',
            WHITE_ORANGE: 'white - orange',
            ORANGE_WHITE: 'orange - white',
            SAVE: 'save',
            CONFIG: 'config',
            EDIT: 'edit',
            APPLY: 'apply',
            REMOVE: 'remove',
            STATS: {
                COUNT: '#',
                COUNT_TOOLTIP: 'Count of selected items',
                MIN: 'min',
                MIN_TOOLTIP: 'Minimum of selected items',
                MAX: 'max',
                MAX_TOOLTIP: 'Maximum of selected items',
                MEAN: 'µ',
                MEAN_TOOLTIP: 'Mean of selected items',
                SUM: 'Σ',
                SUM_TOOLTIP: 'Sum of selected items'
            },
            UTILS: {
                FILTER: 'Use this property as filter',
                STYLE: 'Use this property as style',
                STATS: 'Show property statistics',
                CHART: 'Show property in time',
                CONFIG: 'Configure property'
            },
            EXPERTMODE: {
                BEGINNER: 'Novice',
                INTERMEDIATE: 'Intermediate',
                EXPERT: 'Expert',
                ADMIN: 'Admin',
                EXPLANATION: 'Select your expertise in order to unlock more functionality.'
            },
            LAYER_SERVICE: {
                RELOAD_PROJECT_TITLE: 'Data is reloaded',
                RELOAD_PROJECT_MSG: 'After switching the language, we need to reload all the map data. Our appologies for the inconvenience.'
            },
            HEATMAP: {
                NAME: 'Heatmaps',
                DESCRIPTION: '<h4>Heatmap</h4><p  style="text-align: left; margin-left:5px;">Heatmap highlights areas on the map that fulfill multiple selected criteria.',
                INFO: 'At the moment, no map layers are loaded that contain a heatmap. Open another map layer to use it.',
                INFO_EXPERT: 'At the moment, no map layers are loaded that contain a heatmap. Open another map layer to use it, or create a new heatmap using the wizard.',
                SHOW_FEATURE_MSG: 'Select a feature on the map to see the heatmap.',
                TOTAL_RESULT: 'Combined result',
                DELETE_MSG: 'Delete "{0}"',
                DELETE_MSG2: 'Are you sure?',
                EDITOR_TITLE: 'Heatmap Editor',
                MAIN_FEATURE: 'Select the main feature',
                PROPERTIES: 'Select the properties',
                INTENSITY_SCALE: 'Intensity scale',
                RESOLUTION: 'Resolution',
                TITLE: 'Title... *',
                TITLE_TAG: 'Title',
                SCALE_MIN_TITLE: '[Min. scale]',
                SCALE_MAX_TITLE: '[Max. scale]',
                MIN_MAX_ZOOM: 'Min./Max. zoom',
                AT_LOCATION_VALUE: '[Weight at location]',
                DISTANCE_MAX_VALUE: '[Ideal distance]',
                LOST_INTEREST_VALUE: '[Lost interest distance]',
                LINEAR_ASC_DESC: 'Linearly increasing, then decreasing function.',
                ADD_HEATMAP: 'Add a new heatmap.',
                DELETE_HEATMAP: 'Delete the heatmap.',
                EDIT_HEATMAP: 'Edit the heatmap.',
                EXPORT_HEATMAP: 'Export the heatmap.'
            },
            MCA: {
                NAME: 'Multi-Criteria Analysis (MCA)',
                DESCRIPTION: '<h4>Multi-Criteria Analysis</h4><p  style="text-align: left; margin-left:5px;">MCA, is a method that combines multiple properties of a feature on the map into a new property. It achieves this by:<ol><li>Scaling each property to a range between 0 (no value) and 1 (maximum value).</li><li>Weighing each property relative to the others, where a weight less than 0 indicates you wish to avoid it, 0 is ignored, and a value greater than 0 is prefered.</li></ol> In fact, it is a kind of linear regression.',
                INFO: 'At the moment, no map layers are loaded that contain a multi-criteria analysis. Open another map layer to see it.',
                INFO_EXPERT: 'At the moment, no map layers are loaded that contain a multi-criteria analysis. Open another map layer to use it, or create a new MCA using the wizard.',
                SHOW_FEATURE_MSG: 'Select a feature on the map to see the effects of the Multi-Criteria Analysis (MCA).',
                TOTAL_RESULT: 'Combined result',
                DELETE_MSG: 'Delete "{0}"',
                DELETE_MSG2: 'Are you sure?',
                HAS_CATEGORY: '  Has category? ',
                HAS_RANK: '  Include rank? ',
                EDITOR_TITLE: 'MCA Editor',
                MAIN_FEATURE: 'Select the main feature',
                PROPERTIES: 'Select the properties',
                INCLUDE_RANK: '  Show rank? ',
                RANK_TITLE: '[Rank title...]',
                TITLE: 'Title... *',
                CATEGORY_MSG: '[Category...]',
                TOGGLE_SPARKLINE: 'Show or hide bar charts and scoring function.',
                SCALE_MIN_TITLE: '[Min. scale]',
                SCALE_MAX_TITLE: '[Max. scale]',
                MIN_VALUE: '[Minimum (\u03BC-2\u03C3)]',
                MAX_VALUE: '[Maximum (\u03BC+2\u03C3)]',
                MIN_CUTOFF_VALUE: '[Ignore when below this value]',
                MAX_CUTOFF_VALUE: '[Ignore when above this value]',
                LINEAR: 'Linearly increasing function between min and max.',
                SIGMOID: 'Tangentially increasing function between min and max',
                GAUSSIAN: 'Normal distribution increasing function between min and max.',
                ADD_MCA: 'Add a new MCA.',
                DELETE_MCA: 'Delete the MCA.',
                EDIT_MCA: 'Edit the MCA.',
                SET_STYLE: 'Set style'
            },
            PROJECTSETTINGS: {
                TITLE: 'Project Settings',
                DESCRIPTION: 'Settings'
            },
            CHOOSE_CATEGORY: 'Choose category...',
            SHOW5: 'Show 5 items',
            SHOW10: 'Show 10 items',
            SHOW15: 'Show 15 items',
            SHOW20: 'Show 20 items',
            SHOW25: 'Show 25 items',
            SHOW30: 'Show 30 items',
            SHOW35: 'Show 35 items',
            SHOW40: 'Show 40 items',
            RISK_DIAGRAM_FOR: 'Risk-diagram for a ',
            SAVE_FEATURE_DEPENDENCIES: 'Save dependencies to the selected feature only',
            SAVE_FEATURETYPE_DEPENDENCIES: 'Save dependencies to all features of this type',
            SAVE_MARVEL: 'Save ',
            SAVE_EVERY_MARVEL: 'Save every ',
            MARVEL_WATER_LEVEL: 'Water level [m]',
            MARVEL_UPS_DURATION: 'UPS duration [mins]',
            MARVEL_FEATURE_DEP: 'Depends on',
            STATE: 'State',
            EVENT_INFO: 'Show a list of events',
            CLEAR_EVENTS: 'Clear event log'
        };
    }
}