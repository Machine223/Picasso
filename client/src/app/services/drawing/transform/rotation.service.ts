import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { Selector } from 'class/selector/selector';
import { ROTATION_ANGLE } from 'constants/constants';
import { OutlineRectangle } from '../shapes/rectangle/outline-rectangle';

const SIDEBAR_WIDTH = 350;
const LOWER_ELEMENT_SPACING = 0;
const HIGHER_ELEMENT_SPACING = 34;

@Injectable({
  providedIn: 'root'
})
export class RotationService {
  renderer: Renderer2;
  isRotatingSelection: boolean;
  rotationAngle: number;
  outlineRectangleOrigin: Coordinates;
  selectedElementsOrigin: Map<SVGGElement, Coordinates>;

  isAltDown: boolean;
  isShiftDown: boolean;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.isRotatingSelection = false;
    this.rotationAngle = ROTATION_ANGLE.Normal;
    this.outlineRectangleOrigin = new Coordinates(0, 0);
    this.selectedElementsOrigin = new Map();
  }

  updateElementsOrigins(selector: Selector): void {
    this.selectedElementsOrigin.clear();
    selector.selectedElements.forEach((element) => {
      const originCoordinates: Coordinates = new Coordinates(
        (element.getBoundingClientRect() as DOMRect).x -
            LOWER_ELEMENT_SPACING -
            SIDEBAR_WIDTH +
            window.scrollX +
            (element.getBoundingClientRect() as DOMRect).width / 2,
        (element.getBoundingClientRect() as DOMRect).y +
            window.scrollY + HIGHER_ELEMENT_SPACING +
            (element.getBoundingClientRect() as DOMRect).height / 2,
      );
      this.selectedElementsOrigin.set(element, originCoordinates);
    });
  }

  updateRotationOrigins(selector: Selector, selectedRectangle: OutlineRectangle): void {
    this.updateElementsOrigins(selector);
    this.outlineRectangleOrigin = selectedRectangle.getOrigin();
  }

  rotateSelection(event: WheelEvent, selector: Selector): void {
    this.rotationAngle = event.deltaY < 0 ? Math.abs(this.rotationAngle) * -1 : Math.abs(this.rotationAngle);
    selector.selectedElements.forEach((element) => {
      if (this.isShiftDown) {
        this.applyRotation(element, this.selectedElementsOrigin.get(element) as Coordinates);
      } else {
        this.applyRotation(element, this.outlineRectangleOrigin);
      }
    });
    if (!this.isShiftDown) {
      this.updateElementsOrigins(selector);
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

  applyTransformation(element: SVGGElement, transform: SVGTransform): void {
    let svgElementMatrixForm = this.transformToMatrix(element);
    svgElementMatrixForm = transform.matrix.multiply(svgElementMatrixForm);
    element.transform.baseVal.clear();
    const svgElement: SVGSVGElement = this.renderer.createElement('svg', 'svg');
    element.transform.baseVal.appendItem(svgElement.createSVGTransformFromMatrix(svgElementMatrixForm));
  }

  applyRotation(element: SVGGElement, origin: Coordinates): void {
    this.prepareFirstTransform(element);
    const svgElement: SVGSVGElement = this.renderer.createElement('svg', 'svg');
    const rotateSVGTransform = svgElement.createSVGTransform();
    rotateSVGTransform.setRotate(this.rotationAngle, origin.xPosition, origin.yPosition);
    this.applyTransformation(element, rotateSVGTransform);
  }

}
