import { Injectable } from '@angular/core';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ColorsService } from '../colors/colors.service';
import { ToolPropertiesService } from '../tools/tool-properties.service';

@Injectable({
  providedIn: 'root'
})
export class Text {

  alignment: string;
  color: string;
  isBold: boolean;
  isItalics: boolean;
  fontFamily: string;
  fontSize: number;
  textBody: string[];
  lines: number;
  startingPoint: Coordinates;

  constructor(protected colorsService: ColorsService, protected toolProperties: ToolPropertiesService) {
    this.startingPoint = new Coordinates(0, 0);
  }
}
