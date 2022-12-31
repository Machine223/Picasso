import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { PaintBucketBorderTracer } from './paint-bucket-border-tracer';

const CANVAS_HEIGHT = 100;
const CANVAS_WIDTH = 100;
const INITIAL_POSITION  = 25;
const RECTANGLE_LENGTH = 50;

describe('PaintBucketBorderTracer', () => {
  let instance: PaintBucketBorderTracer;
  const arrayLength = 4;
  let canvasMock: HTMLCanvasElement;
  let ctxMock: CanvasRenderingContext2D;
  let coordinatesMock: Coordinates;
  beforeEach(() => {
    canvasMock = document.createElement('canvas');
    canvasMock.height = CANVAS_HEIGHT;
    canvasMock.width = CANVAS_WIDTH;
    ctxMock = canvasMock.getContext('2d') as CanvasRenderingContext2D;
    ctxMock.fillStyle = 'rgba(200, 0, 250,255)';
    ctxMock.fillRect( INITIAL_POSITION, INITIAL_POSITION, RECTANGLE_LENGTH , RECTANGLE_LENGTH);

    const array = new Uint8ClampedArray(arrayLength);
    // tslint:disable-next-line: no-magic-numbers
    array[0] = 200;
    array[1] = 0;
    // tslint:disable-next-line: no-magic-numbers
    array[2] = 250;
    // tslint:disable-next-line: no-magic-numbers
    array[3] = 255;
    instance = new PaintBucketBorderTracer(ctxMock, array);
    // tslint:disable-next-line: no-magic-numbers
    coordinatesMock = new Coordinates(INITIAL_POSITION, 40);
  });

  it('should create an instance', () => {
    expect(instance).toBeTruthy();
  });

  it('#traceBorder should call checkIfHoleOnePixel', () => {
    const spy = spyOn(instance, 'checkIfHoleOnePixel').and.callThrough();
    instance.traceBorder(coordinatesMock);
    expect(spy).toHaveBeenCalled();
  });

  it('#traceBorder should call pathForOnePixelHole if checkIfHoleOnePixel is true', () => {
    const spy = spyOn(instance, 'pathForOnePixelHole').and.callThrough();
    spyOn(instance, 'checkIfHoleOnePixel').and.returnValue(true);
    instance.traceBorder(coordinatesMock);
    expect(spy).toHaveBeenCalled();
  });

  it('#traceBorder should call getPixelCoordinates', () => {
    spyOn(instance, 'checkIfHoleOnePixel').and.returnValue(false);
    const spy = spyOn(instance, 'getPixelCoordinates').and.callThrough();
    instance.traceBorder(coordinatesMock);
    expect(spy).toHaveBeenCalled();
  });

  it('#traceBorder should return path', () => {
    spyOn(instance, 'checkIfHoleOnePixel').and.returnValue(false);
    const result = instance.traceBorder(coordinatesMock);
    expect(result).toEqual('M 25 40L 25 75 L 75 75 L 75 25 L 25 25 Z ');
  });

  it('#findExtremum should set all the extremums', () => {
    instance.borderExtremum  = { xMin: Number.MAX_VALUE, xMax: 0, yMin: Number.MAX_VALUE, yMax: 0 };
    // tslint:disable-next-line: no-magic-numbers
    instance.findExtremum(new Coordinates(10, 20));
    // tslint:disable-next-line: no-magic-numbers
    expect(instance.borderExtremum.xMax).toEqual(10);
    // tslint:disable-next-line: no-magic-numbers
    expect(instance.borderExtremum.xMin).toEqual(10);
    // tslint:disable-next-line: no-magic-numbers
    expect(instance.borderExtremum.yMax).toEqual(20);
    // tslint:disable-next-line: no-magic-numbers
    expect(instance.borderExtremum.yMin).toEqual(20);
  });

  it('#findExtremum should not set any extremums', () => {
    instance.borderExtremum  = { xMin: 0, xMax: 100, yMin: 0, yMax: 100 };
    // tslint:disable-next-line: no-magic-numbers
    instance.findExtremum(new Coordinates(10, 20));
    // tslint:disable-next-line: no-magic-numbers
    expect(instance.borderExtremum.xMax).toEqual(100);
    expect(instance.borderExtremum.xMin).toEqual(0);
    // tslint:disable-next-line: no-magic-numbers
    expect(instance.borderExtremum.yMax).toEqual(100);
    expect(instance.borderExtremum.yMin).toEqual(0);
  });

  it('#checkIfHoneOnePixel should return true if hole is one pixel', () => {
    canvasMock = document.createElement('canvas');
    canvasMock.height = CANVAS_HEIGHT;
    canvasMock.width = CANVAS_WIDTH;
    ctxMock = canvasMock.getContext('2d') as CanvasRenderingContext2D;
    ctxMock.fillStyle = 'rgba(200, 0, 250,255)';
    ctxMock.fillRect( INITIAL_POSITION, INITIAL_POSITION, 1 , 1);
    instance.context = ctxMock;
    const result = instance.checkIfHoleOnePixel(new Coordinates(INITIAL_POSITION, INITIAL_POSITION));
    expect(result).toEqual(true);
  });

  it('#checkIfHoneOnePixel should return false if hole is not one pixel', () => {
    const result = instance.checkIfHoleOnePixel(new Coordinates(INITIAL_POSITION, INITIAL_POSITION));
    expect(result).toEqual(false);
  });

  it('#pathForOnePixelHole should return the path around the coordinates', () => {
    const result = instance.pathForOnePixelHole(new Coordinates(INITIAL_POSITION, INITIAL_POSITION));
    expect(result).toEqual('M 25 25.8a1 1 0 0 1 2 0  a1 1 0 0 1 -2 0 Z ');
  });

});
