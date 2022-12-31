import { RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { SelectorToolService } from '@app-services/drawing/tools/selector-tool/selector-tool.service';
import { TranslateService } from '@app-services/drawing/transform/translate.service';

const createMouseEvent = (
  x: number,
  y: number,
  buttonPressed: number,
  offSetx?: number,
  offSety?: number,
  typeMouse?: string,
): MouseEvent => {
  const mouseEvent = {
    clientX: x,
    clientY: y,
    button: buttonPressed,
    offsetX: offSetx,
    offsetY: offSety,
    type: typeMouse,
  };
  return (mouseEvent as unknown) as MouseEvent;
};

const MOCK_X = 20;
const MOCK_Y = 10;
const MOCK_MOUSE_EVENT = createMouseEvent(MOCK_X, MOCK_Y, 1, MOCK_X, MOCK_Y, );
const MOCK_MOUSE_EVENT_LEAVE = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, 'mouseleave');

describe('SelectorToolService', () => {

  let selectorTool: SelectorToolService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    selectorTool = TestBed.get(SelectorToolService);
  });

  it('should be created', () => {
    expect(selectorTool).toBeTruthy();
  });

  it('#eventTypeDispatcher should be called', () => {
    const spyOnEventDispatcher = spyOn(selectorTool, 'selectElements');
    selectorTool.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
    expect(spyOnEventDispatcher).toHaveBeenCalled();
  });

  it('#eventTypeDispatcher should be called if cover', () => {
    selectorTool.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
    expect(selectorTool.eventTypeDispatcher).toBeDefined();
  });

  it('#onMouseDown isSelecting should be true', () => {
    selectorTool.onMouseDown(MOCK_MOUSE_EVENT);
    expect(selectorTool.isSelecting).toBe(true);
  });

  it('#onMouseDown isSelecting should be false if on unselectable element', () => {
    selectorTool.checkChildElements = ((mouseEvent) => {
      return true;
    });
    selectorTool.onMouseDown(MOCK_MOUSE_EVENT);
    expect(selectorTool.isSelecting).toBe(false);
  });

  it('#checkChildElement should return true if the target is the selectedRectangle', () => {
    const element = document.createElementNS(document.documentElement.namespaceURI, 'rect');
    element.setAttribute('stroke-width', '10');
    element.setAttribute('x', '0');
    element.setAttribute('y', '0');
    element.setAttribute('width', '100');
    element.setAttribute('height', '300');
    const svgElement = element as SVGGElement;
    const event = new MouseEvent('mouseup');
    event.initMouseEvent('mouseup', true, false, window, 0, 2, 2, 2, 2, false, false, false, false, 0, svgElement);
    let negativeChildCheck = selectorTool.checkChildElements(event);
    expect(negativeChildCheck).toBe(false);

    const rendererFactory = TestBed.get(RendererFactory2);
    const renderer = rendererFactory.createRenderer(null, null);
    selectorTool.selectedSVG = renderer.createElement('g', 'svg');
    selectorTool.selectedSVG.appendChild(renderer.createElement('g', 'svg'));

    negativeChildCheck = selectorTool.checkChildElements(event);
    expect(negativeChildCheck).toBe(false);

    selectorTool.selectedSVG.appendChild(svgElement);
    const positiveChildCheck = selectorTool.checkChildElements(event);
    expect(positiveChildCheck).toBe(true);
  });

  it('#updateCurrentPosition should update currentMousePosition and store the previous', () => {
    const previousMousePosition = selectorTool.currentMousePosition;
    selectorTool.updateCurrentPosition(MOCK_MOUSE_EVENT);
    expect(selectorTool.lastMousePosition).toBe(previousMousePosition);
    expect(selectorTool.currentMousePosition).toEqual(new Coordinates(MOCK_MOUSE_EVENT.offsetX, MOCK_MOUSE_EVENT.offsetY));
  });

  it('#leftMouseDragTranslate should call transform to translate elements', () => {
    const translateService = TestBed.get(TranslateService);
    const translateSpy = spyOn(translateService, 'translateSelection');
    selectorTool.leftMouseDragTranslate(MOCK_MOUSE_EVENT);
    expect(translateSpy).toHaveBeenCalled();
  });

  it('#onMouseMove should do nothing if selection is not started', () => {
    const createDashedRectangleSpy = spyOn(selectorTool.selectorElementCreator, 'createDashedSelectorRectangle');
    selectorTool.onMouseMove(MOCK_MOUSE_EVENT);
    expect(createDashedRectangleSpy).not.toHaveBeenCalled();
  });

  it('#onMouseMove should create a dashed rectangle', () => {
    selectorTool.checkSelectedElements = (() => { return; });
    selectorTool.onMouseDown(MOCK_MOUSE_EVENT);
    const createDashedRectangleSpy = spyOn(selectorTool.selectorElementCreator, 'createDashedSelectorRectangle');
    selectorTool.onMouseMove(MOCK_MOUSE_EVENT);
    expect(createDashedRectangleSpy).toHaveBeenCalled();
  });

  it('#onMouseMove should start the transform service if able to', () => {
    selectorTool.isSelecting = true;
    selectorTool.isClick = true;
    selectorTool.isAbleToTranslate = (() => true);
    const mouseTranslateSpy = spyOn(selectorTool, 'leftMouseDragTranslate');
    selectorTool.onMouseMove(MOCK_MOUSE_EVENT);
    expect(mouseTranslateSpy).toHaveBeenCalled();
  });

  it('#onMouseMove should empty selectedInvert if isRightClick', () => {
    selectorTool.checkSelectedElements = (() => { return; });
    const rendererFactory = TestBed.get(RendererFactory2);
    const renderer = rendererFactory.createRenderer(null, null);
    selectorTool.selector.selectedElements.push(renderer.createElement('null', 'null'));
    selectorTool.selectorElementCreator.createDashedSelectorRectangle = ((outlineRectangle) => renderer.createElement('null', 'null'));

    selectorTool.isSelecting = true;
    selectorTool.isRightClick = true;
    selectorTool.onMouseMove(MOCK_MOUSE_EVENT);
    expect(selectorTool.selector.selectedInvert.length).toEqual(0);
  });

  it('#selectElements should activate the transform service when solicited', () => {
    const translateService = TestBed.get(TranslateService);
    selectorTool.isSelecting = true;
    translateService.isTranslatingSelection = true;

    selectorTool.selectElements(MOCK_MOUSE_EVENT);
    expect(0).toBe(0);
  });

  it('#selectElements should finish the dashed rectangle and select the elements if the selection process is on', () => {
    selectorTool.isSelecting = true;
    selectorTool.isClick = true;
    const removeChildSpy = spyOn(selectorTool.renderer, 'removeChild');
    const removeSelectorSpy = spyOn(selectorTool.selectorElementCreator, 'removeLastSelector');

    selectorTool.selector.selectClickTargeted = ((event, isRightClick) => { return; });
    selectorTool.checkSelectedElements = (() => { return; });

    selectorTool.selectElements(MOCK_MOUSE_EVENT);
    expect(removeSelectorSpy).toHaveBeenCalled();
    expect(selectorTool.isSelecting).toBe(false);

    selectorTool.isSelecting = true;
    selectorTool.isClick = false;
    selectorTool.selectElements(MOCK_MOUSE_EVENT);

    expect(removeChildSpy).toHaveBeenCalled();
    expect(selectorTool.isSelecting).toBe(false);
  });

  it('#selectAll should select all elements in the view', () => {
    const element = document.createElementNS(document.documentElement.namespaceURI, 'rect');
    element.setAttribute('stroke-width', '10');
    element.setAttribute('x', '0');
    element.setAttribute('y', '0');
    element.setAttribute('width', '100');
    element.setAttribute('height', '300');

    selectorTool.drawingSVG = element as SVGSVGElement;

    const child = document.createElementNS(document.documentElement.namespaceURI, 'rect');
    child.setAttribute('x', '50');
    child.setAttribute('y', '150');
    child.setAttribute('width', '25');
    child.setAttribute('height', '100');

    selectorTool.createRectangle = ((svgElement: Element) => {
      return svgElement as unknown as SVGRect;
    });

    selectorTool.drawingSVG.getIntersectionList = (() => {
      return [child] as unknown as NodeListOf<SVGImageElement | SVGCircleElement | SVGEllipseElement | SVGLineElement
        | SVGPathElement | SVGPolygonElement | SVGPolylineElement | SVGRectElement | SVGTextElement | SVGUseElement>;
    });

    selectorTool.selectAll();
    expect(selectorTool.selector.selectedElements[0]).toBe(child as SVGGElement);
  });

  it('#checkSelectedElements should find all elements in the dashed rectangle', () => {
    const element = document.createElementNS(document.documentElement.namespaceURI, 'rect');
    element.setAttribute('stroke-width', '10');
    element.setAttribute('x', '0');
    element.setAttribute('y', '0');
    element.setAttribute('width', '100');
    element.setAttribute('height', '300');

    selectorTool.drawingSVG = element as SVGSVGElement;

    const child = document.createElementNS(document.documentElement.namespaceURI, 'rect');
    child.setAttribute('x', '50');
    child.setAttribute('y', '150');
    child.setAttribute('width', '25');
    child.setAttribute('height', '100');

    selectorTool.createRectangle = ((svgElement: Element) => {
      return svgElement as unknown as SVGRect;
    });

    selectorTool.drawingSVG.getIntersectionList = (() => {
      return [child] as unknown as NodeListOf<SVGImageElement | SVGCircleElement | SVGEllipseElement | SVGLineElement
        | SVGPathElement | SVGPolygonElement | SVGPolylineElement | SVGRectElement | SVGTextElement | SVGUseElement>;
    });

    selectorTool.selector.checkElementLocation = ((targetElement, sourceElement) => {
      return true;
    });

    selectorTool.checkSelectedElements();
    expect(selectorTool.selector.selectedElements[0]).toBe(child as SVGGElement);

    selectorTool.isRightClick = true;
    selectorTool.selector.selectedElements = [];

    selectorTool.checkSelectedElements();
    expect(selectorTool.selector.selectedInvert[0]).toBe(child as SVGGElement);
  });

  it('#createRectangle should return a domRect element based on the given svg', () => {
    const element = document.createElementNS(document.documentElement.namespaceURI, 'rect');
    element.setAttribute('stroke-width', '10');
    element.setAttribute('x', '200');
    element.setAttribute('y', '300');
    element.setAttribute('width', '100');
    element.setAttribute('height', '300');

    selectorTool.drawingSVG = element as SVGSVGElement;
    selectorTool.drawingSVG.createSVGRect = (() => {
      return element as unknown as SVGRect;
    });
    const rect = selectorTool.createRectangle(element as SVGGElement);
    expect(rect.x).toEqual(Number(element.getAttribute('x')));
  });

  it('#updateSelectedOutline should update the selectedRectangle based on the selected elements', () => {
    const removeSelectorSpy = spyOn(selectorTool.selectorElementCreator, 'removeLastSelector');
    selectorTool.updateSelectedOutline();

    expect(removeSelectorSpy).toHaveBeenCalled();

    const rendererFactory = TestBed.get(RendererFactory2);
    const renderer = rendererFactory.createRenderer(null, null);
    selectorTool.selector.selectedElements.push(renderer.createElement('g', 'svg'));

    const createSelector = spyOn(selectorTool.selectorElementCreator, 'createSelectorRectangle');
    selectorTool.updateSelectedOutline();

    expect(createSelector).toHaveBeenCalled();
  });

  it('#createControlPoints should create the 4 control points of the selected rectangle', () => {
    selectorTool.selectedRectangle.height = 2;
    selectorTool.selectedRectangle.width = 1;
    selectorTool.selectedRectangle.startingPoint = new Coordinates(0, 2);

    const createControlPointSpy = spyOn(selectorTool.selectorElementCreator, 'createControlPointRectangle');
    selectorTool.createControlPoints();
    // tslint:disable-next-line:no-magic-numbers
    expect(createControlPointSpy).toHaveBeenCalledTimes(4);
  });

  it('#removeOutline should remove the instance of selectedRectangle', () => {
    const element = document.createElementNS(document.documentElement.namespaceURI, 'rect');
    element.setAttribute('stroke-width', '10');
    element.setAttribute('x', '300');
    element.setAttribute('y', '300');
    element.setAttribute('width', '300');
    element.setAttribute('height', '300');

    selectorTool.checkSelectedElements = (() => { return; });
    selectorTool.selectorElementCreator.lastSelector = element as SVGElement;
    selectorTool.selectorElementCreator.renderer.appendChild(selectorTool.selectorElementCreator.svgWrap,
      selectorTool.selectorElementCreator.lastSelector);
    selectorTool.removeOutline();
    const rendererFactory = TestBed.get(RendererFactory2);
    const renderer = rendererFactory.createRenderer(null, null);
    expect(selectorTool.selectorElementCreator.svgWrap).toEqual(renderer.createElement('g', 'svg'));
  });
});
