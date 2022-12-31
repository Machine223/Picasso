import { TestBed } from '@angular/core/testing';

import { DrawingElementsService } from './drawing-elements.service';

describe('DrawingElementsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawingElementsService = TestBed.get(DrawingElementsService);
    expect(service).toBeTruthy();
  });
});
