import { RendererFactory2 } from '@angular/core';
import { PaintBucketPath } from '@app-services/drawing/paths/paint-bucket-path';
import { SVGElementCreator } from './svg-element-creator';

export class PaintBucketElementCreator extends SVGElementCreator {
  constructor(protected rendererFactory: RendererFactory2) {
    super(rendererFactory);
  }

  createPath(path: PaintBucketPath, textureType?: number): SVGElement {
    const svgPath = super.createPath(path);
    this.renderer.setAttribute(svgPath, 'fill', path.fill);
    this.renderer.setAttribute(svgPath, 'fill-rule', 'evenodd');
    return svgPath;
  }
}
