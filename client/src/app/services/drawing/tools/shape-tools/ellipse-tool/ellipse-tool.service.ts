import { Injectable, RendererFactory2 } from '@angular/core';
import { AutoSaveService } from '@app-services/auto-save/auto-save.service';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';
import { Ellipse } from '@app-services/drawing/shapes/ellipse/ellipse';
import { OutlineRectangle } from '@app-services/drawing/shapes/rectangle/outline-rectangle';
import { RectangleToolService } from '@app-services/drawing/tools/shape-tools/rectangle-tool/rectangle-tool.service';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { ShapeToolService } from '../shape-tool.service';

@Injectable({
  providedIn: 'root'
})
export class EllipseToolService extends ShapeToolService {

  isEllipseStarted: boolean;
  isCreatingEllipse: boolean;
  ellipse: Ellipse;

  constructor(private toolProperties: ToolPropertiesService,
              private colorsService: ColorsService,
              private drawingElements: DrawingElementsService,
              public rectangleTool: RectangleToolService,
              private autoSave: AutoSaveService,
              rendererFactory: RendererFactory2) {
    super(rendererFactory);
    this.ellipse = new Ellipse(this.colorsService, this.toolProperties);
    this.isEllipseStarted = false;
    this.isCreatingEllipse = false;
  }

  onMouseDown(event: MouseEvent): void {
    this.rectangleTool.onMouseDown(event);
    this.isEllipseStarted = true;
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isEllipseStarted) { return; }
    this.isCreatingEllipse = true;
    this.rectangleTool.onMouseMove(event);
    this.ellipse.setEllipseParameters(this.rectangleTool.rectangle);
    const ellipseElement = this.svgElementCreator.createEllipse(this.ellipse);
    this.drawingElements.temporaryRenderer.next(ellipseElement);

    const outlineRectangle = new OutlineRectangle(this.colorsService, this.toolProperties, false);
    outlineRectangle.setRectangleSize(this.rectangleTool.rectangle);
    const outlineRectangleElement = this.svgElementCreator.createRectangle(outlineRectangle);
    this.drawingElements.cursorElement.next(outlineRectangleElement);
  }

  finalizeShape(): void {
    this.rectangleTool.isRectangleStarted = false;
    this.isEllipseStarted = false;
    if (this.isCreatingEllipse) {
      this.autoSave.save(true);
    } else {
      return;
    }
    this.isCreatingEllipse = false;
    const ellipseElement = this.svgElementCreator.createEllipse(this.ellipse);
    this.drawingElements.addCompletedSVGToDrawing(ellipseElement);
  }

  activateSquare(isActivate: boolean): void {
    this.rectangleTool.isSquare = isActivate;
    if (this.rectangleTool.lastMouseMove) {
      this.onMouseMove(this.rectangleTool.lastMouseMove);
    }
  }
}
