import { RendererFactory2 } from '@angular/core';
import { inject } from '@angular/core/testing';
import { SprayElementCreator } from './spray-element-creator';

describe('SprayElementCreator', () => {
  it('should create an instance',
  inject([RendererFactory2], (renderer: RendererFactory2) => {
    expect(new SprayElementCreator(renderer)).toBeTruthy();
  }));
});
