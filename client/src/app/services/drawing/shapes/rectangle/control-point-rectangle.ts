import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { CONTROL_POINT_SIZE } from 'constants/constants';
import { Rectangle } from './rectangle';

export class ControlPointRectangle extends Rectangle {

  constructor(protected colorsService: ColorsService, protected toolProperties: ToolPropertiesService) {
    super(colorsService, toolProperties);
    this.fill = 'black';
    this.stroke = 'blue';
    this.strokeWidth = 1;
    this.width = CONTROL_POINT_SIZE;
    this.height = CONTROL_POINT_SIZE;
  }
}
