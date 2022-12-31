import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Shape } from '@app-services/drawing/shapes/shape';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { MockRectangle } from 'mock/mock-rectangle';
import { MockRenderer } from 'mock/mock-renderer';
import { VisualIndicatorElementCreator } from './visual-indicator-element-creator';

describe('VisualIndicatorElementCreator', () => {
  let createRenderer2Spy: jasmine.Spy;
  let instance: VisualIndicatorElementCreator;
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
    instance = new VisualIndicatorElementCreator(rendererFactory);
    instance.renderer = renderer;
    spySetAttribute = spyOn(renderer, 'setAttribute');
  });

  it('should create an instance', () => {
    expect(instance).toBeTruthy();
  });

  it('#createCircle should call setAttribute 6 times', () => {
    const shape = new Shape(colorsService, toolProperties);
    instance.createCircle(shape);
    const callNumberSetAttribute = 6;
    expect(spySetAttribute).toHaveBeenCalledTimes(callNumberSetAttribute);
  });

  it('#deleteCursor should call createElement', () => {
    const spy = spyOn(renderer, 'createElement');
    instance.deleteCursor();
    expect(spy).toHaveBeenCalled();
  });

  it('#createSelectorRectangle should call setAttribute 9 times', () => {
    const shape = new MockRectangle(colorsService, toolProperties);
    instance.createEraserCursorAddOn(shape);
    const callNumberSetAttribute = 9;
    expect(spySetAttribute).toHaveBeenCalledTimes(callNumberSetAttribute);
  });
});
