import { Renderer2 } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { UndoRedoManagerService } from '@app-services/undo-redo/undo-redo-manager.service';
import { MOCK_MOUSE_EVENT } from '../../../../../mock/mock-mouse-event';
import { MockRenderer } from '../../../../../mock/mock-renderer';
import { EraserToolService } from './eraser-tool.service';

describe('EraserToolService', () => {
  let renderer: Renderer2;
  let service: EraserToolService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: Renderer2, useClass: MockRenderer}]
    });
    renderer = new MockRenderer();
    service = TestBed.get(EraserToolService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('#eventTypeDispatcher should call onMouseDown when detect on mouse down event', () => {
    const spy = spyOn(service, 'onMouseDown').and.callThrough();
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT);
    expect(spy).toHaveBeenCalled();
  });

  it('#eventTypeDispatcher should call onMouseMove when detect mouseMove event', () => {
    const event: MouseEvent = new Event('mousemove') as MouseEvent;
    const spy = spyOn(service, 'onMouseMove');
    service.eventTypeDispatcher(event);
    expect(spy).toHaveBeenCalled();
  });

  it('#eventTypeDispatcher should call onMouseUp when detect mouseup event', () => {
    const event: MouseEvent = new Event('mouseup') as MouseEvent;
    const spy = spyOn(service, 'onMouseUp');
    service.eventTypeDispatcher(event);
    expect(spy).toHaveBeenCalled();
  });

  it('#eventTypeDispatcher should call onMouseUp when detect mouseleave event', () => {
    const event: MouseEvent = new Event('mouseleave') as MouseEvent;
    const spy = spyOn(service, 'onMouseLeave');
    service.eventTypeDispatcher(event);
    expect(spy).toHaveBeenCalled();
  });

  it('#eventTypeDispatcher should call onMouseEnter when detect mouseenter event', () => {
    const event: MouseEvent = new Event('mouseenter') as MouseEvent;
    const spy = spyOn(service, 'onMouseEnter');
    service.eventTypeDispatcher(event);
    expect(spy).toHaveBeenCalled();
  });

  it('#eventTypeDispatcher should call nothing if it`s an other event ', () => {
    const event: MouseEvent = new MouseEvent('dblclick');
    const methodsArray: string[] = ['onMouseDown', 'onMouseMove', 'onMouseUp', 'onMouseLeave', 'onMouseEnter'];
    methodsArray.forEach((method) => {
      const spyOnMethod = spyOn(service, method as never).and.callThrough();
      service.eventTypeDispatcher(event);
      expect(spyOnMethod).not.toHaveBeenCalled();
    });
  });

  it('#onMouseDown should set isErasing to true', () => {
    service.isErasing = false;
    service.onMouseDown();
    expect(service.isErasing).toBe(true);
  });

  it('#onMouseEnter should call updateSize', () => {
    const spy = spyOn(service.cursor, 'updateSize');
    const svgDrawingMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgDrawingMock.setAttribute('heigth', '500');
    svgDrawingMock.setAttribute('width', '500');
    service.svgDrawing = svgDrawingMock as SVGSVGElement;
    const event: MouseEvent = new MouseEvent('mouseenter');
    service.onMouseEnter(event);
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseMove should call removeHighlight if isErasing is false ', () => {
    const spy = spyOn(service, 'removeHighlight');
    spyOn(service, 'getNodeTouchedByEraser').and.returnValue(null);
    service.isErasing = false;
    const event: MouseEvent = new MouseEvent('mousemove');
    service.onMouseMove(event);
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseMove should call highlightSVGElement if svgElementTouchedByEraser are SVGElements ', () => {
    const spy = spyOn(service, 'highlightSVGElement');
    const rectMock = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rectMock.setAttribute('heigth', '200');
    rectMock.setAttribute('width', '500');
    spyOn(service, 'getNodeTouchedByEraser').and.returnValue(rectMock as Node);
    service.isErasing = false;
    const event: MouseEvent = new MouseEvent('mousemove');
    service.onMouseMove(event);
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseUp should execute a command if onMouseUp event is detected',
    inject([UndoRedoManagerService], (undoRedo: UndoRedoManagerService) => {
      service.isErasing = true;
      const spy = spyOn(undoRedo, 'executeCommand');
      service.onMouseUp();
      expect(spy).toHaveBeenCalled();
    }));

  it('#onMouseLeave should set isErasing to false', () => {
    service.isErasing = true;
    service.onMouseLeave();
    expect(service.isErasing).toBe(false);
  });

  it('#getVerificationPointsTable should a return expected value', () => {
    const event: MouseEvent = new MouseEvent('mouseup');
    const offSetY = 10;
    const offSetX = 5;
    const eraserSize = 6;
    const expectedValue = 8;
    spyOnProperty(event, 'offsetY').and.returnValue(offSetY);
    spyOnProperty(event, 'offsetX').and.returnValue(offSetX);
    service.eraserSize = eraserSize;
    const verificationTable = service.getVerificationPointsTable(event);
    expect(verificationTable[0][0]).toEqual(expectedValue);

  });

  it('#getNodeTouchedByEraser should return null if listOfNearNodes is empty', () => {
    const event: MouseEvent = new MouseEvent('mouseup');
    const mockRectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    spyOn(service, 'getListOfTouchedNodes').and.returnValue(mockRectangle.childNodes);
    spyOn(service, 'getVerificationPointsTable').and.returnValue([]);
    const result = service.getNodeTouchedByEraser(event);
    expect(result).toBe(null);
  });

  it('#getNodeTouchedByEraser should return svgElement\'s fill is not equal to none', () => {
    const event: MouseEvent = new MouseEvent('mouseup');
    const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElementMock.setAttribute('height', '20');
    svgElementMock.setAttribute('width', '20');
    const mockRectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    mockRectangle.setAttribute('fill', 'black');
    mockRectangle.setAttribute('x1', '0');
    mockRectangle.setAttribute('y1', '0');
    mockRectangle.setAttribute('height', '20');
    mockRectangle.setAttribute('width', '20');
    svgElementMock.appendChild(mockRectangle);
    service.svgDrawing = svgElementMock as SVGSVGElement;
    spyOn(mockRectangle, 'isPointInFill').and.returnValue(true);
    const pointToVerify = 5;
    spyOn(service, 'getListOfTouchedNodes').and.returnValue(svgElementMock.childNodes);
    spyOn(service, 'getVerificationPointsTable').and.returnValue([[ pointToVerify, pointToVerify]]);
    const result = service.getNodeTouchedByEraser(event);
    expect(result).toEqual(mockRectangle);
  });

  it('#getNodeTouchedByEraser should return svgElement\'s fill is equal to none (else path)', () => {
    const event: MouseEvent = new MouseEvent('mouseup');
    const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElementMock.setAttribute('height', '20');
    svgElementMock.setAttribute('width', '20');
    const mockRectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    mockRectangle.setAttribute('fill', 'none');
    mockRectangle.setAttribute('x1', '0');
    mockRectangle.setAttribute('y1', '0');
    mockRectangle.setAttribute('height', '20');
    mockRectangle.setAttribute('width', '20');
    svgElementMock.appendChild(mockRectangle);
    service.svgDrawing = svgElementMock as SVGSVGElement;
    spyOn(mockRectangle, 'isPointInFill').and.returnValue(true);
    const pointToVerify = 5;
    spyOn(service, 'getListOfTouchedNodes').and.returnValue(svgElementMock.childNodes);
    spyOn(service, 'getVerificationPointsTable').and.returnValue([[ pointToVerify, pointToVerify]]);
    const result = service.getNodeTouchedByEraser(event);
    expect(result).toBe(null);
  });

  it('#getNodeTouchedByEraser should return svgElement\'s stroke is not equal to none', () => {
    const event: MouseEvent = new MouseEvent('mouseup');
    const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElementMock.setAttribute('height', '20');
    svgElementMock.setAttribute('width', '20');
    const mockRectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    mockRectangle.setAttribute('stroke', 'black');
    mockRectangle.setAttribute('x1', '0');
    mockRectangle.setAttribute('y1', '0');
    mockRectangle.setAttribute('height', '20');
    mockRectangle.setAttribute('width', '20');
    svgElementMock.appendChild(mockRectangle);
    service.svgDrawing = svgElementMock as SVGSVGElement;
    spyOn(mockRectangle, 'isPointInStroke').and.returnValue(true);
    const pointToVerify = 5;
    spyOn(service, 'getListOfTouchedNodes').and.returnValue(svgElementMock.childNodes);
    spyOn(service, 'getVerificationPointsTable').and.returnValue([[ pointToVerify, pointToVerify]]);
    const result = service.getNodeTouchedByEraser(event);
    expect(result).toEqual(mockRectangle);
  });
  it('#getNodeTouchedByEraser should return null if point is not in stroke and not in fill', () => {
    const event: MouseEvent = new MouseEvent('mouseup');
    const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElementMock.setAttribute('height', '20');
    svgElementMock.setAttribute('width', '20');
    const mockRectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    mockRectangle.setAttribute('stroke', 'black');
    mockRectangle.setAttribute('x1', '0');
    mockRectangle.setAttribute('y1', '0');
    mockRectangle.setAttribute('height', '20');
    mockRectangle.setAttribute('width', '20');
    svgElementMock.appendChild(mockRectangle);
    service.svgDrawing = svgElementMock as SVGSVGElement;
    spyOn(mockRectangle, 'isPointInFill').and.returnValue(false);
    spyOn(mockRectangle, 'isPointInStroke').and.returnValue(false);
    const pointToVerify = 5;
    spyOn(service, 'getListOfTouchedNodes').and.returnValue(svgElementMock.childNodes);
    spyOn(service, 'getVerificationPointsTable').and.returnValue([[ pointToVerify, pointToVerify]]);
    const result = service.getNodeTouchedByEraser(event);
    expect(result).toBe(null);
  });

  it('#getTransformationSvgElement should return [0,0] if no transform', () => {
    const mockRectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    mockRectangle.setAttribute('transform', '');
    const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElementMock.appendChild(mockRectangle);
    const result = service.getTransformationSvgElement(mockRectangle as SVGGeometryElement);
    const expectedValue = [0, 0];
    expect(result[0]).toEqual(expectedValue[0]);
  });

  it('#getTransformationSvgElement should return [0,0] if transformElements[0] !== translate', () => {
    const mockRectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    mockRectangle.setAttribute('transform', 'rotate');
    const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElementMock.appendChild(mockRectangle);
    const result = service.getTransformationSvgElement(mockRectangle as SVGGeometryElement);
    const expectedValue = [0, 0];
    expect(result[0]).toEqual(expectedValue[0]);
  });

  it('#getTransformationSvgElement should return [1,1] if transform === translate', () => {
    const mockRectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    mockRectangle.setAttribute('transform', 'translate(1 1)');
    const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElementMock.appendChild(mockRectangle);
    const result = service.getTransformationSvgElement(mockRectangle as SVGGeometryElement);
    const expectedValue = [1, 1];
    expect(result[0]).toEqual(expectedValue[0]);
  });

  it('#getTransformationSvgElement should return [1,1] if element if inside a g wrapper', () => {
    const mockRectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svgElementMock.appendChild(mockRectangle);
    svgElementMock.setAttribute('transform', 'translate(1 1)');
    const result = service.getTransformationSvgElement(mockRectangle as SVGGeometryElement);
    const expectedValue = [1, 1];
    expect(result[0]).toEqual(expectedValue[0]);
  });

  it('#getListOfTouchedNodes should call get intersection list', () => {
    const event: MouseEvent = new MouseEvent('mouseup');
    const offset = 0;
    spyOnProperty(event, 'offsetX').and.returnValue(offset);
    spyOnProperty(event, 'offsetY').and.returnValue(offset);
    const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElementMock.setAttribute('height', '20');
    svgElementMock.setAttribute('width', '20');
    const mockRectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect') as SVGElement;
    mockRectangle.setAttribute('fill', 'black');
    mockRectangle.setAttribute('x', '0');
    mockRectangle.setAttribute('y', '0');
    mockRectangle.setAttribute('height', '20');
    mockRectangle.setAttribute('width', '20');
    svgElementMock.appendChild(mockRectangle);
    service.svgDrawing = svgElementMock as SVGSVGElement;
    service.eraserSize = 0;
    service.eraserRectangle = svgElementMock.createSVGRect();
    const spy = spyOn(service.svgDrawing, 'getIntersectionList');
    service.getListOfTouchedNodes(event);
    expect(spy).toHaveBeenCalled();
    });

  it('#highlightSVGElement should exit if no wrapper and element not in selected node', () => {
    const mockRectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect') as SVGElement;
    const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElementMock.appendChild(mockRectangle);
    service.selectedNode = [];
    const spyWrapperG = spyOn(service, 'highlightWrapper');
    const spyChangeColor = spyOn(service, 'changeColor');
    service.highlightSVGElement(mockRectangle);

    expect(spyWrapperG).not.toHaveBeenCalled();
    expect(spyChangeColor).toHaveBeenCalled();
  });

  it('#highlightSVGElement should exit if svgElement is in selected node', () => {
    const mockRectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect') as SVGElement;
    const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElementMock.appendChild(mockRectangle);
    service.selectedNode = [mockRectangle];
    const spyWrapperG = spyOn(service, 'highlightWrapper');
    const spyChangeColor = spyOn(service, 'changeColor');
    service.highlightSVGElement(mockRectangle);

    expect(spyWrapperG).not.toHaveBeenCalled();
    expect(spyChangeColor).not.toHaveBeenCalled();
  });
  it('#highlightSVGElement should call highlightWrapper if svgElement parent is wrapper and not in selected node', () => {
    const mockRectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect') as SVGElement;
    const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svgElementMock.appendChild(mockRectangle);
    service.selectedNode = [];
    const spyWrapperG = spyOn(service, 'highlightWrapper');
    const spyChangeColor = spyOn(service, 'changeColor');
    service.highlightSVGElement(mockRectangle);
    expect(spyWrapperG).toHaveBeenCalled();
    expect(spyChangeColor).not.toHaveBeenCalled();
  });
  it('#highlightSVGElement should call highlightWrapper if svgElement parent is wrapper and in selected node', () => {
    const mockRectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect') as SVGElement;
    const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svgElementMock.appendChild(mockRectangle);
    service.selectedNode = [svgElementMock as Element];
    const spyWrapperG = spyOn(service, 'highlightWrapper');
    const spyChangeColor = spyOn(service, 'changeColor');
    service.highlightSVGElement(mockRectangle);
    expect(spyWrapperG).not.toHaveBeenCalled();
    expect(spyChangeColor).not.toHaveBeenCalled();
  });

  it('#highlightWrapper should not call changColor if svgElement as no child', () => {
    const mockRectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect') as SVGElement;
    const spyChangeColor = spyOn(service, 'changeColor');
    service.highlightWrapper(mockRectangle);
    expect(spyChangeColor).not.toHaveBeenCalled();
  });
  it('#highlightWrapper should call changColor twice if svgElement 2 child', () => {
    const mockRectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect') as SVGElement;
    const mockRectangle2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect') as SVGElement;
    const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElementMock.appendChild(mockRectangle);
    svgElementMock.appendChild(mockRectangle2);
    const spyChangeColor = spyOn(service, 'changeColor');
    service.highlightWrapper(svgElementMock);
    expect(spyChangeColor).toHaveBeenCalledTimes(2);
  });

  it( '#changeColor should not call setAttribute if node is not element', () => {
    const node = document.createTextNode('This is new.');
    const spy = spyOn(renderer, 'setAttribute');
    service.changeColor(node);
    expect(spy).not.toHaveBeenCalled();
  });
  it( '#changeColor should call getAttribute(\'stroke-width\') if stroke-width is not 0', () => {
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'rect') as Element;
    const spy = spyOn(node, 'getAttribute');
    const spyRenderer = spyOn(renderer, 'setAttribute');
    service.changeColor(node);
    expect(spy).toHaveBeenCalled();
    expect(spyRenderer).not.toHaveBeenCalled();
  });
  it( '#changeColor should call setAttribute if stroke-width is 0', () => {
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'rect') as Element;
    service.renderer = renderer;
    node.setAttribute('stroke-width', '');
    node.setAttribute('stroke', 'blue');
    const spyRenderer = spyOn(renderer, 'setAttribute');
    service.changeColor(node);
    expect(spyRenderer).toHaveBeenCalled();
  });
  it( '#changeColor should call setAttribute to change the color', () => {
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'rect') as Element;
    service.renderer = renderer;
    node.setAttribute('stroke-width', '0');
    node.setAttribute('stroke', 'rgba(240, 52, 52, 1)');
    const spyRenderer = spyOn(renderer, 'setAttribute');
    service.changeColor(node);
    expect(spyRenderer).toHaveBeenCalled();
  });
  it('#removeHighlight should verify if coloredNode table length is set back to 0', () => {
    const length = 5;
    service.coloredNode.length = length;
    service.removeHighlight();
    expect(service.coloredNode.length).toEqual(0);
  });
  it('#removeHighlight should set coloredNode to empty if element inside coloredNode', () => {
    const rectMock = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    service.coloredNode.push([rectMock, 'blue', '2']);
    service.removeHighlight();
    expect(service.coloredNode.length).toEqual(0);
  });
  it('#checkIfColorNearRed return true if color near red', () => {
    const result = service.checkIfColorNearRed('rgba(255,0,0,1)');
    expect(result).toBe(true);
  });
  it('#checkIfColorNearRed return false if color is not red', () => {
    const result = service.checkIfColorNearRed('rgba(0,255,0,1)');
    expect(result).toBe(false);
  });
// tslint:disable-next-line:max-file-line-count (on test le même service)
});
