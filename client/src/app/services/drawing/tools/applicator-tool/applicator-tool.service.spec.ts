import { RendererFactory2 } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { UndoRedoManagerService } from '@app-services/undo-redo/undo-redo-manager.service';
import { MOCK_MOUSE_EVENT, MOCK_MOUSE_EVENT_LEAVE, MOCK_MOUSE_EVENT_UP } from '../../../../../mock/mock-mouse-event';
import { ApplicatorToolService } from './applicator-tool.service';

describe('ApplicatorToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ApplicatorToolService, UndoRedoManagerService]
  }));

  it('should be created', () => {
    const service: ApplicatorToolService = TestBed.get(ApplicatorToolService);
    expect(service).toBeTruthy();
  });

  it('#eventTypeDispatcher should call on mouseDown when onMouseDown event',  inject( [ApplicatorToolService],
    (applicatorService: ApplicatorToolService) => {
    const spy = spyOn(applicatorService, 'onMouseDown');
    applicatorService.eventTypeDispatcher(MOCK_MOUSE_EVENT);
    expect(spy).toHaveBeenCalled();
  }));

  it('#eventTypeDispatcher should call on mouseDown when onMouseUp event',  inject( [ApplicatorToolService],
    (applicatorService: ApplicatorToolService) => {
      const spy = spyOn(applicatorService, 'onMouseUp');
      applicatorService.eventTypeDispatcher(MOCK_MOUSE_EVENT_UP);
      expect(spy).toHaveBeenCalled();
    }));

  it('#eventTypeDispatcher should call on mouseDown when onMouseLeave event',  inject( [ApplicatorToolService],
    (applicatorService: ApplicatorToolService) => {
      const spy = spyOn(applicatorService, 'onMouseLeave');
      applicatorService.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
      expect(spy).toHaveBeenCalled();
    }));

  it('#onMouseDown should change isIn to true', inject([ApplicatorToolService], (applicatorService: ApplicatorToolService) => {
    applicatorService.isIn = false;
    applicatorService.onMouseDown();
    expect(applicatorService.isIn).toBe(true);
  }));

  it('#onMouseUp should return; when isIn is false',
    inject([ApplicatorToolService], (applicatorService: ApplicatorToolService) => {
    applicatorService.isIn = false;
    const spy = spyOn(applicatorService, 'getSVGElement');
    applicatorService.onMouseUp(MOCK_MOUSE_EVENT_UP);
    expect(spy).not.toHaveBeenCalled();
  }));

  it('#onMouseUp is expected to called getSVGElement when isIn is true',
    inject([ApplicatorToolService], (applicatorService: ApplicatorToolService) => {
      applicatorService.isIn = true;
      const svg   = document.documentElement;
      const svgNS = svg.namespaceURI;
      const svgElement = document.createElementNS(svgNS, 'rect') as SVGGElement;
      svgElement.setAttribute('id', 'rectangleMock');
      svgElement.setAttribute('fill', 'none');
      const spy = spyOn(applicatorService, 'getSVGElement').and.returnValue(svgElement);
      applicatorService.onMouseUp(MOCK_MOUSE_EVENT_UP);
      expect(spy).toHaveBeenCalled();
    }));

  it('#onMouseUp is expected to called setColor if svgElement is in a g tags',
    inject([ApplicatorToolService], (applicatorService: ApplicatorToolService) => {
      applicatorService.isIn = true;
      const svg   = document.documentElement;
      const svgNS = svg.namespaceURI;
      const svgElement = document.createElementNS(svgNS, 'rect') as SVGGElement;
      svgElement.setAttribute('id', 'rectangleMock');
      svgElement.setAttribute('fill', 'none');
      const rendererFactory = TestBed.get(RendererFactory2);
      const renderer = rendererFactory.createRenderer(null, null);
      const svgParent = renderer.createElement('g', 'svg');
      renderer.appendChild(svgParent, svgElement);
      spyOn(applicatorService, 'getSVGElement').and.returnValue(svgParent);
      applicatorService.checkChildElements = ((svgParentElement: SVGElement, event) => !!svgParentElement.firstElementChild);
      const spy = spyOn(applicatorService, 'setColor');
      applicatorService.onMouseUp(MOCK_MOUSE_EVENT_UP);
      expect(spy).toHaveBeenCalled();
    }));

  it('#onMouseLeave should change isIn to false when called', inject( [ApplicatorToolService],
    (service: ApplicatorToolService) => {
      service.isIn = true;
      service.onMouseLeave();
      expect(service.isIn).toBe(false);
    }));

  it('#getSVGElement should return a targeted element when click event on target',
    inject([ApplicatorToolService], (applicatorService: ApplicatorToolService) => {
      const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const event: MouseEvent = new MouseEvent('mouseup');
      const svggElement  = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      svgElementMock.setAttribute('id', 'svgdrawing');
      svgElementMock.appendChild(svggElement);
      spyOnProperty(event, 'target').and.returnValue(svgElementMock);
      const result = applicatorService.getSVGElement(event);
      expect(result).toEqual(svggElement);
    }));

  it('#checkChildElements should return false if no child element',
    inject([ApplicatorToolService], (applicatorService: ApplicatorToolService) => {
      const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const event: MouseEvent = new MouseEvent('mouseup');
      const result = applicatorService.checkChildElements(svgElementMock, event);
      expect(result).toBe(false);
    }));

  it('#checkChildElements should return true if childElement is targeted',
    inject([ApplicatorToolService], (applicatorService: ApplicatorToolService) => {
      const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const circleMock = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circleMock.setAttribute('fill', 'black');
      circleMock.setAttribute('stroke', 'black');
      svgElementMock.appendChild(circleMock);
      const event: MouseEvent = new MouseEvent('mouseup');
      spyOnProperty(event, 'target').and.returnValue(circleMock);
      const result = applicatorService.checkChildElements(svgElementMock, event);
      expect(result).toBe(true);
    }));

  it('#checkChildElements should return false if element is targeted but not a child',
    inject([ApplicatorToolService], (applicatorService: ApplicatorToolService) => {
      const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const circleMock = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circleMock.setAttribute('fill', 'black');
      circleMock.setAttribute('stroke', 'black');
      const event: MouseEvent = new MouseEvent('mouseup');
      spyOnProperty(event, 'target').and.returnValue(circleMock);
      const result = applicatorService.checkChildElements(svgElementMock, event);
      expect(result).toBe(false);
    }));

  it('#setColor should called getSecondaryColorRGBA if isRightClick true',
    inject([ApplicatorToolService, ColorsService], (applicatorService: ApplicatorToolService, colorsService: ColorsService) => {
      const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const circleMock = document.createElementNS('http://www.w3.org/2000/svg', 'circle') as SVGGElement;
      circleMock.setAttribute('fill', 'black');
      circleMock.setAttribute('stroke', 'black');
      svgElementMock.appendChild(circleMock);
      const spy = spyOn(colorsService, 'getSecondaryColorRGBA').and.callThrough();
      applicatorService.setColor(circleMock, true, true);
      expect(spy).toHaveBeenCalled();
    }));

  it('#setColor should called getMainColorRGBA if isRightClick false',
    inject([ApplicatorToolService, ColorsService], (applicatorService: ApplicatorToolService, colorsService: ColorsService) => {
      const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const circleMock = document.createElementNS('http://www.w3.org/2000/svg', 'circle') as SVGGElement;
      circleMock.setAttribute('fill', 'black');
      circleMock.setAttribute('stroke', 'black');
      svgElementMock.appendChild(circleMock);
      const spy = spyOn(colorsService, 'getMainColorRGBA').and.callThrough();
      applicatorService.setColor(circleMock, false, true);
      expect(spy).toHaveBeenCalled();
    }));

  it('#setColor should called setChildElementsAttribute if isRightClick false and isComposite true',
    inject([ApplicatorToolService], (applicatorService: ApplicatorToolService) => {
      const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const circleMock = document.createElementNS('http://www.w3.org/2000/svg', 'circle') as SVGGElement;
      circleMock.setAttribute('fill', 'black');
      circleMock.setAttribute('stroke', 'black');
      svgElementMock.appendChild(circleMock);
      const spy = spyOn(applicatorService, 'setChildElementsAttribute').and.callThrough();
      applicatorService.setColor(circleMock, false, true);
      expect(spy).toHaveBeenCalled();
    }));

  it('#setColor should called setChildElementsAttribute if isRightClick false and isComposite true',
    inject([ApplicatorToolService], (applicatorService: ApplicatorToolService) => {
      const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const circleMock = document.createElementNS('http://www.w3.org/2000/svg', 'circle') as SVGGElement;
      circleMock.setAttribute('fill', 'black');
      circleMock.setAttribute('stroke', 'black');
      svgElementMock.appendChild(circleMock);
      const spy = spyOn(applicatorService, 'setChildElementsAttribute').and.callThrough();
      applicatorService.setColor(circleMock, false, true);
      expect(spy).toHaveBeenCalled();
    }));

  it('#setColor should called executeCommand if (isComposite && !isRightClick) false ',
    inject([ApplicatorToolService, UndoRedoManagerService],
      (applicatorService: ApplicatorToolService, undoRedo: UndoRedoManagerService) => {
      const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const circleMock = document.createElementNS('http://www.w3.org/2000/svg', 'circle') as SVGGElement;
      circleMock.setAttribute('fill', 'black');
      circleMock.setAttribute('stroke', 'black');
      svgElementMock.appendChild(circleMock);
      const spy = spyOn(undoRedo, 'executeCommand').and.callThrough();
      applicatorService.setColor(circleMock, false, false);
      expect(spy).toHaveBeenCalled();
    }));

  it('#checkSurfaceType return true', inject( [ApplicatorToolService],
    (service: ApplicatorToolService) => {
      const svg   = document.documentElement;
      const svgNS = svg.namespaceURI;
      const svgElement = document.createElementNS(svgNS, 'rect') as SVGGElement;
      svgElement.setAttribute('id', 'rectangleMock');
      svgElement.setAttribute('fill', 'black');
      const checkSurface: boolean = service.checkSurfaceType(svgElement, true, true);
      expect(checkSurface).toBe(true);
    }));

  it('#checkSurfaceType return false', inject( [ApplicatorToolService],
    (service: ApplicatorToolService) => {
      const svg   = document.documentElement;
      const svgNS = svg.namespaceURI;
      const svgElement = document.createElementNS(svgNS, 'rect') as SVGGElement;
      svgElement.setAttribute('id', 'rectangleMock');
      svgElement.setAttribute('fill', 'black');
      const checkSurface: boolean = service.checkSurfaceType(svgElement, false, true);
      expect(checkSurface).toBe(false);
    }));

  it('#checkSingleElementType return false', inject( [ApplicatorToolService],
    (service: ApplicatorToolService) => {
      const svg   = document.documentElement;
      const svgNS = svg.namespaceURI;
      const svgElement = document.createElementNS(svgNS, 'rect') as SVGGElement;
      svgElement.setAttribute('id', 'rectangleMock');
      svgElement.setAttribute('fill', 'none');
      const checkSurface: boolean = service.checkSingleElementType(svgElement, 'fill');
      expect(checkSurface).toBe(false);
    }));

  it('#checkSingleElementType return true', inject( [ApplicatorToolService],
    (service: ApplicatorToolService) => {
      const svg   = document.documentElement;
      const svgNS = svg.namespaceURI;
      const svgElement = document.createElementNS(svgNS, 'rect') as SVGGElement;
      svgElement.setAttribute('id', 'rectangleMock');
      svgElement.setAttribute('fill', 'none');
      const checkSurface: boolean = service.checkSingleElementType(svgElement, 'stroke');
      expect(checkSurface).toBe(true);
    }));

  it('#setChildElementsAttribute should not call excuteCommand if SVGElement first elementChild is null',
    inject( [ApplicatorToolService, UndoRedoManagerService],
    (serviceApplicator: ApplicatorToolService, undoRedoService: UndoRedoManagerService) => {
      const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const spy = spyOn(undoRedoService, 'executeCommand');
      serviceApplicator.setChildElementsAttribute(svgElementMock, 'black', 'fill');
      expect(spy).not.toHaveBeenCalled();
    }));

  it('#setChildElementsAttribute should call excuteCommand if SVGElement first elementChild is not null',
    inject( [ApplicatorToolService, UndoRedoManagerService],
    (serviceApplicator: ApplicatorToolService, undoRedoService: UndoRedoManagerService) => {
      const svgElementMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const circleMock  = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circleMock.setAttribute('fill', 'black');
      circleMock.setAttribute('stroke', 'black');
      svgElementMock.appendChild(circleMock);
      const spy = spyOn(undoRedoService, 'executeCommand').and.callThrough();
      serviceApplicator.setChildElementsAttribute(svgElementMock, 'black', 'fill');
      expect(spy).toHaveBeenCalled();
    }));
});
