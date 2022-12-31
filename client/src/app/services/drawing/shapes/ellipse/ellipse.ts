import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Rectangle } from '@app-services/drawing/shapes/rectangle/rectangle';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';

export class Ellipse extends Rectangle {
  centerPoint: Coordinates;
  tempStrokeWidth: number;
  xRadius: number;
  yRadius: number;

  constructor(protected colorsService: ColorsService, protected toolProperties: ToolPropertiesService) {
    super(colorsService, toolProperties);
    this.centerPoint = new Coordinates(0, 0);
  }

  setEllipseParameters(rectangle: Rectangle): void {
    this.cloneRectangle(rectangle);
    this.setCenterPointCoordinates();
    this.defineRadiusFromStrokeWidth();
  }

  setCenterPointCoordinates(): void {
    this.centerPoint.xPosition = this.startingPoint.xPosition + this.width / 2;
    this.centerPoint.yPosition = this.startingPoint.yPosition + this.height / 2;
  }

  defineRadiusFromStrokeWidth(): void {
    if (this.height / 2 < this.strokeWidth || this.width / 2 < this.strokeWidth) {
      this.tempStrokeWidth = this.height < this.width ? (this.height / 2) : (this.width / 2);
    } else {
      this.tempStrokeWidth = this.strokeWidth;
    }
    this.setRadius();
  }

  setRadius(): void {
    this.xRadius = (this.width - this.tempStrokeWidth) / 2;
    this.yRadius = (this.height - this.tempStrokeWidth) / 2;
  }
}
