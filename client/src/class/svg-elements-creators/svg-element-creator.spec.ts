import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Path } from '@app-services/drawing/paths/path';
import { Shape } from '@app-services/drawing/shapes/shape';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { MockEllipse } from 'mock/mock-ellipse';
import { MockPolygon } from 'mock/mock-polygon';
import { MockRectangle } from 'mock/mock-rectangle';
import { MockRenderer } from 'mock/mock-renderer';
import { SVGElementCreator } from './svg-element-creator';

describe('SVGElementCreator', () => {
  let createRenderer2Spy: jasmine.Spy;
  let instance: SVGElementCreator;
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
    instance = new SVGElementCreator(rendererFactory);
    instance.renderer = renderer;
    spySetAttribute = spyOn(renderer, 'setAttribute');
  });

  it('should create an instance', () => {
    expect(instance).toBeTruthy();
  });

  it('#createCircle should call setAttribute 5 times', () => {
    const shape = new Shape(colorsService, toolProperties);
    instance.createCircle(shape);
    const callNumberSetAttribute = 5;
    expect(spySetAttribute).toHaveBeenCalledTimes(callNumberSetAttribute);
  });

  it('#createRectangle should call setAttribute 7 times when stroke is black', () => {
    const shape = new MockRectangle(colorsService, toolProperties);
    instance.createRectangle(shape);
    const callNumberSetAttribute = 7;
    expect(spySetAttribute).toHaveBeenCalledTimes(callNumberSetAttribute);
  });

  it('#createRectangle should call setAttribute 7 times when stroke is none', () => {
    const shape = new MockRectangle(colorsService, toolProperties);
    shape.stroke = 'none';
    instance.createRectangle(shape);
    const callNumberSetAttribute = 7;
    expect(spySetAttribute).toHaveBeenCalledTimes(callNumberSetAttribute);
  });

  it('#createPath should call setAttribute 6 times and removeLastTemporaryPart 1 time', () => {
    const shape = new Path(colorsService, toolProperties);
    const spy = spyOn(instance, 'removeLastTemporaryPart');
    instance.createPath(shape);
    const callNumberSetAttribute = 6;
    expect(spySetAttribute).toHaveBeenCalledTimes(callNumberSetAttribute);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('#createEllipse should call setAttribute 7 times', () => {
    const shape = new MockEllipse(colorsService, toolProperties);
    instance.createEllipse(shape);
    const callNumberSetAttribute = 7;
    expect(spySetAttribute).toHaveBeenCalledTimes(callNumberSetAttribute);
  });

  it('#createPolygon should call setAttribute 4 times', () => {
    const shape = new MockPolygon(colorsService, toolProperties);
    instance.createPolygon(shape);
    const callNumberSetAttribute = 4;
    expect(spySetAttribute).toHaveBeenCalledTimes(callNumberSetAttribute);
  });

  it('#removeLastTemporaryPart should not call removeChild if lastTemporaryPart is null', () => {
    const spy = spyOn(renderer, 'removeChild');
    instance.removeLastTemporaryPart();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('#removeLastTemporaryPart should call removeChild if lastTemporaryPart is not null', () => {
    const svg   = document.documentElement;
    const svgNS = svg.namespaceURI;
    const rectangle = document.createElementNS(svgNS, 'rect') as SVGElement;
    instance.lastTemporaryPart = rectangle;
    const spy = spyOn(renderer, 'removeChild');
    instance.removeLastTemporaryPart();
    expect(spy).toHaveBeenCalled();
  });

  it('#deleteElementWithParts should call createElement', () => {
    const spy = spyOn(renderer, 'createElement');
    instance.deleteElementWithParts();
    expect(spy).toHaveBeenCalled();
  });

  it('#finishElementWithParts should call createElement and set lastTemporaryPart to null', () => {
    const spy = spyOn(renderer, 'createElement');
    const svg   = document.documentElement;
    const svgNS = svg.namespaceURI;
    const rectangle = document.createElementNS(svgNS, 'rect') as SVGElement;
    instance.lastTemporaryPart = rectangle;
    instance.finishElementWithParts();
    expect(spy).toHaveBeenCalled();
    expect(instance.lastTemporaryPart).toBeNull();
  });
});
