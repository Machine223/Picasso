import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Path } from '@app-services/drawing/paths/path';
import { Shape } from '@app-services/drawing/shapes/shape';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { MockRenderer } from 'mock/mock-renderer';
import { PencilElementCreator } from './pencil-element-creator';

describe('PencilElementCreator', () => {
  let createRenderer2Spy: jasmine.Spy;
  let instance: PencilElementCreator;
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
    instance = new PencilElementCreator(rendererFactory);
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

  it('#createPath should call setAttribute 6 times and removeLastTemporaryPart 1 time', () => {
    const shape = new Path(colorsService, toolProperties);
    const spy = spyOn(instance, 'removeLastTemporaryPart');
    instance.createPath(shape);
    const callNumberSetAttribute = 6;
    expect(spySetAttribute).toHaveBeenCalledTimes(callNumberSetAttribute);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
