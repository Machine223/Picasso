import { Renderer2, RendererFactory2 } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { PaintBucketPath } from '@app-services/drawing/paths/paint-bucket-path';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { MockRenderer } from '../../mock/mock-renderer';
import { PaintBucketElementCreator } from './paint-bucket-element-creator';

describe('PaintBucketElementCreator', () => {
  let createRenderer2Spy: jasmine.Spy;
  let instance: PaintBucketElementCreator;
  let rendererFactory: RendererFactory2;
  let renderer: Renderer2;

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
    instance = new PaintBucketElementCreator(rendererFactory);
    instance.renderer = renderer;
  });

  it('should create an instance', () => {
    expect(instance).toBeTruthy();
  });
  it('#createPath should create call setAttribute 8 times', inject([ColorsService, ToolPropertiesService],
    (colorService: ColorsService,  toolPropertiesService: ToolPropertiesService) => {
    const numberOfCall = 8;
    const expectedString = 'M 20 20 L 30 20 Z';
    const path = new PaintBucketPath(colorService, toolPropertiesService, expectedString);
    const spy = spyOn(instance.renderer, 'setAttribute').and.callThrough();
    instance.createPath(path);
    expect(spy).toHaveBeenCalledTimes(numberOfCall);
  }));
});
