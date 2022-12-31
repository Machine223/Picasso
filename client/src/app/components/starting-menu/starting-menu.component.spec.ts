import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardSubtitle, MatCardTitle, MatDialogModule, MatInputModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { GalleryComponent } from '@app-components/gallery/gallery.component';
import { NewDrawingCreationDialogComponent } from '@app-new-drawing/new-drawing-creation-dialog/new-drawing-creation-dialog.component';
import { Drawing } from '../../../../../common/communication/drawing';
import { StartingMenuComponent } from './starting-menu.component';

const MOCK_DRAWING = { name: 'test', tags: [], metadata: '', previewSource: '' } as Drawing;

describe('StartingMenuComponent', () => {
  let component: StartingMenuComponent;
  let fixture: ComponentFixture<StartingMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StartingMenuComponent,
        NewDrawingCreationDialogComponent,
        GalleryComponent,
        MatCard,
        MatCardTitle,
        MatCardSubtitle,
      ],
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
    })
    .overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          NewDrawingCreationDialogComponent,
          GalleryComponent
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#savedDrawingsChange should set savedDrawings', async () => {
    const parameter = [MOCK_DRAWING];
    await component.savedDrawingsChange(parameter);
    const newValue = component.savedDrawings;
    expect(parameter).toEqual(newValue);
    expect(component.hasSavedDrawings).toBe(true);
  });

  it('#openDialog should call openNewDrawingDialog', () => {
    const spy = spyOn(component.openDialogService, 'openNewDrawingDialog').and.callThrough();
    component.openDialog();
    expect(spy).toHaveBeenCalled();
  });

  it('#openGallery should call openGallery', () => {
    const spy = spyOn(component.openDialogService, 'openGallery').and.callThrough();
    component.openGallery();
    expect(spy).toHaveBeenCalled();
  });

  it('#continueDrawing should call continueDrawing', () => {
    const spy = spyOn(component.openDialogService, 'continueDrawing').and.callThrough();
    component.continueDrawing();
    expect(spy).toHaveBeenCalled();
  });
});
