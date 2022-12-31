import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Rectangle } from '@app-services/drawing/shapes/rectangle/rectangle';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';

const MOCK_COORDINATES = 10;
const MOCK_DEFAULT_VALUE = 10;

export class MockRectangle extends Rectangle {
    constructor(colorsService: ColorsService, toolProperties: ToolPropertiesService) {
        super(colorsService, toolProperties);
        this.startingPoint = new Coordinates(MOCK_COORDINATES, MOCK_COORDINATES);
        this.stroke = 'Contour';
        this.width = MOCK_DEFAULT_VALUE;
        this.height = MOCK_DEFAULT_VALUE;
        this.fill = 'black';
        this.stroke = 'black';
        this.strokeWidth = MOCK_DEFAULT_VALUE;
    }
}
