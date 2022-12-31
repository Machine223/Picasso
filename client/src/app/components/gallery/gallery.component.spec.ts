import { ObserversModule } from '@angular/cdk/observers';
import { Overlay } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCard, MatDialog, MatDialogModule, MatDialogRef, MatInputModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewDrawingAlertDialogComponent } from '@app-new-drawing/new-drawing-alert-dialog/new-drawing-alert-dialog.component';
import { of } from 'rxjs';
import { Drawing } from '../../../../../common/communication/drawing';
import { GalleryComponent } from './gallery.component';

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;
  const EMPTY_DRAWING: Drawing = {name: '', tags: [], metadata: '', previewSource: ''};
  const MOCK_DRAWING_A: Drawing = { name: 'TestA', tags: ['hello', 'world'], metadata: '', previewSource: ''};
  const MOCK_DRAWING_B: Drawing = { name: 'TestB', tags: ['hello', 'world'], metadata: '', previewSource: ''};
  const MOCK_DRAWING_C: Drawing = { name: 'TestC', tags: ['hello', 'world'], metadata: '', previewSource: ''};

  const mockDialogRef = {
    close: jasmine.createSpy('close'),
    afterClosed: jasmine.createSpy('afterClosed')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GalleryComponent,
        NewDrawingAlertDialogComponent,
        MatCard
      ],
      imports: [
        ObserversModule,
        FormsModule,
        MatDialogModule,
        MatInputModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        MatDialog,
        Overlay
      ],
    })
    .overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [NewDrawingAlertDialogComponent]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#selectDrawing should select a new drawing if no drawing is currently selected', () => {
    component.selectedDrawing = EMPTY_DRAWING;
    component.selectDrawing(MOCK_DRAWING_A);
    expect(component.selectedDrawing).toEqual(MOCK_DRAWING_A);
  });

  it('#selectDrawing should deselect current drawing if selected twice in a row', () => {
    component.selectedDrawing = EMPTY_DRAWING;
    component.selectDrawing(MOCK_DRAWING_A);
    component.selectDrawing(MOCK_DRAWING_A);
    expect(component.selectedDrawing).toEqual(EMPTY_DRAWING);
  });

  it('#tagFiltering should call sortDisplayedDrawings() even if no drawings match currentTagsList', () => {
    component.currentTagsList = ['test'];
    component.savedDrawings = [MOCK_DRAWING_A, MOCK_DRAWING_B];
    const spy = spyOn(component, 'sortDisplayedDrawings').and.callThrough();
    component.tagFiltering();
    expect(spy).toHaveBeenCalled();
  });

  it('#tagFiltering should call sortDisplayedDrawings() if some drawings match currentTagsList', () => {
    component.currentTagsList = ['hello'];
    component.savedDrawings = [MOCK_DRAWING_C, MOCK_DRAWING_A, MOCK_DRAWING_B];
    component.tagFiltering();
    expect(component.displayedDrawings.length).toEqual(component.savedDrawings.length);
  });

  it('#tagFiltering should not filter drawings if currentTagList = 0', () => {
    component.currentTagsList = [];
    component.tagFiltering();
    expect(component.displayedDrawings).toEqual(component.savedDrawings);
  });

  it('#updateAvailableTags should update tagList with savedDrawings\' tags', () => {
    component.savedDrawings = [MOCK_DRAWING_A];
    component.updateAvailableTags();
    expect(component.tagList).toEqual(MOCK_DRAWING_A.tags);
  });

  it('#addTag should push to currentTagsList if currentTag is not empty & not part of currentTagsList', () => {
    component.currentTag = 'hello';
    component.currentTagsList = [];
    component.addTag();
    expect(component.currentTagsList.length).toEqual(1);
  });

  it('#removeTag should remove tag from currentTagsList', () => {
    component.currentTagsList = ['hello'];
    component.removeTag('hello');
    expect(component.currentTagsList.length).toEqual(0);
  });

  it('#loadToDrawingZone should call loadingFeature.load upon success', () => {
    component.drawingProperties.isDrawingCreated = true;
    spyOn(MatDialogRef.prototype, 'afterClosed').and.returnValue(of(true));
    const spy = spyOn(component.loadingFeature, 'load').and.callThrough();
    component.loadToDrawingZone();
    expect(spy).toHaveBeenCalled();
  });

  it('#deleteFromDatabase should delete element locally if DELETE request is successful', async () => {
    component.selectedDrawing = MOCK_DRAWING_B;
    component.savedDrawings = [MOCK_DRAWING_A, MOCK_DRAWING_B];
    const spy = spyOn(component.savedDrawings, 'splice').and.callThrough();
    await component.deleteFromDatabase();
    expect(spy).toHaveBeenCalled();
  });

  // tslint:disable-next-line: no-any : done is necessary for async this async operation
  it('#deleteRequestPromise should alert the user if drawing cannot be found', async (done: any) => {
    spyOn(component.databaseRequests, 'deleteDrawing').and.returnValue(Promise.reject());
    const spy = spyOn(window, 'alert');
    component.deleteRequestPromise()
      .then(() => expect(spy).not.toHaveBeenCalled())
      .catch(() => expect(spy).toHaveBeenCalled());
    done();
  });

  it('#sanitize should return a sanitized url', () => {
    const spy = spyOn(component.sanitizer, 'bypassSecurityTrustUrl').and.callThrough();
    component.sanitize('http://www.test.com');
    expect(spy).toHaveBeenCalled();
  });

  it('#close should close the dialogRef', () => {
    component.close();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
