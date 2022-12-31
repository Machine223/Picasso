import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { OutlineRectangle } from '@app-services/drawing/shapes/rectangle/outline-rectangle';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { Selector } from 'class/selector/selector';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  renderer: Renderer2;
  isTranslatingSelection: boolean;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.isTranslatingSelection = false;
  }

  isInSelectionRectangle( selectedRectangle: OutlineRectangle, currentMousePosition: Coordinates): boolean {
    const leftCondition =  selectedRectangle.startingPoint.xPosition + window.scrollX < currentMousePosition.xPosition;
    const topCondition = selectedRectangle.startingPoint.yPosition < currentMousePosition.yPosition;
    const rightCondition = selectedRectangle.startingPoint.xPosition + selectedRectangle.width > currentMousePosition.xPosition;
    const bottomCondition = selectedRectangle.startingPoint.yPosition + selectedRectangle.height > currentMousePosition.yPosition;
    return leftCondition && topCondition && rightCondition && bottomCondition;
  }

  translateSelection(deltaX: number, deltaY: number, selector: Selector): void {
    for (const element of selector.selectedElements) {
      this.applyTranslate(deltaX, deltaY, element);
    }
  }

  translateSelectionSVGElement(deltaX: number, deltaY: number, svgElement: SVGGElement[]): void {
    for (const element of svgElement) {
      this.applyTranslate(deltaX, deltaY, element);
    }
  }

  prepareFirstTransform(element: SVGGElement): void {
    if (element.transform.baseVal.numberOfItems !== 0) { return; }
    const svgElement: SVGSVGElement = this.renderer.createElement('svg', 'svg');
    const nullSVGTransform = svgElement.createSVGTransform();
    nullSVGTransform.setTranslate(0, 0);
    element.transform.baseVal.appendItem(nullSVGTransform);
  }

  transformToMatrix(element: SVGGElement): DOMMatrix {
    return element.transform.baseVal.consolidate().matrix;
  }

  applyTransformation(element: SVGGElement, svgTransform: SVGTransform): void {
    let svgElementMatrixForm = this.transformToMatrix(element);
    svgElementMatrixForm = svgTransform.matrix.multiply(svgElementMatrixForm);
    element.transform.baseVal.clear();
    const svgElement: SVGSVGElement = this.renderer.createElement('svg', 'svg');
    element.transform.baseVal.appendItem(svgElement.createSVGTransformFromMatrix(svgElementMatrixForm));
  }

  applyTranslate(deltaX: number, deltaY: number, element: SVGGElement): void {
    this.prepareFirstTransform(element);
    const svgElement: SVGSVGElement = this.renderer.createElement('svg', 'svg');
    const translateSVGTransform = svgElement.createSVGTransform();
    translateSVGTransform.setTranslate(deltaX , deltaY);
    this.applyTransformation(element, translateSVGTransform);
  }
}
