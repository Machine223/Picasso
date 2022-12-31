import { TestBed } from '@angular/core/testing';
import { Drawing } from '../../../../../common/communication/drawing';
import { LoadingFeatureService } from './loading-feature.service';

const MOCK_DRAWING: Drawing = { name: 'hello', tags: [], metadata: '', previewSource: ''};

describe('LoadingFeatureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  let service: LoadingFeatureService;
  beforeEach(() => {
    service = TestBed.get(LoadingFeatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#load should change loadedDrawingSubject', () => {
    const spy = spyOn(service.loadedDrawingSubject, 'next').and.callThrough();
    service.load(MOCK_DRAWING);
    expect(spy).toHaveBeenCalled();
  });
});
