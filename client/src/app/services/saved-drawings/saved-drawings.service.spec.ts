import { TestBed } from '@angular/core/testing';
import { Drawing } from '../../../../../common/communication/drawing';
import { SavedDrawingsService } from './saved-drawings.service';

describe('SavedDrawingsService', () => {

  const MOCK_DRAWING: Drawing = {name: '', tags: [], metadata: '', previewSource: '' };
  const MOCK_DRAWINGS_ARRAY: Drawing[] = [ MOCK_DRAWING, MOCK_DRAWING ];
  let service: SavedDrawingsService;

  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    service = TestBed.get(SavedDrawingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#updateSavedDrawings should change savedDrawingsSubject', () => {
    spyOn(service.savedDrawingsSubject, 'next').and.callFake((newDrawings: Drawing[]) => {
      expect(newDrawings).toEqual(newDrawings);
    });
    service.updateSavedDrawings(MOCK_DRAWINGS_ARRAY);
    expect(service.savedDrawingsSubject.next).toHaveBeenCalled();
  });
});
