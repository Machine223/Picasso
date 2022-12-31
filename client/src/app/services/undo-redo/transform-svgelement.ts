import { Renderer2, RendererFactory2 } from '@angular/core';
import { ICommand } from './icommand';

export class TransformSVGElement implements ICommand {
  selectedElements: SVGGElement[];
  elementsInitialTransform: [SVGGElement, DOMMatrix][];
  elementsLastTransform: [SVGGElement, DOMMatrix][];
  renderer: Renderer2;

  constructor(selectedElements: SVGGElement[], private rendererFactory: RendererFactory2) {
    this.selectedElements = selectedElements;
    this.elementsInitialTransform = [];
    this.elementsLastTransform = [];
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.getInitialTransform();
  }

  execute(): void {
    for (const element of this.elementsLastTransform) {
      element[0].transform.baseVal.clear();
      const svgElement: SVGSVGElement = this.renderer.createElement('svg', 'svg');
      element[0].transform.baseVal.appendItem(svgElement.createSVGTransformFromMatrix(element[1]));
    }
  }

  undo(): void {
    for (const element of this.elementsInitialTransform) {
      element[0].transform.baseVal.clear();
      const svgElement: SVGSVGElement = this.renderer.createElement('svg', 'svg');
      element[0].transform.baseVal.appendItem(svgElement.createSVGTransformFromMatrix(element[1]));
    }
  }

  getInitialTransform(): void {
    this.selectedElements.forEach(( element ) => {
      if (element.transform.baseVal.numberOfItems !== 0) {
        const matrix = element.transform.baseVal.consolidate().matrix;
        this.elementsInitialTransform.push([element, matrix]);
      } else {
        const svgElement: SVGSVGElement = this.renderer.createElement('svg', 'svg');
        const nullSVGTransform = svgElement.createSVGTransform();
        nullSVGTransform.setTranslate(0, 0);
        this.elementsInitialTransform.push([element, nullSVGTransform.matrix ]);
      }
    });
  }

  getLastTransform(): void {
    this.selectedElements.forEach(( element ) => {
      if (element.transform.baseVal.numberOfItems !== 0) {
        const matrix = element.transform.baseVal.consolidate().matrix;
        this.elementsLastTransform.push([element, matrix]);
      } else {
        const svgElement: SVGSVGElement = this.renderer.createElement('svg', 'svg');
        const nullSVGTransform = svgElement.createSVGTransform();
        nullSVGTransform.setTranslate(0, 0);
        this.elementsLastTransform.push([element, nullSVGTransform.matrix ]);
      }
    });
  }

}
