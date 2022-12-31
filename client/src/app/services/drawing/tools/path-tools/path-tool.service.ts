import { Injectable, RendererFactory2 } from '@angular/core';
import { AutoSaveService } from '@app-services/auto-save/auto-save.service';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';
import { Path } from '@app-services/drawing/paths/path';
import { Shape } from '@app-services/drawing/shapes/shape';
import { PencilElementCreator } from 'class/svg-elements-creators/pencil-element-creator';
import { SVGElementCreator } from 'class/svg-elements-creators/svg-element-creator';
import { Coordinates } from '../coordinates';
import { ToolPropertiesService } from '../tool-properties.service';

@Injectable({
  providedIn: 'root'
})
export class PathToolService {
  path: Path;
  activatedDraw: boolean;
  isIn: boolean;
  isDrawing: boolean;
  svgElementCreator: SVGElementCreator;

  constructor(protected colorsService: ColorsService,
              protected toolPropertyService: ToolPropertiesService,
              protected drawingElements: DrawingElementsService,
              protected autoSave: AutoSaveService,
              rendererFactory: RendererFactory2) {
    this.activatedDraw = false;
    this.isIn = false;
    this.isDrawing = false;
    this.svgElementCreator = new PencilElementCreator(rendererFactory);
  }

  eventTypeDispatcher(event: MouseEvent): void {
    const mapTypeDispatcher  = new Map<string, () => void> ();
    mapTypeDispatcher.set('mousedown', () => this.onMouseDown(event));
    mapTypeDispatcher.set('mousemove', () => this.onMouseMove(event));
    mapTypeDispatcher.set('mouseup', () => this.onMouseUp(event));
    mapTypeDispatcher.set('mouseleave', () => this.onMouseLeave(event));
    mapTypeDispatcher.set('mouseenter', () => this.onMouseEnter());
    (mapTypeDispatcher.get(event.type) || (() => null))();
  }

  onMouseDown(event: MouseEvent): void  {
    this.isDrawing = true;
    this.path.currentPath = `M${event.offsetX} ${event.offsetY}`;
    const circle = new Shape(this.colorsService, this.toolPropertyService);
    circle.startingPoint = new Coordinates(event.offsetX, event.offsetY);
    const circleSvgElement = this.svgElementCreator.createCircle(circle, this.path.textureType);
    this.drawingElements.temporaryRenderer.next(circleSvgElement);
  }

  onMouseMove(event: MouseEvent): void  {
    if (this.isDrawing) {
      this.path.currentPath += ` L${event.offsetX} ${event.offsetY}`;
      const pathElement = this.svgElementCreator.createPath(this.path, this.path.textureType);
      this.drawingElements.temporaryRenderer.next(pathElement);
    }
  }

  onMouseUp(event: MouseEvent): void  {
    if (this.isDrawing) {
      this.isDrawing = false;
      const pathElement = this.svgElementCreator.finishElementWithParts();
      this.drawingElements.addCompletedSVGToDrawing(pathElement);
      this.autoSave.save(true);
    }
  }

  onMouseLeave(event: MouseEvent): void {
    if (this.isDrawing) {
      this.autoSave.save(true);
    }
    this.isIn = false;
    this.onMouseUp(event);
  }

  onMouseEnter(): void {
    this.isIn = true;
  }
}
