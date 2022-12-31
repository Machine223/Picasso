import { TestBed } from '@angular/core/testing';
import { ToolPropertiesService } from './tool-properties.service';

describe('ToolPropertiesService', () => {
  let service: ToolPropertiesService ;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ToolPropertiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#gridChange should update and reverse gridSelected', () => {
    service.gridChange();
    expect(service.gridSelected).toBeDefined();
  });
});
