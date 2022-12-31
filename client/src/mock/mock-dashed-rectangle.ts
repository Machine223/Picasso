import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { DashedSelectorRectangle } from '@app-services/drawing/shapes/rectangle/dashed-selector-rectangle';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';

const MOCK_COORDINATES = 10;
const MOCK_DEFAULT_VALUE = 10;
const MOCK_DEFAULT_DASH_ARRAW = 5;

export class MockDashedRectangle extends DashedSelectorRectangle {
    constructor(colorsService: ColorsService, toolProperties: ToolPropertiesService) {
        super(colorsService, toolProperties);
        this.startingPoint = new Coordinates(MOCK_COORDINATES, MOCK_COORDINATES);
        this.stroke = 'Contour';
        this.width = MOCK_DEFAULT_VALUE;
        this.height = MOCK_DEFAULT_VALUE;
        this.fill = 'black';
        this.stroke = 'black';
        this.strokeWidth = MOCK_DEFAULT_VALUE;
        this.strokeDashArray = MOCK_DEFAULT_DASH_ARRAW;
    }
}
