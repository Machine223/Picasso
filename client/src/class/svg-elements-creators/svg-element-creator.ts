import { Renderer2, RendererFactory2 } from '@angular/core';
import { Path } from '@app-services/drawing/paths/path';
import { Ellipse } from '@app-services/drawing/shapes/ellipse/ellipse';
import { Polygon } from '@app-services/drawing/shapes/polygon/polygon';
import { Rectangle } from '@app-services/drawing/shapes/rectangle/rectangle';
import { Shape } from '@app-services/drawing/shapes/shape';
import { Text } from '@app-services/drawing/text/text';

export class SVGElementCreator {
  renderer: Renderer2;
  currentParts: SVGElement[];
  svgWrap: SVGElement;
  lastTemporaryPart: SVGElement | null;

  constructor(protected rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.svgWrap = this.renderer.createElement('g', 'svg');
    this.lastTemporaryPart = null;
    this.currentParts = [];
  }

  createCircle(shapeProperties: Shape, textureType?: number): SVGElement {
    const circle: SVGElement = this.renderer.createElement('circle', 'svg');
    this.renderer.setAttribute(circle, 'r', shapeProperties.radius.toString());
    this.renderer.setAttribute(circle, 'fill', shapeProperties.fill);
    this.renderer.setAttribute(circle, 'cx', shapeProperties.startingPoint.xPosition.toString());
    this.renderer.setAttribute(circle, 'cy', shapeProperties.startingPoint.yPosition.toString());
    this.renderer.setAttribute(circle, 'stroke', shapeProperties.stroke);
    return circle;
  }

  createRectangle(rectangleProperties: Rectangle): SVGGElement {
    const rectangle = this.renderer.createElement('rect', 'svg');
    this.renderer.setAttribute(rectangle, 'x', rectangleProperties.startingPoint.xPosition.toString());
    this.renderer.setAttribute(rectangle, 'y', rectangleProperties.startingPoint.yPosition.toString());
    this.renderer.setAttribute(rectangle, 'width', rectangleProperties.width.toString());
    this.renderer.setAttribute(rectangle, 'height', rectangleProperties.height.toString());
    this.renderer.setAttribute(rectangle, 'fill', rectangleProperties.fill);
    this.renderer.setAttribute(rectangle, 'stroke', rectangleProperties.stroke);
    rectangleProperties.stroke === 'none' ?
      this.renderer.setAttribute(rectangle, 'stroke-width', '0') :
      this.renderer.setAttribute(rectangle, 'stroke-width', rectangleProperties.strokeWidth.toString());
    return rectangle;
  }

  createPath(path: Path, textureType?: number, fillColor?: string): SVGElement {
    this.removeLastTemporaryPart();
    const svgPath = this.renderer.createElement('path', 'svg');
    this.renderer.setAttribute(svgPath, 'fill', 'none');
    this.renderer.setAttribute(svgPath, 'stroke', path.getColor());
    this.renderer.setAttribute(svgPath, 'stroke-width', path.strokeWidth.toString());
    this.renderer.setAttribute(svgPath, 'stroke-linejoin', path.strokeLine);
    this.renderer.setAttribute(svgPath, 'stroke-linecap', path.strokeLine);
    this.renderer.setAttribute(svgPath, 'd', path.currentPath);
    return svgPath;
  }

  createEllipse(ellipseProperties: Ellipse): SVGElement {
    const ellipse = this.renderer.createElement('ellipse', 'svg');
    this.renderer.setAttribute(ellipse, 'cx', (ellipseProperties.centerPoint.xPosition).toString());
    this.renderer.setAttribute(ellipse, 'cy', (ellipseProperties.centerPoint.yPosition).toString());
    this.renderer.setAttribute(ellipse, 'rx', (ellipseProperties.xRadius).toString());
    this.renderer.setAttribute(ellipse, 'ry', (ellipseProperties.yRadius).toString());
    this.renderer.setAttribute(ellipse, 'fill', ellipseProperties.fill);
    this.renderer.setAttribute(ellipse, 'stroke', ellipseProperties.stroke);
    this.renderer.setAttribute(ellipse, 'stroke-width', (ellipseProperties.tempStrokeWidth).toString());
    return ellipse;
  }

  createPolygon(polygonProperties: Polygon): SVGElement {
    const polygon = this.renderer.createElement('polygon', 'svg');
    this.renderer.setAttribute(polygon, 'points', polygonProperties.points);
    this.renderer.setAttribute(polygon, 'fill', polygonProperties.fill);
    this.renderer.setAttribute(polygon, 'stroke', polygonProperties.stroke);
    this.renderer.setAttribute(polygon, 'stroke-width', (polygonProperties.tempStrokeWidth).toString());
    return polygon;
  }

  createText(textProperties: Text, line: number): SVGGElement {
    const text = this.renderer.createElement('text', 'svg');
    const body = this.renderer.createText(textProperties.textBody[line]);
    this.renderer.setAttribute(text, 'x', (textProperties.startingPoint.xPosition).toString());
    this.renderer.setAttribute(text, 'y', (textProperties.startingPoint.yPosition).toString());
    this.renderer.setStyle(text, 'font-size', textProperties.fontSize);
    this.renderer.setStyle(text, 'font-family', textProperties.fontFamily);
    this.renderer.setStyle(text, 'font-weight', textProperties.isBold ? 'bold' : 'normal');
    this.renderer.setStyle(text, 'font-style', textProperties.isItalics ? 'italic' : 'normal');
    this.renderer.setStyle(text, 'fill', textProperties.color);
    this.renderer.appendChild(text, body);
    return text;
  }

  createTextWrapper(textBodies: SVGElement[], textbox: SVGElement): SVGElement {
    const wrapper = this.renderer.createElement('g', 'svg');
    for (const child of textBodies) {
      this.renderer.appendChild(wrapper, child);
    }
    this.renderer.appendChild(wrapper, textbox);
    return wrapper;
  }

  removeLastTemporaryPart(): void {
    if (this.lastTemporaryPart != null) {
      this.renderer.removeChild(this.svgWrap, this.lastTemporaryPart);
    }
  }

  deleteElementWithParts(): SVGElement {
    this.currentParts = [];
    this.svgWrap = this.renderer.createElement('g', 'svg');
    return this.svgWrap;
  }

  finishElementWithParts(): SVGElement {
    const completedSvgWrap = this.svgWrap;
    this.svgWrap = this.renderer.createElement('g', 'svg');
    this.currentParts = [];
    this.lastTemporaryPart = null;
    return completedSvgWrap;
  }
}
