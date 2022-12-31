import { RendererFactory2 } from '@angular/core';
import { AutoSaveService } from '@app-services/auto-save/auto-save.service';
import { ControlPointRectangle } from '@app-services/drawing/shapes/rectangle/control-point-rectangle';
import { DashedSelectorRectangle } from '@app-services/drawing/shapes/rectangle/dashed-selector-rectangle';
import { Rectangle } from '@app-services/drawing/shapes/rectangle/rectangle';
import { RotationService } from '@app-services/drawing/transform/rotation.service';
import { TranslateService } from '@app-services/drawing/transform/translate.service';
import { SVGElementCreator } from './svg-element-creator';

export class SelectorElementCreator extends SVGElementCreator {
  lastSelector: SVGElement | null;
  translateService: TranslateService;
  rotationService: RotationService;

  constructor(protected autoSave: AutoSaveService, protected rendererFactory: RendererFactory2) {
    super(rendererFactory);
    this.translateService = new TranslateService(rendererFactory);
    this.rotationService = new RotationService(rendererFactory);
    this.lastSelector = null;
  }

  createSelectorRectangle(rectangleProperties: Rectangle): SVGGElement {
    const rectangle = super.createRectangle(rectangleProperties);
    this.renderer.appendChild(this.svgWrap, rectangle);
    this.lastSelector = this.svgWrap;
    this.svgWrap = this.renderer.createElement('g', 'svg');
    return this.lastSelector as SVGGElement;
  }

  createDashedSelectorRectangle(rectangleProperties: DashedSelectorRectangle): SVGElement {
    const rectangle = super.createRectangle(rectangleProperties);
    this.renderer.setAttribute(rectangle, 'stroke-dasharray', rectangleProperties.strokeDashArray.toString());
    this.renderer.setAttribute(rectangle, 'pointer-events', 'none');
    return rectangle;
  }

  createControlPointRectangle(controlPoint: ControlPointRectangle): void {
    const controlPointElement = super.createRectangle(controlPoint);
    this.renderer.appendChild(this.svgWrap, controlPointElement);
  }

  removeLastSelector(): void {
    if (this.lastSelector != null) {
      this.renderer.removeChild(this.svgWrap, this.lastSelector);
    }
  }
}
