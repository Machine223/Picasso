import { Renderer2 } from '@angular/core';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { BorderExtremum } from './border-extremum';

const MAXUINT8 = 255;
const SQUARE = 2;
const MULTIPLIER = 3;
const RGBLENGTH = 3;
const PERCENTAGE = 100;
const MAX_DISTANCE = Math.pow(MAXUINT8, SQUARE) * MULTIPLIER;

export class PaintBucketFiller {

  contextCanvasToCheck: CanvasRenderingContext2D;
  contextCanvasOnlyFill: CanvasRenderingContext2D;
  canvasFill: HTMLCanvasElement;
  renderer: Renderer2;
  canvasSize: {height: number, width: number};
  colorToChange: Uint8ClampedArray;
  tolerance: number;
  colorToApplyTable: Uint8ClampedArray;
  colorMeet: string[];

  constructor(canvas: HTMLCanvasElement, renderer: Renderer2, colorToChange: Uint8ClampedArray,
              colorToApply: string, colorToApplyTable: Uint8ClampedArray, tolerance: number) {
    this.contextCanvasToCheck = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.contextCanvasToCheck.fillStyle = colorToApply;
    this.canvasSize = {height: canvas.height, width: canvas.width};
    this.colorToChange = colorToChange;
    this.renderer = renderer;
    this.initializeCanvas();
    this.contextCanvasOnlyFill.fillStyle = colorToApply;
    this.tolerance = tolerance / PERCENTAGE;
    this.colorToApplyTable = colorToApplyTable;
    this.colorMeet = [];
  }

  initializeCanvas(): void {
    this.canvasFill = this.renderer.createElement('canvas') as HTMLCanvasElement;
    this.renderer.setProperty(this.canvasFill, 'width', this.canvasSize.width);
    this.renderer.setProperty(this.canvasFill, 'height', this.canvasSize.height);
    this.contextCanvasOnlyFill = this.canvasFill.getContext('2d') as CanvasRenderingContext2D;
  }

  performFill(coordinates: Coordinates): void {
    const pointsToVerify: Coordinates[] = [];
    pointsToVerify.push(coordinates);
    while (pointsToVerify.length > 0) {
      this.fill(pointsToVerify.shift() as Coordinates, pointsToVerify);
    }
  }

  fill(coordinates: Coordinates, pointsToVerify: Coordinates[]): void {
    this.contextCanvasToCheck.fillRect(coordinates.xPosition, coordinates.yPosition, 1, 1);
    this.contextCanvasOnlyFill.fillRect(coordinates.xPosition, coordinates.yPosition, 1, 1);
    this.verifyCoordinates(coordinates.xPosition, coordinates.yPosition - 1, pointsToVerify);
    this.verifyCoordinates(coordinates.xPosition, coordinates.yPosition + 1, pointsToVerify);
    this.verifyCoordinates(coordinates.xPosition - 1, coordinates.yPosition, pointsToVerify);
    this.verifyCoordinates(coordinates.xPosition + 1, coordinates.yPosition, pointsToVerify);
  }

  verifyCoordinates(xPosition: number, yPosition: number, pointsToVerify: Coordinates[]): void {
    if (xPosition < 0 || yPosition < 0 || xPosition > this.canvasSize.width || yPosition > this.canvasSize.height) {
      return;
    }
    if (this.contextCanvasToCheck.getImageData(xPosition, yPosition, 1, 1).data.toString() === this.colorToApplyTable.toString()) {
      return;
    }
    if (!this.isColorInTolerance(xPosition, yPosition)) {
      return;
    }
    if (this.deepIndexOf(pointsToVerify, xPosition, yPosition) !== -1) {
      return;
    }
    pointsToVerify.push(new Coordinates(xPosition, yPosition));
  }

  isColorInTolerance(xPosition: number, yPosition: number): boolean {
    const  canvasColor = this.contextCanvasToCheck.getImageData(xPosition, yPosition, 1, 1).data;
    const found = this.colorMeet.includes(canvasColor.toString());
    if (!found) {
      return this.euclidianTolerance(canvasColor);
    } else {
      return true;
    }
  }

  deepIndexOf(arr: Coordinates[], xPosition: number, yPosition: number): number {
    return arr.findIndex((cur) => {
      return xPosition === cur.xPosition && yPosition === cur.yPosition;
    });
  }

  fillOuter(extremumShape: BorderExtremum): void {
    const spaceToLeaveEmpty = 10;
    this.contextCanvasToCheck.fillRect(0, 0, this.canvasSize.width, extremumShape.yMin - spaceToLeaveEmpty);
    this.contextCanvasToCheck.fillRect(0, 0, extremumShape.xMin - spaceToLeaveEmpty, this.canvasSize.height);
    this.contextCanvasToCheck.fillRect(extremumShape.xMax + spaceToLeaveEmpty, 0,
      this.canvasSize.width - extremumShape.xMax - spaceToLeaveEmpty, this.canvasFill.height);
    this.contextCanvasToCheck.fillRect(0, extremumShape.yMax + spaceToLeaveEmpty,
      this.canvasSize.width, this.canvasSize.height - extremumShape.yMax - spaceToLeaveEmpty);
  }

  euclidianDistance(firstColor: Uint8ClampedArray, secondColor: Uint8ClampedArray): number {
    let distance = 0;
    for ( let i = 0; i < RGBLENGTH; i++) {
      distance += Math.pow(firstColor[i] - secondColor[i], 2);
    }
    return distance;
  }

  euclidianTolerance(firstColor: Uint8ClampedArray): boolean {
    const euclidianDistance = this.euclidianDistance(firstColor, this.colorToChange);
    const euclidianTolerance = euclidianDistance / MAX_DISTANCE;
    if (this.tolerance >= euclidianTolerance) {
      this.colorMeet.push(firstColor.toString());
      return true;
    } else {
      return false;
    }
  }
}
