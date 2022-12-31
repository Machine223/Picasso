import { Injectable, RendererFactory2 } from '@angular/core';
import { AutoSaveService } from '@app-services/auto-save/auto-save.service';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';
import { SprayCan } from '@app-services/drawing/paths/spray-can/spray-can';
import { Shape } from '@app-services/drawing/shapes/shape';
import { SprayElementCreator } from 'class/svg-elements-creators/spray-element-creator';
import { VisualIndicatorElementCreator } from 'class/svg-elements-creators/visual-indicator-element-creator';
import { Coordinates } from '../../coordinates';
import { ToolPropertiesService } from '../../tool-properties.service';
import { PathToolService } from '../path-tool.service';

const DEFAULT_CURSOR_SPRAY_WIDTH = 4;

@Injectable({
  providedIn: 'root'
})

export class SprayCanToolService extends PathToolService  {
  sprayCan: SprayCan;
  cursorShape: Shape;
  visualIndicatorCreator: VisualIndicatorElementCreator;

  constructor(protected colorsService: ColorsService,
              protected toolPropertyService: ToolPropertiesService,
              protected drawingElements: DrawingElementsService,
              protected autoSave: AutoSaveService,
              rendererFactory: RendererFactory2) {
    super(colorsService, toolPropertyService, drawingElements, autoSave, rendererFactory);
    this.sprayCan = new SprayCan(colorsService, toolPropertyService);
    this.cursorShape = new Shape(colorsService, toolPropertyService);
    this.cursorShape.fill = 'none';
    this.cursorShape.stroke = 'grey';
    this.cursorShape.strokeWidth = DEFAULT_CURSOR_SPRAY_WIDTH;
    this.svgElementCreator = new SprayElementCreator(rendererFactory);
    this.visualIndicatorCreator = new VisualIndicatorElementCreator(rendererFactory);
  }

  onMouseDown(event: MouseEvent): void {
    this.isDrawing = true;
    this.generateSpray(event);
    const sprayElement = (this.svgElementCreator as SprayElementCreator).createPath(this.sprayCan);
    this.drawingElements.temporaryRenderer.next(sprayElement);
    this.setSprayTimer(event);
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isIn) { return; }
    this.sprayCan.circlePoint = new Coordinates(event.offsetX, event.offsetY);
    this.cursorShape.startingPoint = this.sprayCan.circlePoint;
    this.cursorShape.radius = this.sprayCan.getDotSprayDiameter();
    const cursorAddOnElement = this.visualIndicatorCreator.createCircle(this.cursorShape);
    this.drawingElements.cursorElement.next(cursorAddOnElement);
    if (this.isDrawing) {
      this.generateSpray(event);
      const sprayElement = this.svgElementCreator.createPath(this.sprayCan);
      this.drawingElements.temporaryRenderer.next(sprayElement);
      this.setSprayTimer(event);
    }
  }

  onMouseUp(event: MouseEvent): void {
    if (this.isDrawing) {
      this.isDrawing = false;
      const sprayElement = this.svgElementCreator.createPath(this.sprayCan);
      this.drawingElements.addCompletedSVGToDrawing(sprayElement);
      this.sprayCan.currentPath = '';
      clearInterval(this.sprayCan.interval);
      this.autoSave.save(true);
    }
  }

  onMouseLeave(event: MouseEvent): void {
    this.isIn = false;
    this.onMouseUp(event);
    this.removeCursor();
  }

  generateSpray(event: MouseEvent): void {
    for (let i = 0; i < this.sprayCan.densityDot; ++i) {
      const randomAngle = Math.random() * (2 * Math.PI);
      const randomRadius = Math.random() * this.sprayCan.jetRadius ;
      const x = Math.floor((event.offsetX) + randomRadius * Math.cos(randomAngle) - this.sprayCan.dotWidth / 2 );
      const y = Math.floor((event.offsetY) + randomRadius * Math.sin(randomAngle));
      const upperArc = ` a1 1 0 0 1 ${this.sprayCan.dotWidth} 0 `;
      const lowerArc = ` a1 1 0 0 1 -${this.sprayCan.dotWidth} 0 `;
      this.sprayCan.currentPath += `M${x} ${y}` + upperArc + lowerArc;
    }
  }

  setSprayTimer(event: MouseEvent): void {
    clearInterval(this.sprayCan.interval);
    this.sprayCan.interval = window.setInterval(() => {
      this.generateSpray(event);
      const sprayElement = this.svgElementCreator.createPath(this.sprayCan);
      this.drawingElements.temporaryRenderer.next(sprayElement);
    }, this.sprayCan.getDotSprayInterval());
  }

  removeCursor(): void {
    this.isDrawing = false;
    clearInterval(this.sprayCan.interval);
    const emptyCursor = this.visualIndicatorCreator.deleteCursor();
    this.drawingElements.cursorElement.next(emptyCursor);
  }
}
