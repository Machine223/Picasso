import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { Rectangle } from './rectangle';

export class EraserCursor extends Rectangle {

  constructor(
    protected colorsService: ColorsService,
    protected toolProperties: ToolPropertiesService) {
    super(colorsService, toolProperties);
    this.fill = 'white';
    this.strokeWidth = 1;
    this.stroke = 'black';
    this.height = this.toolProperties.eraserSize;
    this.width = this.toolProperties.eraserSize;
  }

  setCursorStartingPoint(event: MouseEvent): void {
    const xCoordinate = event.offsetX - this.width / 2;
    const yCoordinate = event.offsetY - this.height / 2;
    this.startingPoint = new Coordinates(xCoordinate, yCoordinate);
  }

  updateSize(): void {
    this.height = this.toolProperties.eraserSize;
    this.width = this.toolProperties.eraserSize;
  }
}
