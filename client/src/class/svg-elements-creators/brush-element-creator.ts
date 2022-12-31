import { RendererFactory2 } from '@angular/core';
import { Path } from '@app-services/drawing/paths/path';
import { Shape } from '@app-services/drawing/shapes/shape';
import { SVGElementCreator } from './svg-element-creator';

export class BrushElementCreator extends SVGElementCreator {

  constructor(protected rendererFactory: RendererFactory2) {
    super(rendererFactory);
  }

  createCircle(shapeProperties: Shape, textureType?: number): SVGElement {
    const circle = super.createCircle(shapeProperties);
    this.renderer.setAttribute(circle, 'filter', `url(#${textureType})`);
    this.renderer.appendChild(this.svgWrap, circle);
    this.lastTemporaryPart = circle;
    return this.svgWrap;
  }

  createPath(path: Path, textureType?: number): SVGElement {
    const svgPath = super.createPath(path);
    this.renderer.setAttribute(svgPath, 'filter', `url(#${textureType})`);
    this.renderer.appendChild(this.svgWrap, svgPath);
    this.lastTemporaryPart = svgPath;
    return this.svgWrap;
  }
}
