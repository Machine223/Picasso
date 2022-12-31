import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Line } from '@app-services/drawing/shapes/line/line';
import { Shape } from '@app-services/drawing/shapes/shape';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { MockRenderer } from 'mock/mock-renderer';
import { LineElementCreator } from './line-element-creator';

describe('LineElementCreator', () => {

  let createRenderer2Spy: jasmine.Spy;
  let instance: LineElementCreator;
  let rendererFactory: RendererFactory2;
  let colorsService: ColorsService;
  let toolProperties: ToolPropertiesService;
  let renderer: Renderer2;
  let spySetAttribute: jasmine.Spy;

  beforeEach(() => {
    createRenderer2Spy = jasmine.createSpy('RendererFactory2#createRenderer').and.returnValue(document);
    TestBed.configureTestingModule({ providers: [
      {provide: RendererFactory2, useValue: {createRenderer: createRenderer2Spy}},
      {provide: Renderer2, useClass: MockRenderer},
      ColorsService,
      ToolPropertiesService
     ]});
    rendererFactory = TestBed.get(RendererFactory2);
    renderer = new MockRenderer();
    colorsService = TestBed.get(ColorsService);
    toolProperties = TestBed.get(ToolPropertiesService);
    instance = new LineElementCreator(rendererFactory);
    instance.renderer = renderer;
    spySetAttribute = spyOn(renderer, 'setAttribute');
  });

  it('should create an instance', () => {
    expect(instance).toBeTruthy();
  });

  it('#createCircle should call setAttribute 5 times and appendChild 1 time', () => {
    const spy = spyOn(renderer, 'appendChild');
    const shape = new Shape(colorsService, toolProperties);
    instance.createCircle(shape);
    const callNumberSetAttribute = 5;
    expect(spySetAttribute).toHaveBeenCalledTimes(callNumberSetAttribute);
    expect(spy).toHaveBeenCalled();
  });

  it('#createLinePart should call setAttribute 7 times and appendChild 1 time', () => {
    const spy = spyOn(renderer, 'appendChild');
    const shape = new Line(colorsService, toolProperties);
    shape.startingPoint = new Coordinates(1, 2);
    shape.endingPoint = new Coordinates(0, 1);
    instance.createLinePart(shape, false);
    const callNumberSetAttribute = 7 ;
    expect(spySetAttribute).toHaveBeenCalledTimes(callNumberSetAttribute);
    expect(spy).toHaveBeenCalled();
  });

  it('#createLinePart with isVisualHelp true should add the part inside the lastTemporaryPart', () => {
    instance.lastTemporaryPart = null;
    const shape = new Line(colorsService, toolProperties);
    shape.startingPoint = new Coordinates(1, 2);
    shape.endingPoint = new Coordinates(0, 1);
    instance.createLinePart(shape, true);
    expect(instance.lastTemporaryPart).not.toBeNull();
  });

  it('#deleteLineParts with nbrOfParts of 1 and currentParts empty should return the attributes of the lastTemporaryPart element ', () => {
    const svg   = document.documentElement;
    const svgNS = svg.namespaceURI;
    const rectangle = document.createElementNS(svgNS, 'rect') as SVGElement;
    rectangle.setAttribute('x1', '1');
    rectangle.setAttribute('y1', '1');
    instance.lastTemporaryPart = rectangle;
    const result: Coordinates = instance.deleteLineParts(1);
    expect(result.xPosition).toEqual(1);
  });

  it('#deleteLineParts with nbrOfParts = 1, currentParts not empty should return the attributes of the part in the currentParts ', () => {
    const svg   = document.documentElement;
    const svgNS = svg.namespaceURI;
    const rectangle = document.createElementNS(svgNS, 'rect') as SVGElement;
    rectangle.setAttribute('x1', '1');
    rectangle.setAttribute('y1', '1');
    instance.currentParts.push(rectangle);
    const result: Coordinates = instance.deleteLineParts(1);
    expect(result.xPosition).toEqual(1);
  });

  it('#deleteLineParts with nbrOfParts = 2, lastTemporaryPart null should return coordinates of 0,0', () => {
    const svg   = document.documentElement;
    const svgNS = svg.namespaceURI;
    const rectangle = document.createElementNS(svgNS, 'rect') as SVGElement;
    rectangle.setAttribute('x1', '1');
    rectangle.setAttribute('y1', '1');
    instance.currentParts.push(rectangle);
    const result: Coordinates = instance.deleteLineParts(2);
    expect(result.xPosition).toEqual(0);
  });

  it('#deleteLineParts with nbrOfParts = 2, currentParts not empty should return the attr of the second part in the currentParts ', () => {
    const svg   = document.documentElement;
    const svgNS = svg.namespaceURI;
    const rectangle = document.createElementNS(svgNS, 'rect') as SVGElement;
    rectangle.setAttribute('x1', '1');
    rectangle.setAttribute('y1', '1');
    const circle = document.createElementNS(svgNS, 'circle') as SVGElement;
    instance.currentParts.push(rectangle);
    instance.currentParts.push(circle);
    const result: Coordinates = instance.deleteLineParts(2);
    expect(result.xPosition).toEqual(1);
  });

  it('#finishElementWithParts with lineIsWithDots false should call removeLastTemporayPart and not deleteElementsWithPart ', () => {
    const removeSpy = spyOn(instance, 'removeLastTemporaryPart');
    const deleteSpy = spyOn(instance, 'deleteElementWithParts');
    instance.finishElementWithParts(false);
    expect(removeSpy).toHaveBeenCalled();
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it('#finishElementWithParts with lineIsWithDots true should call removeLastTemporayPart and deleteElementsWithPart ', () => {
    const removeSpy = spyOn(instance, 'removeLastTemporaryPart');
    const deleteSpy = spyOn(instance, 'deleteElementWithParts');
    const svg   = document.documentElement;
    const svgNS = svg.namespaceURI;
    const rectangle = document.createElementNS(svgNS, 'rect') as SVGElement;
    instance.currentParts.push(rectangle);
    instance.finishElementWithParts(true);
    expect(removeSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalled();
  });
});
