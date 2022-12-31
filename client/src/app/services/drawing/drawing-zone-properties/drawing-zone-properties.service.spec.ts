import { TestBed } from '@angular/core/testing';

import { DrawingZonePropertiesService } from './drawing-zone-properties.service';

describe('DrawingZonePropertiesService', () => {
  let service: DrawingZonePropertiesService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeAll(() => { service = TestBed.get(DrawingZonePropertiesService); });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setIsMouseIn should set isMouseIn to true if we are entering the drawing-zone', () => {
    const MOCK_EVENT = new MouseEvent('mouseenter');
    service.isMouseIn = false;
    service.setIsMouseIn(MOCK_EVENT);
    const isMouseIn = service.isMouseIn;
    expect(isMouseIn).toBe(true);
  });

  it('setIsMouseIn should set isMouseIn to false if we are leaving the drawing-zone', () => {
    const MOCK_EVENT = new MouseEvent('mouseleave');
    service.isMouseIn = true;
    service.setIsMouseIn(MOCK_EVENT);
    const isMouseIn = service.isMouseIn;
    expect(isMouseIn).toBe(false);
  });
});
