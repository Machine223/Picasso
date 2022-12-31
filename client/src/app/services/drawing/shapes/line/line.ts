import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { Junctions } from '../../../../../constants/constants';
import { Shape } from '../shape';

export class Line extends Shape {
  initialPoint: Coordinates;
  endingPoint: Coordinates;
  isWithDots: boolean;

  constructor(protected colorsService: ColorsService, protected toolProperties: ToolPropertiesService) {
    super(colorsService, toolProperties);
    this.isWithDots = this.toolProperties.junctionType === Junctions.Dotted;
    this.radius = this.toolProperties.dotDiameter / 2;
  }
}
