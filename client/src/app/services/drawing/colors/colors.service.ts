import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseColors } from '../../../../constants/constants';

enum Colors {Red = 0, Green = 1, Blue = 2}
enum ColorReferences {Main = 0, Secondary = 1, Background = 2}
const HEX_NUMBER = 16;
const ASCII_NUMBER_CONVERSION_MIN = 48;
const ASCII_NUMBER_CONVERSION_MAX = 57;
const ASCII_LETTER_CONVERSION_MIN = 87;
const ASCII_LETTER_CONVERSION_MAX = 102;

@Injectable({
  providedIn: 'root'
})
export class ColorsService {
  mainColor: BehaviorSubject<string>;
  secondaryColor: BehaviorSubject<string>;
  mainColorAlpha: BehaviorSubject<number>;
  secondaryColorAlpha: BehaviorSubject<number>;

  backgroundColor: string = BaseColors.White;
  colorPresets: string[] = [
    BaseColors.Black, BaseColors.White, BaseColors.Pink, BaseColors.Purple, BaseColors.Blue,
    BaseColors.Teal, BaseColors.Green, BaseColors.Yellow, BaseColors.Orange, BaseColors.Red
  ];
  currentColor: string;

  constructor() {
    this.mainColor = new BehaviorSubject<string>(BaseColors.Black);
    this.secondaryColor = new BehaviorSubject<string>(BaseColors.Blue);
    this.mainColorAlpha = new BehaviorSubject<number>(1);
    this.secondaryColorAlpha = new BehaviorSubject<number>(1);
    this.currentColor = '';
  }

  confirmColor(colorReference: number): void {
    const mapColorReferences = new Map<number, () => void>();
    mapColorReferences.set(ColorReferences.Main, () => {
      this.mainColor.next(this.currentColor);
      this.presetColorCheck(this.currentColor);
    });
    mapColorReferences.set(ColorReferences.Secondary, () => {
      this.secondaryColor.next(this.currentColor);
      this.presetColorCheck(this.currentColor);
    });
    mapColorReferences.set(ColorReferences.Background, () => {
      this.backgroundColor = this.currentColor; });

    (mapColorReferences.get(colorReference) || (() => null))();
    this.currentColor = '';
  }

  colorSwap(): void {
    const tempColor = this.mainColor.getValue();
    this.mainColor.next(this.secondaryColor.getValue());
    this.secondaryColor.next(tempColor);
    const tempAlpha = this.mainColorAlpha.getValue();
    this.mainColorAlpha.next(this.secondaryColorAlpha.getValue());
    this.secondaryColorAlpha.next(tempAlpha);
  }

  createColorReference(color: string): number {
    const mapCreateColor = new Map<string, number>();
    mapCreateColor.set(this.mainColor.getValue(), ColorReferences.Main);
    mapCreateColor.set(this.secondaryColor.getValue(), ColorReferences.Secondary);
    mapCreateColor.set(this.backgroundColor, ColorReferences.Background);

    return mapCreateColor.get(color) || ColorReferences.Main;
  }

  presetModification(color: string, index: number = this.colorPresets.length - 1): void {
    for (let i = index; i > 0; i--) {
      this.colorPresets[i] = this.colorPresets[i - 1];
    }
    this.colorPresets[0] = color;
  }

  presetColorCheck(color: string): void {
    let index = this.colorPresets.length - 1;
    for (let i = 0; i < this.colorPresets.length - 1; i++) {
      if (this.colorPresets[i] === color) {
        index = i;
        break;
      }
    }
    this.presetModification(color, index);
  }

  presetMainColorUse(index: number): void {
    if (0 <= index && index <= this.colorPresets.length - 1) {
      this.mainColor.next(this.colorPresets[index]);
      this.presetModification(this.mainColor.getValue(), index);
    }
  }

  presetSecondaryColorUse(index: number): void {
    if (0 <= index && index <= this.colorPresets.length - 1) {
      this.secondaryColor.next(this.colorPresets[index]);
      this.presetModification(this.secondaryColor.getValue(), index);
    }
  }

  getColorAsRGBa(color: string, alpha: number): string {
    return 'rgba(' + this.getColorAsNumbers(color, Colors.Red) +
      ',' + this.getColorAsNumbers(color, Colors.Green) +
      ',' + this.getColorAsNumbers(color, Colors.Blue) +
      ',' + alpha + ')';
  }

  getMainColorRGBA(): string {
    return this.getColorAsRGBa(this.mainColor.getValue(), this.mainColorAlpha.getValue());
  }

  getSecondaryColorRGBA(): string {
    return this.getColorAsRGBa(this.secondaryColor.getValue(), this.secondaryColorAlpha.getValue());
  }

  getColorAsNumbers(color: string, rgb: Colors): number {
    color.toLowerCase();
    let firstCharacter = color.charCodeAt(2 * rgb + 1);
    firstCharacter = this.getHexFromCharPosition(firstCharacter, true);
    let secondCharacter = color.charCodeAt(2 * rgb + 2);
    secondCharacter = this.getHexFromCharPosition(secondCharacter, false);
    return firstCharacter + secondCharacter;
  }

  getHexFromCharPosition(character: number, isFirst: boolean): number {
    if (character <= ASCII_NUMBER_CONVERSION_MAX) {
      character = (character - ASCII_NUMBER_CONVERSION_MIN);
    } else if (character <= ASCII_LETTER_CONVERSION_MAX) {
      character = (character - ASCII_LETTER_CONVERSION_MIN);
    }
    if (isFirst) {
      character = character * HEX_NUMBER;
    }
    return character;
  }

  getNumbersAsColor(rgb: Uint8ClampedArray): string {
    let colorString = '#';
    for (let i = 0; i < rgb.length - 1; i++) {
      if (rgb[i].toString(HEX_NUMBER).length === 2) {
        colorString = colorString.concat(rgb[i].toString(HEX_NUMBER));
      } else {
        colorString = colorString.concat('0' + rgb[i].toString(HEX_NUMBER));
      }
    }
    return colorString;
  }
}
