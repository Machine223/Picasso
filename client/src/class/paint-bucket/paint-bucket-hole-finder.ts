import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { BorderExtremum } from './border-extremum';

export class PaintBucketHoleFinder {

  canvasContextToScan: CanvasRenderingContext2D;
  borderExtremum: BorderExtremum;
  colorApplied: Uint8ClampedArray;

  constructor(canvasContext: CanvasRenderingContext2D, borderExtremum: BorderExtremum, colorApplied: Uint8ClampedArray ) {
    this.canvasContextToScan = canvasContext;
    this.borderExtremum = borderExtremum;
    this.colorApplied = colorApplied;
  }

  findHole(startCoordinates: Coordinates): Coordinates {
    for (let i = startCoordinates.xPosition; i < this.borderExtremum.xMax; i++) {
      for (let j = 0; j < this.borderExtremum.yMax; j++) {
        if (!this.pixelColorOfFill(i, j)) {
          return new Coordinates(i, j);
        }
      }
    }
    return new Coordinates(-1, -1);
  }

  pixelColorOfFill(xPosition: number, yPosition: number): boolean {
    return this.canvasContextToScan.getImageData(xPosition, yPosition, 1, 1).data.toString()
       === this.colorApplied.toString();
  }
}
