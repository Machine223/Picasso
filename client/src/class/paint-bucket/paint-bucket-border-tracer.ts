
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { Direction } from '../../constants/constants';
import { BorderExtremum } from './border-extremum';
import { PaintBucketDirectionPathDetermination } from './paint-bucket-direction-path-determination';
const NBDIRECTION = (Object.keys(Direction).length / 2);

export class PaintBucketBorderTracer {
  context: CanvasRenderingContext2D;
  borderExtremum: BorderExtremum;
  colorApplied: Uint8ClampedArray;
  pixelCoodinatesMap: Map<Direction, Coordinates>;

  constructor(context: CanvasRenderingContext2D, colorApplied: Uint8ClampedArray) {
    this.context = context;
    this.colorApplied = colorApplied;
    this.borderExtremum = { xMin: Number.MAX_VALUE, xMax: 0, yMin: Number.MAX_VALUE, yMax: 0 };
    this.pixelCoodinatesMap = new Map<Direction, Coordinates>();
  }

  traceBorder(coordinates: Coordinates): string {
    const rotation = Object.keys(Direction).length - 1;
    let currentPosition = coordinates;
    let previousDirection = Direction.W;
    let path = 'M ' + coordinates.xPosition + ' ' + coordinates.yPosition;
    if (this.checkIfHoleOnePixel(coordinates)) {
      return this.pathForOnePixelHole(coordinates);
    }
    let pixelToCheck: Coordinates = this.getPixelCoordinates(currentPosition, previousDirection);
    while (this.context.getImageData(pixelToCheck.xPosition, pixelToCheck.yPosition, 1, 1).data.toString()
            !== this.colorApplied.toString()) {
      previousDirection = (previousDirection + 1) % (Object.keys(Direction).length / 2);
      pixelToCheck = this.getPixelCoordinates(currentPosition, previousDirection);
    }
    currentPosition = pixelToCheck;
    let direction: Direction = previousDirection;
    while (currentPosition.xPosition !== coordinates.xPosition || currentPosition.yPosition !== coordinates.yPosition) {
      let isFound = false;
      direction = (direction + rotation) % (Object.keys(Direction).length / 2);
      pixelToCheck = this.getPixelCoordinates(currentPosition, direction);
      if (this.context.getImageData(pixelToCheck.xPosition, pixelToCheck.yPosition, 1, 1).data.toString()
              === this.colorApplied.toString()) {
        currentPosition = pixelToCheck;
        isFound = true;
        this.findExtremum(currentPosition);
      }
      if (direction.toString() !== previousDirection.toString() && isFound) {
        path += PaintBucketDirectionPathDetermination.setTraceEdgeOptimisationMap(direction, previousDirection, currentPosition);
        previousDirection = direction;
        isFound = false;
      } else {
        if (!isFound) {
          direction = direction + 2;
        }
      }
    }
    path += 'Z ';
    return path;
  }

  getPixelCoordinates(coordinates: Coordinates, direction: Direction): Coordinates {
    direction = direction % NBDIRECTION;
    this.pixelCoodinatesMap.set(Direction.E, new Coordinates(coordinates.xPosition + 1, coordinates.yPosition));
    this.pixelCoodinatesMap.set(Direction.NE, new Coordinates(coordinates.xPosition + 1, coordinates.yPosition - 1));
    this.pixelCoodinatesMap.set(Direction.N, new Coordinates(coordinates.xPosition, coordinates.yPosition - 1));
    this.pixelCoodinatesMap.set(Direction.NW, new Coordinates(coordinates.xPosition - 1, coordinates.yPosition - 1));
    this.pixelCoodinatesMap.set(Direction.W, new Coordinates(coordinates.xPosition - 1, coordinates.yPosition));
    this.pixelCoodinatesMap.set(Direction.SW, new Coordinates(coordinates.xPosition - 1, coordinates.yPosition + 1));
    this.pixelCoodinatesMap.set(Direction.S, new Coordinates(coordinates.xPosition, coordinates.yPosition + 1));
    this.pixelCoodinatesMap.set(Direction.SE, new Coordinates(coordinates.xPosition + 1, coordinates.yPosition + 1));
    return this.pixelCoodinatesMap.get(direction) as Coordinates;
  }

  findExtremum(coordinates: Coordinates): void {
    if (this.borderExtremum.xMin > coordinates.xPosition) {
      this.borderExtremum.xMin = coordinates.xPosition;
    }
    if (this.borderExtremum.xMax < coordinates.xPosition) {
      this.borderExtremum.xMax = coordinates.xPosition;
    }
    if (this.borderExtremum.yMin > coordinates.yPosition) {
      this.borderExtremum.yMin = coordinates.yPosition;
    }
    if (this.borderExtremum.yMax < coordinates.yPosition) {
      this.borderExtremum.yMax = coordinates.yPosition;
    }
  }

  checkIfHoleOnePixel(coordinates: Coordinates): boolean {
    if (this.context.getImageData(coordinates.xPosition + 2, coordinates.yPosition, 1, 1).data.toString()
            === this.colorApplied.toString()) {
      return false;
    }
    if (this.context.getImageData(coordinates.xPosition, coordinates.yPosition + 2, 1, 1).data.toString()
            === this.colorApplied.toString()) {
      return false;
    }
    if (this.context.getImageData(coordinates.xPosition - 2, coordinates.yPosition, 1, 1).data.toString()
            === this.colorApplied.toString()) {
      return false;
    }
    return this.context.getImageData(coordinates.xPosition, coordinates.yPosition - 2, 1, 1).data.toString()
      !== this.colorApplied.toString();

  }

  pathForOnePixelHole(coordinates: Coordinates): string {
    const correction = 0.8;
    return 'M ' + (coordinates.xPosition) + ' ' + (coordinates.yPosition + correction) + 'a1 1 0 0 1 2 0  a1 1 0 0 1 -2 0 Z ';
  }
}
