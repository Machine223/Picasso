import { OverlayRef } from '@angular/cdk/overlay';
import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ColorsService } from '@app-services/drawing/colors/colors.service';

// This component and it's 2 child components color-edit-palette and color-edit-slider are based
// on a color picker tutorial by Lukas Marx: https://malcoded.com/posts/angular-color-picker/

const HEX_CHAR_COUNT = 7;
const RGB_MAX_VALUE = 255;

@Component({
  selector: 'app-color-edit',
  templateUrl: './color-edit.component.html',
  styleUrls: ['./color-edit.component.scss']
})
export class ColorEditComponent {

  isHovering: boolean;
  hue: string;
  color: string;
  overlayRef: OverlayRef;
  redColor: number;
  greenColor: number;
  blueColor: number;

  constructor(private colorsService: ColorsService,
              public dialogRef: MatDialogRef<ColorEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {colorReference: number}) {
    this.isHovering = false;
    this.color = this.colorsService.currentColor;
    this.updateRGB();
  }

  setHover(bool: boolean): void {
    this.isHovering = bool;
  }

  confirmColor(): void {
    if (this.colorsService.currentColor !== '') {
      this.colorsService.confirmColor(this.data.colorReference);
    }
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  returnToNumber(): void {
    this.redColor = Number(this.redColor);
    this.greenColor = Number(this.greenColor);
    this.blueColor = Number(this.blueColor);
  }

  updateRGB(): void {
    this.redColor = this.colorsService.getColorAsNumbers(this.color, 0);
    this.greenColor = this.colorsService.getColorAsNumbers(this.color, 1);
    this.blueColor = this.colorsService.getColorAsNumbers(this.color, 2);
  }

  onHexKey(): void {
    if (this.color.length === HEX_CHAR_COUNT) {
      this.colorsService.currentColor = this.color;
      this.updateRGB();
    }
  }

  onRGBKey(colorReference: number): void {
    this.returnToNumber();
    if (colorReference <= RGB_MAX_VALUE) {
      const rgbColors = [this.redColor, this.greenColor, this.blueColor, 0];
      this.color = this.colorsService.getNumbersAsColor(rgbColors as unknown as Uint8ClampedArray);
      this.colorsService.currentColor = this.color;
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(): void {
    this.onColorChange();
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(): void {
    this.onColorChange();
  }

  onColorChange(): void {
    if (this.color.length === HEX_CHAR_COUNT) {
      this.updateRGB();
      this.colorsService.currentColor = this.color;
    }
  }
}
