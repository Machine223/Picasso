import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { Selector } from './selector';

describe('Selector', () => {
  let colorsService: ColorsService;
  let toolProperties: ToolPropertiesService;
  let renderer: Renderer2;
  let selector: Selector;
  let element: Element;

  const updateGetBoundingRect = ((svgElement: SVGGElement) => {
    svgElement.getBoundingClientRect = (() => {
      return {
        width: Number(svgElement.getAttribute('width')),
        height: Number(svgElement.getAttribute('height')),
        top: Number(svgElement.getAttribute('y')),
        left: Number(svgElement.getAttribute('x')),
        bottom: Number(svgElement.getAttribute('y')) + Number(svgElement.getAttribute('height')),
        right: Number(svgElement.getAttribute('x')) + Number(svgElement.getAttribute('width')),
      };
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    colorsService = TestBed.get(ColorsService);
    toolProperties = TestBed.get(ToolPropertiesService);
    const rendererFactory = TestBed.get(RendererFactory2);
    renderer = rendererFactory.createRenderer(null, null);
    selector = new Selector(colorsService, toolProperties);
    element = document.createElementNS(document.documentElement.namespaceURI, 'rect');
    element.setAttribute('stroke-width', '10');
    element.setAttribute('x', '300');
    element.setAttribute('y', '300');
    element.setAttribute('width', '300');
    element.setAttribute('height', '300');
  });

  it('should create an instance', () => {
    expect(selector).toBeTruthy();
  });

  it('#applyReversion should revert elements that are in the instanceInverted array', () => {
    const svgElement = element as SVGGElement;
    updateGetBoundingRect(svgElement);
    selector.instanceInverted.push(svgElement);
    selector.applyReversion();
    expect(selector.selectedElements[0]).toBe(svgElement);
    expect(selector.instanceInverted[0]).toBeUndefined();

    selector.instanceInverted.push(svgElement);
    selector.selectedInvert.push(svgElement);
    selector.applyReversion();
    expect(selector.selectedElements[0]).toBe(svgElement);
    expect(selector.instanceInverted[0]).toBe(svgElement);
    selector.selectedInvert = [];
    selector.applyReversion();
    expect(selector.selectedElements[0]).toBeUndefined();
    expect(selector.instanceInverted[0]).toBeUndefined();
  });

  it('#applyInversion should invert elements that are in the selectedInvert array and add them to instanceInverted', () => {
    const svgElement = element as SVGGElement;
    updateGetBoundingRect(svgElement);
    selector.selectedInvert.push(svgElement);
    selector.applyInversion();
    expect(selector.selectedElements[0]).toBe(svgElement);
    expect(selector.instanceInverted[0]).toBe(svgElement);
    expect(selector.selectedInvert[0]).toBe(svgElement);
    selector.applyInversion();
    expect(selector.selectedElements[0]).toBe(svgElement);
    expect(selector.instanceInverted[0]).toBe(svgElement);
    expect(selector.selectedInvert[0]).toBe(svgElement);
    selector.instanceInverted = [];
    selector.applyInversion();
    expect(selector.selectedElements[0]).toBeUndefined();
    expect(selector.instanceInverted[0]).toBe(svgElement);
  });

  it('#selectClickTargeted should add an svgElement that is an event target to the appropriate array', () => {
    const svgElement = element as SVGGElement;
    updateGetBoundingRect(svgElement);
    const event = new MouseEvent('mouseup');
    event.initMouseEvent('mouseup', true, false, window, 0, 2, 2, 2, 2, false, false, false, false, 0, svgElement);
    selector.selectClickTargeted(event, false);
    expect(selector.selectedElements[0]).toEqual(svgElement);
    selector.selectClickTargeted(event, true);
    expect(selector.selectedInvert[0]).toEqual(svgElement);
    element.setAttribute('id', 'svgdrawing');
    selector.selectedElements = [];
    selector.selectClickTargeted(event, false);
    expect(selector.selectedElements[0]).toBeUndefined();
  });

  it('#checkParent should return an svgElement containing the parent of the parameter, if there is one', () => {
    const svgElement = element as SVGGElement;
    updateGetBoundingRect(svgElement);
    selector.selectedElements.push(svgElement);
    let svgElementOrParent = selector.checkParent(svgElement);
    expect(svgElementOrParent).toBe(svgElement);
    const svgParent: SVGGElement = renderer.createElement('g', 'svg');
    renderer.appendChild(svgParent, svgElement);
    svgElementOrParent = selector.checkParent(svgElement);
    expect(svgElementOrParent).toBe(svgParent);
  });

  it('#setRectangleCoords should return an outline rectangle of the selector rectangle', () => {
    updateGetBoundingRect(element as SVGGElement);
    selector.selectedElements.push(element as SVGGElement);
    const selectorRectangle = selector.setRectangleCoordinates();
    const zoneBorder = 4;
    const lowerElementSpacing = 3;
    expect(selectorRectangle.startingPoint.yPosition).toEqual(element.getBoundingClientRect().top - zoneBorder
      - lowerElementSpacing - Number(element.getAttribute('stroke-width')) / 2);
  });

  it('#checkElementLocation should return a boolean informing on whether the element should be selected', () => {
    const targetElement = element as SVGGElement;
    updateGetBoundingRect(targetElement);

    const sourceElement = document.createElementNS(document.documentElement.namespaceURI, 'rect');
    sourceElement.setAttribute('stroke-width', '5');
    sourceElement.setAttribute('x', '400');
    sourceElement.setAttribute('y', '400');
    sourceElement.setAttribute('width', '300');
    sourceElement.setAttribute('height', '300');
    updateGetBoundingRect(sourceElement as SVGGElement);

    let shouldBeSelected = selector.checkElementLocation(targetElement, sourceElement as SVGGElement);
    expect(shouldBeSelected).toBe(true);
    shouldBeSelected = selector.checkElementLocation(sourceElement as SVGGElement, sourceElement as SVGGElement);
    expect(shouldBeSelected).toBe(false);
  });
});
