import { Injectable, RendererFactory2 } from '@angular/core';
import { AutoSaveService } from '@app-services/auto-save/auto-save.service';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';
import { Rectangle } from '@app-services/drawing/shapes/rectangle/rectangle';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { ShapeToolService } from '../shape-tool.service';

@Injectable({
  providedIn: 'root'
})
export class RectangleToolService extends ShapeToolService {

  mouseStart: Coordinates;
  mouseOffset: Coordinates;
  lastMouseMove: MouseEvent;
  rectangle: Rectangle;
  isRectangleStarted: boolean;
  isSquare: boolean;

  constructor(private toolProperties: ToolPropertiesService,
              private colorsService: ColorsService,
              private drawingElements: DrawingElementsService,
              private autoSave: AutoSaveService,
              rendererFactory: RendererFactory2) {
    super(rendererFactory);
    this.isRectangleStarted = false;
    this.isSquare = false;
    this.rectangle = new Rectangle(this.colorsService, this.toolProperties);
  }

  eventTypeDispatcher(event: MouseEvent): void {
    const mapTypeDispatcher = new Map<string , () => void>();
    mapTypeDispatcher.set('mousedown', () => this.onMouseDown(event));
    mapTypeDispatcher.set('mousemove', () => this.onMouseMove(event));
    mapTypeDispatcher.set('mouseup', () => this.finalizeShape());
    mapTypeDispatcher.set('mouseleave', () => this.finalizeShape());
    (mapTypeDispatcher.get(event.type) || (() => null))();
  }

  onMouseDown(event: MouseEvent): void {
    this.rectangle = new Rectangle(this.colorsService, this.toolProperties);
    this.lastMouseMove = event;
    this.mouseStart = new Coordinates(event.offsetX, event.offsetY);
    this.mouseOffset = new Coordinates(0, 0);
    this.isRectangleStarted = true;
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isRectangleStarted) { return; }
    this.lastMouseMove = event;
    this.mouseOffset = new Coordinates(event.offsetX - this.mouseStart.xPosition, event.offsetY - this.mouseStart.yPosition);
    const size = this.getRectangleSize();
    const isXGreater = size.xPosition > size.yPosition;
    this.rectangle.startingPoint = this.startRectangle(isXGreater);
    this.setSize(size);
    const rectangleElement = this.svgElementCreator.createRectangle(this.rectangle);
    this.drawingElements.temporaryRenderer.next(rectangleElement);
  }

  setSize(size: Coordinates): void {
    if (this.isSquare) {
      this.rectangle.height = (size.xPosition < size.yPosition) ? size.yPosition : size.xPosition;
      this.rectangle.width = (size.xPosition < size.yPosition) ? size.yPosition : size.xPosition;
    } else {
      this.rectangle.height = size.yPosition;
      this.rectangle.width = size.xPosition;
    }
  }

  startRectangle(isXGreater: boolean): Coordinates {
    const topLeft = new Coordinates(0, 0);
    const tempOffset = this.mouseOffset;
    const size = this.getRectangleSize();
    if (this.isSquare) {
      if (isXGreater) {
        tempOffset.yPosition = tempOffset.yPosition >= 0 ?
          size.xPosition : - size.xPosition;
      } else {
        tempOffset.xPosition = tempOffset.xPosition >= 0 ?
          size.yPosition : - size.yPosition;
      }
    }
    topLeft.xPosition = this.mouseOffset.xPosition >= 0 ?
      this.mouseStart.xPosition : (this.mouseStart.xPosition + tempOffset.xPosition);
    topLeft.yPosition = this.mouseOffset.yPosition >= 0 ?
      this.mouseStart.yPosition : (this.mouseStart.yPosition + tempOffset.yPosition);
    return topLeft;
  }

  getRectangleSize(): Coordinates {
    return new Coordinates(Math.abs(this.mouseOffset.xPosition), Math.abs(this.mouseOffset.yPosition));
  }

  finalizeShape(): void {
    if (this.isRectangleStarted && this.rectangle.height) {
      const rectangleElement = this.svgElementCreator.createRectangle(this.rectangle);
      this.drawingElements.addCompletedSVGToDrawing(rectangleElement);
      this.autoSave.save(true);
    }
    this.isRectangleStarted = false;
  }

  activateSquare(isActivated: boolean): void {
    this.isSquare = isActivated;
    if (this.lastMouseMove) {
      this.onMouseMove(this.lastMouseMove);
    }
  }
}
