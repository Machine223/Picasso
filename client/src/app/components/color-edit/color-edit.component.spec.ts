import { OverlayModule} from '@angular/cdk/overlay';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { ColorEditPaletteComponent } from './color-edit-palette/color-edit-palette.component';
import { ColorEditSliderComponent } from './color-edit-slider/color-edit-slider.component';
import { ColorEditComponent } from './color-edit.component';

describe('ColorEditComponent', () => {
  let component: ColorEditComponent;
  let fixture: ComponentFixture<ColorEditComponent>;

  const dialogMock = {
    // tslint:disable-next-line: no-empty
    close: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ColorEditComponent,
        ColorEditPaletteComponent,
        ColorEditSliderComponent
      ],
      imports: [
        FormsModule,
        MatInputModule,
        MatDialogModule,
        OverlayModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock},
        { provide: MAT_DIALOG_DATA, useValue: {}}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#setHover should set this.isHovering to true if cursor is hovering', () => {
    component.isHovering = false;
    const initialHoveringState = component.isHovering;
    component.setHover(true);
    const finalHoveringState = component.isHovering;
    expect(initialHoveringState).not.toEqual(finalHoveringState);
  });

  it('#confirm should not call confirmColor when currentColor has a value', inject([ColorsService], (colorsService: ColorsService) => {
    colorsService.currentColor = 'blue';
    spyOn(colorsService, 'confirmColor').and.callThrough();
    component.confirmColor();
    expect(colorsService.confirmColor).toHaveBeenCalled();
  }));

  it('#confirm should not call confirmColor when currentColor has no value', inject([ColorsService], (colorsService: ColorsService) => {
    colorsService.currentColor = '';
    spyOn(colorsService, 'confirmColor').and.callThrough();
    component.confirmColor();
    expect(colorsService.confirmColor).toHaveBeenCalledTimes(0);
  }));

  it('#closeDialog should call dialorRef.close', () => {
    const spy = spyOn(component.dialogRef, 'close');
    component.closeDialog();
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseMove should call onColorChange', () => {
    spyOn(component, 'onColorChange').and.callThrough();
    component.onMouseMove();
    expect(component.onColorChange).toHaveBeenCalled();
  });

  it('#onMouseUp should call onColorChange', () => {
    spyOn(component, 'onColorChange').and.callThrough();
    component.onMouseUp();
    expect(component.onColorChange).toHaveBeenCalled();
  });

  it('#onColorChange should not update currentColor when color length is not 7', inject([ColorsService], (colorsService: ColorsService) => {
    colorsService.currentColor = 'white';
    component.color = 'blue';
    component.onColorChange();
    expect(colorsService.currentColor).toBe('white');
  }));

  it('#onColorChange should update currentColor when color length is 7', inject([ColorsService], (colorsService: ColorsService) => {
    colorsService.currentColor = '#ffffff';
    component.color = '#292929';
    component.onColorChange();
    expect(colorsService.currentColor).toBe('#292929');
  }));

  it('#onHexKey should update currentColor when color length is 7', inject([ColorsService], (colorsService: ColorsService) => {
    colorsService.currentColor = '#ffffff';
    component.color = '#292929';
    component.onHexKey();
    expect(colorsService.currentColor).toBe('#292929');
  }));

  it('#onHexKey should not update currentColor when color length is not 7', inject([ColorsService], (colorsService: ColorsService) => {
    colorsService.currentColor = 'white';
    component.color = 'blue';
    component.onHexKey();
    expect(colorsService.currentColor).toBe('white');
  }));

  it('#onRGBKey should modify currentColor with a valid colorReference', inject([ColorsService], (colorsService: ColorsService) => {
    const RGB_MAX_VALUE = 255;
    colorsService.currentColor = 'white';
    component.redColor = RGB_MAX_VALUE;
    component.blueColor = 0;
    component.greenColor = 0;
    component.onRGBKey(RGB_MAX_VALUE);
    expect(colorsService.currentColor).toBe('#ff0000');
  }));

  it('#onRGBKey should not modify currentColor with an invalid colorReference', inject([ColorsService], (colorsService: ColorsService) => {
    const RGB_MAX_VALUE = 255;
    colorsService.currentColor = 'white';
    component.color = 'blue';
    component.onRGBKey(RGB_MAX_VALUE + 1);
    expect(colorsService.currentColor).not.toBe('blue');
  }));
});
