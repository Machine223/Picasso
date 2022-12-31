import { Injectable } from '@angular/core';
import { Alignments, Fonts, Junctions, Strokes, Textures } from '../../../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ToolPropertiesService {
  strokeWidth: number;
  dotDiameter: number;
  dotSprayDiameter: number;
  dotSprayInterval: number;
  junctionType: string;
  strokeType: string;
  sidesCount: number;
  textureType: number;
  fontFamily: string;
  fontSize: number;
  textAlignment: string;
  bold: boolean;
  italics: boolean;
  eraserSize: number;
  gridSelected: boolean;
  paintBucketTolerance: number;

  constructor() {
    this.setDefaultValues();
  }

  setDefaultValues(): void {
    const defaultStrokeWidth = 5;
    const defaultDotDiameter = 10;
    const defaultDotSprayDiameter = 30;
    const defaultDotSprayInterval = 40;
    const defaultJunctionType: string = Junctions.Normal;
    const defaultStrokeType: string = Strokes.Outline;
    const defaultTextureType: number = Textures.Texture1;
    const defaultSidesCount = 3;
    const defaultFontFamily = Fonts.Arial;
    const defaultFontSize = 12;
    const defaultTextAlignment = Alignments.Left;
    const defaultEraserSize = 3;

    this.strokeWidth = defaultStrokeWidth;
    this.dotDiameter = defaultDotDiameter;
    this.junctionType = defaultJunctionType;
    this.strokeType = defaultStrokeType;
    this.sidesCount = defaultSidesCount;
    this.textureType = defaultTextureType;
    this.dotSprayDiameter = defaultDotSprayDiameter;
    this.dotSprayInterval = defaultDotSprayInterval;
    this.fontFamily = defaultFontFamily;
    this.fontSize = defaultFontSize;
    this.textAlignment = defaultTextAlignment;
    this.bold = false;
    this.italics = false;
    this.eraserSize = defaultEraserSize;
    this.gridSelected = false;
    this.paintBucketTolerance = 0;
  }

  gridChange(): void {
    this.gridSelected = !(this.gridSelected);
  }
}
