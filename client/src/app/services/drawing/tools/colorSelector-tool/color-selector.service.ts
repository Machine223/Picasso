import { Injectable } from '@angular/core';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { MOUSE } from 'constants/constants';
import { ColorToolService } from '../color-tool.service';

@Injectable({
  providedIn: 'root'
})
export class ColorSelectorService extends ColorToolService {

  context2D: CanvasRenderingContext2D;

  constructor(public colorsService: ColorsService) {
    super(colorsService);
  }

  onMouseUp(event: MouseEvent): void {
    const colorStringRGB = this.getColor(event);
    const buttonSelected = event.button;
    if (buttonSelected === MOUSE.LeftButton && this.isIn) {
      this.colorsService.mainColor.next(colorStringRGB);
    } else if (buttonSelected === MOUSE.RightButton && this.isIn) {
      this.colorsService.secondaryColor.next(colorStringRGB);
    }
  }

  updateCanvasSVG(contextUpdate: CanvasRenderingContext2D): void {
    this.context2D = contextUpdate;
  }

  getColorPosition(event: MouseEvent): Uint8ClampedArray {
    return this.context2D.getImageData(event.offsetX, event.offsetY, 1, 1).data;
  }

  getColor(event: MouseEvent): string {
    const imageColorPosition = this.getColorPosition(event);
    return this.colorsService.getNumbersAsColor(imageColorPosition);
  }

}
