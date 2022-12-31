import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { OutlineRectangle } from '@app-services/drawing/shapes/rectangle/outline-rectangle';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { BaseColors } from 'constants/constants';

export class DashedSelectorRectangle extends OutlineRectangle {

  strokeDashArray: number;

  constructor(protected colorsService: ColorsService, protected toolProperties: ToolPropertiesService) {
    super(colorsService, toolProperties, false);
    const dashArraySize = 5;
    const halfTransparent = 0.5;
    const veryTransparent = 0.2;
    this.fill = this.colorsService.getColorAsRGBa(BaseColors.Black, veryTransparent);
    this.stroke = this.colorsService.getColorAsRGBa(BaseColors.Black, halfTransparent);
    this.strokeWidth = 1;
    this.strokeDashArray = dashArraySize;
  }
}
