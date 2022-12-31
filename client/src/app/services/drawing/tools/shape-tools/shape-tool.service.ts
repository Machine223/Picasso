import { Injectable, RendererFactory2 } from '@angular/core';
import { VisualIndicatorElementCreator } from 'class/svg-elements-creators/visual-indicator-element-creator';

@Injectable({
  providedIn: 'root'
})
export class ShapeToolService {

  svgElementCreator: VisualIndicatorElementCreator;

  constructor(protected rendererFactory: RendererFactory2) {
    this.svgElementCreator = new VisualIndicatorElementCreator(rendererFactory);
  }

  eventTypeDispatcher(event: MouseEvent): void {
    const mapTypeDispatcher  = new Map<string, () => void> ();
    mapTypeDispatcher.set('mousedown', () => this.onMouseDown(event));
    mapTypeDispatcher.set('mousemove', () => this.onMouseMove(event));
    mapTypeDispatcher.set('mouseup', () => this.finalizeShape());
    mapTypeDispatcher.set('mouseleave', () => this.finalizeShape());
    (mapTypeDispatcher.get(event.type) || (() => null))();
  }

  onMouseDown(event: MouseEvent): void {
    return;
  }

  onMouseMove(event: MouseEvent): void {
    return;
  }

  finalizeShape(): void {
    return;
  }
}
