import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NewDrawingCreationDialogComponent } from '@app-new-drawing/new-drawing-creation-dialog/new-drawing-creation-dialog.component';
import { of } from 'rxjs';
import { OpenDialogService } from './open-dialog.service';

const mockDialogRef = { };

describe('OpenDialogService', () => {
  beforeEach(() => { TestBed.configureTestingModule({
      declarations: [
        NewDrawingCreationDialogComponent,
      ],
      imports: [
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        FormsModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [{ provide: MatDialogRef, useValue: mockDialogRef }]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [NewDrawingCreationDialogComponent]
      }
    }).compileComponents();
  });

  let service: OpenDialogService;
  beforeEach(() => {
    service = TestBed.get(OpenDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#openExportDialog should open ExportDrawingComponent', () => {
    // tslint:disable-next-line: no-empty : I want to totally abstract the method's behaviour
    spyOn(service, 'manageWindowClosing').and.callFake(() => { });
    const spy = spyOn(service.dialog, 'open');
    service.openExportDialog();
    expect(spy).toHaveBeenCalled();
  });

  it('#openGallery should open Gallery', () => {
    // tslint:disable-next-line: no-empty : See above
    spyOn(service, 'manageWindowClosing').and.callFake(() => { });
    const spy = spyOn(service.dialog, 'open');
    service.openGallery();
    expect(spy).toHaveBeenCalled();
  });

  it('#openNewDrawingDialog should open NewDrawingDialog', () => {
    // tslint:disable-next-line: no-empty : See above
    spyOn(service, 'manageWindowClosing').and.callFake(() => { });
    const spy = spyOn(service.dialog, 'open');
    service.openNewDrawingDialog();
    expect(spy).toHaveBeenCalled();
  });

  it('#openSavingDialog should open SavingDialog', () => {
    // tslint:disable-next-line: no-empty : See above
    spyOn(service, 'manageWindowClosing').and.callFake(() => { });
    const spy = spyOn(service.dialog, 'open');
    service.openSavingDialog();
    expect(spy).toHaveBeenCalled();
  });

  it('#manageWindowClosing should call router.navigateByUrl', () => {
    spyOn(MatDialogRef.prototype, 'afterClosed').and.returnValue(of(true));
    const spy = spyOn(service.router, 'navigateByUrl');
    service.openNewDrawingDialog();   // Could be any function, they all call manageWindowClosing()
    expect(spy).toHaveBeenCalled();
  });
});
