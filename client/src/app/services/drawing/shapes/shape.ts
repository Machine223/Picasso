import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { Coordinates } from '../tools/coordinates';

export class Shape {
  startingPoint: Coordinates;
  strokeWidth: number;
  stroke: string;
  fill: string;
  radius: number;

  constructor(protected colorsService: ColorsService, protected toolProperties: ToolPropertiesService) {
    this.strokeWidth = toolProperties.strokeWidth;
    this.radius = toolProperties.strokeWidth / 2;
    this.fill = this.getColor();
    this.stroke = '';
    this.startingPoint = new Coordinates(0, 0);
  }

  getColor(): string {
    return this.colorsService.getMainColorRGBA();
  }

  cloneShape(shape: Shape): void {
    this.startingPoint = shape.startingPoint;
    this.strokeWidth = shape.strokeWidth;
    this.stroke = shape.stroke;
    this.fill = shape.fill;
    this.radius = shape.radius;
  }
}
