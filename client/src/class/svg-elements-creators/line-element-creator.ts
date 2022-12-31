import { RendererFactory2 } from '@angular/core';
import { Line } from '@app-services/drawing/shapes/line/line';
import { Shape } from '@app-services/drawing/shapes/shape';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { SVGElementCreator } from './svg-element-creator';

export class LineElementCreator extends SVGElementCreator {

  constructor(protected rendererFactory: RendererFactory2) {
    super(rendererFactory);
  }

  createCircle(shapeProperties: Shape): SVGElement {
    const circle: SVGElement = super.createCircle(shapeProperties);
    this.renderer.appendChild(this.svgWrap, circle);
    this.currentParts.push(circle);
    return circle;
  }

  createLinePart(lineProperties: Line, isVisualHelp: boolean): SVGElement {
    this.removeLastTemporaryPart();
    const lineRenderer = this.renderer.createElement('line', 'svg');
    this.renderer.setAttribute(lineRenderer, 'x1', lineProperties.startingPoint.xPosition.toString());
    this.renderer.setAttribute(lineRenderer, 'x2', lineProperties.endingPoint.xPosition.toString());
    this.renderer.setAttribute(lineRenderer, 'y1', lineProperties.startingPoint.yPosition.toString());
    this.renderer.setAttribute(lineRenderer, 'y2', lineProperties.endingPoint.yPosition.toString());
    this.renderer.setAttribute(lineRenderer, 'stroke', lineProperties.getColor());
    this.renderer.setAttribute(lineRenderer, 'stroke-linecap', 'round');
    this.renderer.setAttribute(lineRenderer, 'stroke-width', lineProperties.strokeWidth.toString());
    this.renderer.appendChild(this.svgWrap, lineRenderer);
    if (isVisualHelp) {
      this.lastTemporaryPart = lineRenderer;
    } else {
      this.currentParts.push(lineRenderer);
    }
    return this.svgWrap;
  }

  deleteLineParts(nbrOfParts: number): Coordinates {
    let element: SVGElement | undefined;
    if (this.currentParts.length < nbrOfParts && this.lastTemporaryPart != null) {
      element = this.lastTemporaryPart;
    } else {
      if (nbrOfParts === 2) {
        const elementDot = this.currentParts.pop();
        this.renderer.removeChild(this.svgWrap, elementDot);
      }
      element = this.currentParts.pop();
      this.renderer.removeChild(this.svgWrap, element);
    }
    const endingCoordinates = new Coordinates(0, 0);
    endingCoordinates.xPosition = Number(element ? element.getAttribute('x1') : 0);
    endingCoordinates.yPosition = Number(element ? element.getAttribute('y1') : 0);
    return endingCoordinates;
  }

  finishElementWithParts(lineIsWithDots?: boolean): SVGElement {
    this.removeLastTemporaryPart();
    let lineElement: SVGElement;
    if (this.currentParts.length === 1 && lineIsWithDots) {
      lineElement = this.deleteElementWithParts();
    } else {
      lineElement = super.finishElementWithParts();
    }
    return lineElement;
  }
}
