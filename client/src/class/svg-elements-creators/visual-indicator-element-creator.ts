import { RendererFactory2 } from '@angular/core';
import { Rectangle } from '@app-services/drawing/shapes/rectangle/rectangle';
import { Shape } from '@app-services/drawing/shapes/shape';
import { SVGElementCreator } from './svg-element-creator';

export class VisualIndicatorElementCreator extends SVGElementCreator {

  constructor(protected rendererFactory: RendererFactory2) {
    super(rendererFactory);
  }

  createCircle(shapeProperties: Shape): SVGElement {
    const circle = super.createCircle(shapeProperties);
    this.renderer.setAttribute(circle, 'stroke-width' , shapeProperties.strokeWidth.toString());
    return circle;
  }

  deleteCursor(): SVGElement {
    const emptyCursor = this.renderer.createElement('g', 'svg');
    return emptyCursor;
  }

  createEraserCursorAddOn(rectangleProperties: Rectangle): SVGElement {
    const rectangle = super.createRectangle(rectangleProperties);
    this.renderer.setAttribute(rectangle, 'pointer-events', 'none');
    this.renderer.setAttribute(rectangle, 'id', 'cursor');
    return rectangle;
  }

}
