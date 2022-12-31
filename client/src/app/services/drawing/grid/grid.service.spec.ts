import { TestBed } from '@angular/core/testing';

import { DEFAULT_GRID_LENGTH, DEFAULT_OPACITY, GRID_MAX, GridService, INCREMENT_SIZE } from './grid.service';

describe('GridService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GridService = TestBed.get(GridService);
    expect(service).toBeTruthy();
  });

  it('#setDefaultValues should initilize class member attribute value', () => {
    const service: GridService = TestBed.get(GridService);
    service.setDefaultValues();
    expect(service.gridLength).toEqual(DEFAULT_GRID_LENGTH);
    expect(service.gridOpacity).toEqual(DEFAULT_OPACITY);
  });

  it('#increment should add gridLength by 5', () => {
    const service: GridService = TestBed.get(GridService);
    service.setDefaultValues();
    const expectedValue = DEFAULT_GRID_LENGTH + INCREMENT_SIZE;
    service.increment();
    expect(service.gridLength).toEqual(expectedValue);
  });

  it('#increment should not call path to string if sums would be over 500', () => {
    const service: GridService = TestBed.get(GridService);
    service.setDefaultValues();
    service.gridLength = GRID_MAX;
    const spy = spyOn(service, 'pathToString').and.callThrough();
    service.increment();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#decrement should substract gridLength by 5', () => {
    const service: GridService = TestBed.get(GridService);
    const initialSize = 30;
    service.gridLength = initialSize;
    const expectedValue = service.gridLength - INCREMENT_SIZE;
    service.decrement();
    expect(service.gridLength).toEqual(expectedValue);
  });

  it('#decrement should not call path to string if it is lower than 2 times the increment size', () => {
    const service: GridService = TestBed.get(GridService);
    service.setDefaultValues();
    service.gridLength = INCREMENT_SIZE * 2 - 1;
    const spy = spyOn(service, 'pathToString').and.callThrough();
    service.decrement();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#pathToString should return a string', () => {
    const service: GridService = TestBed.get(GridService);
    service.setDefaultValues();
    const expectedValue = 'M 5 0 L 0 0 0 5';
    expect(service.pathString).toEqual(expectedValue);
  });
});
