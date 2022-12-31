import { Overlay } from '@angular/cdk/overlay';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatIcon, MatInputModule, MatSlider } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { ColorEditPaletteComponent } from '../color-edit/color-edit-palette/color-edit-palette.component';
import { ColorEditSliderComponent } from '../color-edit/color-edit-slider/color-edit-slider.component';
import { ColorEditComponent } from '../color-edit/color-edit.component';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ColorPickerComponent,
        MatIcon,
        MatSlider,
        ColorEditComponent,
        ColorEditPaletteComponent,
        ColorEditSliderComponent
     ],
      imports: [
        FormsModule,
        MatInputModule,
        MatDialogModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [Overlay]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ ColorEditComponent ],
      }})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onRightClick should set the presetSecondaryColorUse of the color service and return false', inject([ColorsService],
    (colorsService: ColorsService) => {
    spyOn(colorsService, 'presetSecondaryColorUse').and.callThrough();
    const result = component.onRightClick(2);
    expect(colorsService.presetSecondaryColorUse).toHaveBeenCalled();
    expect(result).toEqual(false);
  }));

  it('#openColorEditPanel should set the currentColor of the color service', inject([ColorsService],
    (colorsService: ColorsService) => {
    colorsService.currentColor = 'blue';
    component.openColorEditPanel('#ffffff');
    expect(colorsService.currentColor).toEqual('#ffffff');
  }));
});
