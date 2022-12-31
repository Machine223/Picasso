import { RendererFactory2 } from '@angular/core';
import { Path } from '@app-services/drawing/paths/path';
import { SVGElementCreator } from './svg-element-creator';

export class SprayElementCreator extends SVGElementCreator {

  constructor(protected rendererFactory: RendererFactory2) {
    super(rendererFactory);
  }

  createPath(path: Path): SVGElement {
    const svgPath = this.renderer.createElement('path', 'svg');
    this.renderer.setAttribute(svgPath, 'fill', path.getColor());
    this.renderer.setAttribute(svgPath, 'd', path.currentPath);
    return svgPath;
  }
}
