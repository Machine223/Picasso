import { TestBed } from '@angular/core/testing';
import { ShortcutsInfoService } from './shortcuts-info.service';

describe('ShortcutsInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShortcutsInfoService = TestBed.get(ShortcutsInfoService);
    expect(service).toBeTruthy();
  });

  it('#openedDialogChange should called openedDialogSubject', () => {
    const service: ShortcutsInfoService = TestBed.get(ShortcutsInfoService);
    const spy = spyOn(service.openedDialogSubject, 'next');
    service.openedDialogChange(true);
    expect(spy).toHaveBeenCalled();
  });

  it('#openedDialogChange should receive boolean', () => {
    const service: ShortcutsInfoService = TestBed.get(ShortcutsInfoService);
    spyOn(service.openedDialogSubject, 'next').and.callFake((receivedSubject: boolean) => {
      expect(service.openedDialogSubject.getValue).toEqual(receivedSubject);
    });
    expect(service.openedDialogSubject).toBeDefined();
  });

});
