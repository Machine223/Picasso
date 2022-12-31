import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Line } from '@app-services/drawing/shapes/line/line';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';

const MOCK_COORDINATES_INIT = 10;
const MOCK_COORDINATES_START = 20;
const MOCK_COORDINATES_END = 30;
const MOCK_DEFAULT_VALUE_STROCK = 6;
const MOCK_DEFAULT_RADIUS = 5;

export class MockLine extends Line {

  constructor(colorsService: ColorsService, toolProperties: ToolPropertiesService) {
    super(colorsService, toolProperties);
    this.initialPoint = new Coordinates(MOCK_COORDINATES_INIT, MOCK_COORDINATES_INIT);
    this.startingPoint = new Coordinates(MOCK_COORDINATES_START, MOCK_COORDINATES_START);
    this.endingPoint = new Coordinates(MOCK_COORDINATES_END, MOCK_COORDINATES_END);
    this.strokeWidth = MOCK_DEFAULT_VALUE_STROCK;
    this.radius = MOCK_DEFAULT_RADIUS;
  }
}
