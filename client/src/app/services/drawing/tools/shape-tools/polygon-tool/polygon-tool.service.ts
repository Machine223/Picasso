import { Injectable, RendererFactory2 } from '@angular/core';
import { AutoSaveService } from '@app-services/auto-save/auto-save.service';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';
import { Polygon } from '@app-services/drawing/shapes/polygon/polygon';
import { OutlineRectangle } from '@app-services/drawing/shapes/rectangle/outline-rectangle';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { RectangleToolService } from '@app-services/drawing/tools/shape-tools/rectangle-tool/rectangle-tool.service';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { ShapeToolService } from '../shape-tool.service';

@Injectable({
  providedIn: 'root'
})
export class PolygonToolService extends ShapeToolService {

  isPolygonStarted: boolean;
  isCreatingPolygon: boolean;
  polygon: Polygon;

  constructor(private toolProperties: ToolPropertiesService,
              private colorsService: ColorsService,
              private drawingElements: DrawingElementsService,
              public rectangleTool: RectangleToolService,
              private autoSave: AutoSaveService,
              rendererFactory: RendererFactory2) {
    super(rendererFactory);
    this.polygon = new Polygon(this.colorsService, this.toolProperties);
    this.isPolygonStarted = false;
    this.isCreatingPolygon = false;
  }

  onMouseDown(event: MouseEvent): void {
    this.rectangleTool.onMouseDown(event);
    this.isPolygonStarted = true;
    this.polygon.sides = this.toolProperties.sidesCount;
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isPolygonStarted) { return; }
    this.isCreatingPolygon = true;
    this.rectangleTool.onMouseMove(event);
    this.polygon.setPolygonParameters(this.rectangleTool.rectangle);
    this.fitRectangleSize();
    this.rectangleTool.rectangle.startingPoint = this.fitRectangle();
    const outlineRectangle = new OutlineRectangle(this.colorsService, this.toolProperties, false);
    outlineRectangle.setRectangleSize(this.rectangleTool.rectangle);
    const outlineRectangleElement = this.svgElementCreator.createRectangle(outlineRectangle);
    this.drawingElements.cursorElement.next(outlineRectangleElement);

    this.polygon.setPolygonParameters(this.rectangleTool.rectangle);
    const polygonElement = this.svgElementCreator.createPolygon(this.polygon);
    this.drawingElements.temporaryRenderer.next(polygonElement);
  }

  finalizeShape(): void {
    this.rectangleTool.isRectangleStarted = false;
    this.isPolygonStarted = false;
    if (this.isCreatingPolygon) {
      this.autoSave.save(true);
    } else {
      return;
    }
    this.isCreatingPolygon = false;
    const polygonElement = this.svgElementCreator.createPolygon(this.polygon);
    this.drawingElements.addCompletedSVGToDrawing(polygonElement);
  }

  fitRectangleSize(): void {
    if (this.polygon.isXRelativelyGreater()) {
      this.rectangleTool.rectangle.height = this.polygon.width * this.polygon.getSidesRatio();
    } else if (this.polygon.getSidesRatio()) {
      this.rectangleTool.rectangle.width = this.polygon.is4SidesMultiple() ? this.polygon.height :
        this.polygon.height / this.polygon.getSidesRatio();
    }
  }

  fitRectangle(): Coordinates {
    const topLeft = new Coordinates(0, 0);
    const tempOffset = this.rectangleTool.mouseOffset;
    if (this.polygon.isXRelativelyGreater()) {
      tempOffset.yPosition = tempOffset.yPosition >= 0 ?
        this.rectangleTool.rectangle.height : - this.rectangleTool.rectangle.height;
    } else {
      tempOffset.xPosition = tempOffset.xPosition >= 0 ?
        this.rectangleTool.rectangle.width : - this.rectangleTool.rectangle.width;
    }
    topLeft.xPosition = this.rectangleTool.mouseOffset.xPosition >= 0 ?
      this.rectangleTool.mouseStart.xPosition : this.rectangleTool.mouseStart.xPosition + tempOffset.xPosition;
    topLeft.yPosition = this.rectangleTool.mouseOffset.yPosition >= 0 ?
      this.rectangleTool.mouseStart.yPosition : this.rectangleTool.mouseStart.yPosition + tempOffset.yPosition;
    return topLeft;
  }
}
