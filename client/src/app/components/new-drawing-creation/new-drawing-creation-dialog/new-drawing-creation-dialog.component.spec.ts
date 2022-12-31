import { ObserversModule } from '@angular/cdk/observers';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { of } from 'rxjs';
import { ColorEditPaletteComponent } from '../../color-edit/color-edit-palette/color-edit-palette.component';
import { ColorEditSliderComponent } from '../../color-edit/color-edit-slider/color-edit-slider.component';
import { ColorEditComponent } from '../../color-edit/color-edit.component';
import { NewDrawingAlertDialogComponent } from '../new-drawing-alert-dialog/new-drawing-alert-dialog.component';
import { NewDrawingCreationDialogComponent } from './new-drawing-creation-dialog.component';

describe('NewDrawingCreationDialogComponent', () => {
  let component: NewDrawingCreationDialogComponent;
  let fixture: ComponentFixture<NewDrawingCreationDialogComponent>;
  const dialogMock = { close: () =>  null };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NewDrawingCreationDialogComponent,
        NewDrawingAlertDialogComponent,
        ColorEditComponent,
        ColorEditPaletteComponent,
        ColorEditSliderComponent
       ],
      providers: [
        ColorsService,
        MatDialogConfig,
        { provide: MatDialogRef, useValue:  dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        Overlay,
        ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatDialogModule,
        MatInputModule,
        ObserversModule,
        OverlayModule,
        ReactiveFormsModule,
        RouterModule.forRoot(
          [
            { path: '', component: NewDrawingCreationDialogComponent}
          ]
        )
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ColorEditComponent, NewDrawingAlertDialogComponent ],
      }})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDrawingCreationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#constructor should construct drawing form', () => {
    expect(component.drawingForm).toBeTruthy();
  });

  it('#openColorEditPanel should set the currentColor of the color service',
  inject([ColorsService], (colorsService: ColorsService) => {
    colorsService.currentColor = 'blue';
    component.openColorEditPanel('#ffffff');
    expect(colorsService.currentColor).toEqual('#ffffff');
  }));

  it('#createDrawing should open AlertDialog if a drawing is created', () => {
    localStorage.clear();
    localStorage.setItem('test', 'Test entry');
    const spy = spyOn(component, 'openAlertDialog');
    component.createDrawing();
    expect(spy).toHaveBeenCalled();
  });

  it('#createDrawing should call creationOfDrawing if drawing is not created', () => {
    localStorage.clear();
    const spy = spyOn(component.drawingPropertiesService, 'creationOfDrawing');
    component.createDrawing();
    expect(spy).toHaveBeenCalled();
  });

  it('#closeDrawingCreation should call dialogRef.close', () => {
    spyOn(component.dialogRef, 'close').and.callThrough();
    component.closeDrawingCreation();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('#onResize should call drawingForm.patchValue', () => {
    spyOn(component.drawingForm, 'patchValue').and.callThrough();
    component.onResize();
    expect(component.drawingForm.patchValue).toHaveBeenCalled();
  });

  it('#openAlertDialog should open AlertDialog and configure drawing when confirmed', () => {
    spyOn(MatDialogRef.prototype, 'afterClosed').and.returnValue(of(true));
    const openSpy = spyOn(MatDialog.prototype, 'open').and.callThrough();
    const configurationSpy = spyOn(component.drawingPropertiesService, 'creationOfDrawing');
    component.openAlertDialog();
    expect(openSpy).toHaveBeenCalled();
    expect(configurationSpy).toHaveBeenCalled();
  });
});
