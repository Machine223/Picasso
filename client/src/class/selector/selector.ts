import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { OutlineRectangle } from '@app-services/drawing/shapes/rectangle/outline-rectangle';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';

const MAX = 15000;
const SIDEBAR_WIDTH = 350;
const LOWER_ELEMENT_SPACING = 3;
const HIGHER_ELEMENT_SPACING = 5;
const ZONE_BORDER = 4;
const SELECTOR_RECTANGLE_WIDTH = 5;

export class Selector {

  selectedElements: SVGGElement[];
  selectedInvert: SVGGElement[];
  instanceInverted: SVGGElement[];
  scroll: number[];

  constructor(private colorsService: ColorsService,
              private toolProperties: ToolPropertiesService) {
    this.selectedElements = [];
    this.selectedInvert = [];
    this.instanceInverted = [];
    this.scroll = [0, 0];
  }

  applyReversion(): void {
    this.instanceInverted.forEach((svgElement) => {
      if (!this.selectedInvert.includes(svgElement) && this.selectedElements.includes(svgElement)) {
        this.selectedElements.splice(this.selectedElements.indexOf(svgElement), 1);
        this.instanceInverted.splice(this.instanceInverted.indexOf(svgElement), 1);
      } else if (!this.selectedInvert.includes(svgElement)) {
        this.selectedElements.push(svgElement);
        this.instanceInverted.splice(this.instanceInverted.indexOf(svgElement), 1);
      }
    });
  }

  applyInversion(): void {
    this.selectedInvert.forEach((svgElement) => {
      if (!this.instanceInverted.includes(svgElement) && this.selectedElements.includes(svgElement)) {
        this.selectedElements.splice(this.selectedElements.indexOf(svgElement), 1);
        this.instanceInverted.push(svgElement);
      } else if (!this.instanceInverted.includes(svgElement)) {
        this.selectedElements.push(svgElement);
        this.instanceInverted.push(svgElement);
      }
    });
  }

  selectClickTargeted(event: MouseEvent, isRightClick: boolean): void {
    let svgElement: SVGGElement = event.target as SVGGElement || event.relatedTarget;
    if (svgElement.getAttribute('id') === 'svgdrawing') { return; }
    svgElement = this.checkParent(svgElement);
    isRightClick ? this.selectedInvert.push(svgElement) : this.selectedElements.push(svgElement);
  }

  checkParent(svgElement: SVGGElement): SVGGElement {
    if (svgElement.parentElement !== null && svgElement.parentElement.localName === 'g') {
      return svgElement.parentNode as SVGGElement;
    }
    return svgElement;
  }

  checkChild(svgElement: SVGGElement): SVGGElement {
    if (svgElement.firstElementChild !== null && svgElement.localName === 'g') {
      return svgElement.firstElementChild as SVGGElement;
    }
    return svgElement;
  }

  setRectangleCoordinates(): OutlineRectangle {
    let leftMostPosition = MAX;
    let topMostPosition = MAX;
    let rightMostPosition = 0;
    let bottomMostPosition = 0;

    this.selectedElements.forEach((svgElement) => {
      const elementWidth = Number(this.checkChild(svgElement).getAttribute('stroke-width') || 0);
      if (svgElement.getBoundingClientRect().left - SIDEBAR_WIDTH - ZONE_BORDER - elementWidth / 2 < leftMostPosition) {
        leftMostPosition = svgElement.getBoundingClientRect().left - SIDEBAR_WIDTH - ZONE_BORDER - LOWER_ELEMENT_SPACING - elementWidth / 2;
      }
      if (svgElement.getBoundingClientRect().top - ZONE_BORDER - elementWidth / 2 < topMostPosition) {
        topMostPosition = svgElement.getBoundingClientRect().top - ZONE_BORDER - LOWER_ELEMENT_SPACING - elementWidth / 2;
      }
      if (svgElement.getBoundingClientRect().right - SIDEBAR_WIDTH - ZONE_BORDER + elementWidth / 2 > rightMostPosition) {
        rightMostPosition = svgElement.getBoundingClientRect().right - SIDEBAR_WIDTH - ZONE_BORDER
          + HIGHER_ELEMENT_SPACING + elementWidth / 2;
      }
      if (svgElement.getBoundingClientRect().bottom - ZONE_BORDER + elementWidth > bottomMostPosition) {
        bottomMostPosition = svgElement.getBoundingClientRect().bottom - ZONE_BORDER + HIGHER_ELEMENT_SPACING + elementWidth / 2;
      }
    });

    const selectorRectangle = new OutlineRectangle(this.colorsService, this.toolProperties, true);
    selectorRectangle.startingPoint = new Coordinates(leftMostPosition + this.scroll[0], topMostPosition + this.scroll[1]);
    selectorRectangle.width = rightMostPosition - leftMostPosition;
    selectorRectangle.height = bottomMostPosition - topMostPosition;
    selectorRectangle.strokeWidth = SELECTOR_RECTANGLE_WIDTH;
    return selectorRectangle;
  }

  checkElementLocation(targetElement: SVGGElement, sourceElement: SVGGElement): boolean {
    const elementWidth = Number(targetElement.getAttribute('stroke-width')) || 0;
    const leftCondition = targetElement.getBoundingClientRect().left - elementWidth / 2 > sourceElement.getBoundingClientRect().left;
    const topCondition = targetElement.getBoundingClientRect().top - elementWidth / 2 > sourceElement.getBoundingClientRect().top;
    const rightCondition = targetElement.getBoundingClientRect().right + elementWidth / 2 < sourceElement.getBoundingClientRect().right;
    const bottomCondition = targetElement.getBoundingClientRect().bottom + elementWidth / 2 < sourceElement.getBoundingClientRect().bottom;
    const insideCondition = this.checkInsideCondition(targetElement, sourceElement);
    return leftCondition || bottomCondition || rightCondition || topCondition || insideCondition;
  }

  checkInsideCondition(targetElement: SVGGElement, sourceElement: SVGGElement): boolean {
    const leftCondition = targetElement.getBoundingClientRect().left < sourceElement.getBoundingClientRect().left;
    const topCondition = targetElement.getBoundingClientRect().top < sourceElement.getBoundingClientRect().top;
    const rightCondition = targetElement.getBoundingClientRect().right > sourceElement.getBoundingClientRect().right;
    const bottomCondition = targetElement.getBoundingClientRect().bottom > sourceElement.getBoundingClientRect().bottom;
    return leftCondition && bottomCondition && rightCondition && topCondition;
  }

}
