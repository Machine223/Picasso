import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AutoSaveService } from '@app-services/auto-save/auto-save.service';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { ControlPointRectangle } from '@app-services/drawing/shapes/rectangle/control-point-rectangle';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { MockDashedRectangle } from 'mock/mock-dashed-rectangle';
import { MockRectangle } from 'mock/mock-rectangle';
import { MockRenderer } from 'mock/mock-renderer';
import { SelectorElementCreator } from './selector-element-creator';

describe('SelectorElementCreator', () => {

  let createRenderer2Spy: jasmine.Spy;
  let instance: SelectorElementCreator;
  let rendererFactory: RendererFactory2;
  let autoSave: AutoSaveService;
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
    autoSave = TestBed.get(AutoSaveService);
    renderer = new MockRenderer();
    colorsService = TestBed.get(ColorsService);
    toolProperties = TestBed.get(ToolPropertiesService);
    instance = new SelectorElementCreator(autoSave, rendererFactory);
    instance.renderer = renderer;
    spySetAttribute = spyOn(renderer, 'setAttribute');
  });

  it('should create an instance', () => {
    expect(instance).toBeTruthy();
  });

  it('#createSelectorRectangle should call setAttribute 7 times and appendChild 1 time', () => {
    const spy = spyOn(renderer, 'appendChild');
    const shape = new MockRectangle(colorsService, toolProperties);
    instance.createSelectorRectangle(shape);
    const callNumberSetAttribute = 7;
    expect(spySetAttribute).toHaveBeenCalledTimes(callNumberSetAttribute);
    expect(spy).toHaveBeenCalled();
  });

  it('#createDashedSelectorRectangle should call setAttribute 9 times', () => {
    const shape = new MockDashedRectangle(colorsService, toolProperties);
    instance.createDashedSelectorRectangle(shape);
    const callNumberSetAttribute = 9;
    expect(spySetAttribute).toHaveBeenCalledTimes(callNumberSetAttribute);
  });

  it('#createControlPointRectangle should call setAttribute 7 times and append child 1 time', () => {
    const spy = spyOn(renderer, 'appendChild');
    const shape = new ControlPointRectangle(colorsService, toolProperties);
    instance.createControlPointRectangle(shape);
    const callNumberSetAttribute = 7;
    expect(spySetAttribute).toHaveBeenCalledTimes(callNumberSetAttribute);
    expect(spy).toHaveBeenCalled();
  });

  it('#removeLastSelector should not call removeChild if lastSelector is null', () => {
    const spy = spyOn(renderer, 'removeChild');
    instance.lastSelector = null;
    instance.removeLastSelector();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#removeLastSelector should call removeChild if lastSelector is not null', () => {
    const spy = spyOn(renderer, 'removeChild');
    const svg   = document.documentElement;
    const svgNS = svg.namespaceURI;
    const rectangle = document.createElementNS(svgNS, 'rect') as SVGElement;
    instance.lastSelector = rectangle;
    instance.removeLastSelector();
    expect(spy).toHaveBeenCalled();
  });
});
