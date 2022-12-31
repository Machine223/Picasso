import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckbox,
         MatDialogModule,
         MatFormField,
         MatIcon,
         MatLabel,
         MatOption,
         MatPseudoCheckbox,
         MatRippleModule,
         MatSelect,
         MatSlider,
         MatSnackBarModule} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { Alignments, Fonts, Junctions, Strokes, Textures } from 'constants/constants';
import { ColorPickerComponent } from '../../color-picker/color-picker.component';
import { DrawingModalWindowComponent } from './drawing-modal-window.component';

describe('DrawingModalWindowComponent', () => {
  let component: DrawingModalWindowComponent;
  let fixture: ComponentFixture<DrawingModalWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DrawingModalWindowComponent,
        ColorPickerComponent,
        MatSlider,
        MatLabel,
        MatOption,
        MatFormField,
        MatSlider,
        MatSelect,
        MatIcon,
        MatCheckbox,
        MatPseudoCheckbox
      ],
      imports: [
        FormsModule,
        MatRippleModule,
        MatDialogModule,
        ObserversModule,
        OverlayModule,
        RouterTestingModule,
        MatDialogModule,
        MatSnackBarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#changeJunctionType should set a new junction type in ToolPropertiesService', () => {
    const oldJunction = Junctions.Normal;
    const newJunction = Junctions.Dotted;
    component.toolProperties.junctionType = oldJunction;
    component.changeJunctionType(newJunction, true);
    expect(component.toolProperties.junctionType).toEqual(newJunction);
  });

  it('#changeStrokeType should set a new stroke type in ToolPropertiesService', () => {
    const oldStroke = Strokes.Full;
    const newStroke = Strokes.Both;
    component.toolProperties.junctionType = oldStroke;
    component.changeStrokeType(newStroke, true);
    expect(component.toolProperties.strokeType).toEqual(newStroke);
  });

  it('#changeTextureType should set a new texture type in ToolPropertiesService', () => {
    const oldTexture = Textures.Texture1;
    const newTexture = Textures.Texture4;
    component.toolProperties.textureType = oldTexture;
    component.changeTextureType(newTexture, true);
    expect(component.toolProperties.textureType).toEqual(newTexture);
  });

  it('#changeFontFamily should set a new fontFamily in ToolPropertiesService', () => {
    const oldFontFamily = Fonts.Arial;
    const newFontFamily = Fonts.Helvetica;
    component.toolProperties.fontFamily = oldFontFamily;
    component.changeFontFamily(newFontFamily, true);
    expect(component.toolProperties.fontFamily).toEqual(newFontFamily);
  });

  it('#changeTextAlignment should set a new text alignment in ToolPropertiesService', () => {
    const oldAlignment = Alignments.Centered;
    const newAlignment = Alignments.Left;
    component.toolProperties.textAlignment = oldAlignment;
    component.changeTextAlignment(newAlignment, true);
    expect(component.toolProperties.textAlignment).toEqual(newAlignment);
  });

  it('#changeGridSize should call pathToString', () => {
    const spy = spyOn(component.gridService, 'pathToString').and.callThrough();
    component.changeGridSize();
    expect(spy).toHaveBeenCalled();
  });
});
