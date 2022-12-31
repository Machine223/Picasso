import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { PaintBucketHoleFinder } from './paint-bucket-hole-finder';

describe('PaintBucketHoleFinder', () => {
  let instance: PaintBucketHoleFinder;
  let array: Uint8ClampedArray;
  beforeEach(() => {
    const arrayLength = 3;
    const colorNumber = 200;
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    array = new Uint8ClampedArray(arrayLength);
    for (let i = 0; i < arrayLength; i++) {
      array[i] = colorNumber;
    }
    const borderExtremum = {xMin: 0, yMin: 0, xMax: 10, yMax: 10};
    instance = new PaintBucketHoleFinder(ctx, borderExtremum , array);
  });

  it('should create an instance', () => {
    expect(instance).toBeTruthy();
  });

  it('#findHole return Coordinates -1 -1 if x reach xMax', () => {
    spyOn(instance, 'pixelColorOfFill').and.returnValue(true);
    const result = instance.findHole(new Coordinates(0, 0));
    expect(result.yPosition).toEqual(-1);
    expect(result.xPosition).toEqual(-1);
  });

  it('#findHole return Coordinates 0 1 if x find hole', () => {
    spyOn(instance, 'pixelColorOfFill').and.returnValue(false);
    const result = instance.findHole(new Coordinates(0, 1));
    expect(result.yPosition).toEqual(0);
    expect(result.xPosition).toEqual(0);
  });

  it('#pixelColorOfFill return false if not the same color', () => {
    const canvasMock = document.createElement('canvas');
    const canvasSize = 100;
    const rectPosition = 25;
    const clampedArraySize = 3;
    const r = 200;
    const g = 0;
    const b = 255;
    canvasMock.height = canvasSize;
    canvasMock.width = canvasSize;
    const ctxMock = canvasMock.getContext('2d') as CanvasRenderingContext2D;
    ctxMock.fillStyle = 'rgba(200, 0, 250,255)';
    ctxMock.fillRect( rectPosition , rectPosition, canvasSize / 2, canvasSize / 2);
    instance.canvasContextToScan = ctxMock;
    instance.pixelColorOfFill(rectPosition, rectPosition);
    instance.colorApplied = new Uint8ClampedArray(clampedArraySize);
    instance.colorApplied[0] = r;
    instance.colorApplied[1] = g;
    instance.colorApplied[2] = b;
    const result = instance.pixelColorOfFill(rectPosition, rectPosition);
    expect(result).toBe(false);
  });
});
