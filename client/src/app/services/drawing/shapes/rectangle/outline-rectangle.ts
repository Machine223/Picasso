import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Rectangle } from '@app-services/drawing/shapes/rectangle/rectangle';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { BaseColors } from '../../../../../constants/constants';

export class OutlineRectangle extends Rectangle {
  strokeType: string;
  selectorOutline: boolean;

  constructor(protected colorsService: ColorsService, protected toolProperties: ToolPropertiesService, selectorOutline: boolean) {
    super(colorsService, toolProperties);
    this.fill = 'none';
    this.selectorOutline = selectorOutline;
    const halfTransparent = 0.5;
    this.stroke = this.colorsService.getColorAsRGBa(this.selectorOutline ? BaseColors.Black : BaseColors.Red, halfTransparent);
    this.strokeWidth = 1;
  }

  setRectangleSize(rectangle: Rectangle): void {
    this.startingPoint = rectangle.startingPoint;
    this.width = rectangle.width;
    this.height = rectangle.height;
  }

  getOrigin(): Coordinates {
    const rectangleOrigin = new Coordinates(0, 0);
    rectangleOrigin.xPosition = this.startingPoint.xPosition + this.width / 2;
    rectangleOrigin.yPosition = this.startingPoint.yPosition + this.height / 2;
    return rectangleOrigin;
  }
}
