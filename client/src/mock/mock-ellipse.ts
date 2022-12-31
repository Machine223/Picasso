import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Ellipse } from '@app-services/drawing/shapes/ellipse/ellipse';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';

const MOCK_COORDINATES_X = 10;
const MOCK_COORDINATES_Y = 11;
const MOCK_DEFAULT_VALUE = 10;
const MOCK_DEFAULT_RADIUS_X = 4;
const MOCK_DEFAULT_RADIUS_Y = 9;
export class MockEllipse extends Ellipse {

    constructor(colorsService: ColorsService, toolProperties: ToolPropertiesService) {
        super(colorsService, toolProperties);
        this.centerPoint = new Coordinates(MOCK_COORDINATES_X, MOCK_COORDINATES_Y);
        this.xRadius = MOCK_DEFAULT_RADIUS_X;
        this.yRadius = MOCK_DEFAULT_RADIUS_Y;
        this.width = MOCK_DEFAULT_VALUE;
        this.height = MOCK_DEFAULT_VALUE;
        this.fill = 'black';
        this.stroke = 'black';
        this.tempStrokeWidth = MOCK_DEFAULT_VALUE;
    }
}
