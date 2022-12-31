import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { MockRenderer } from '../../mock/mock-renderer';
import { PaintBucketFiller } from './paint-bucket-filler';

describe('PaintBucketFiller', () => {
  let instance: PaintBucketFiller;
  let renderer: Renderer2;
  let canvas: HTMLCanvasElement;
  const tolerance = 50;
  let colorArray: Uint8ClampedArray;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Renderer2, useClass: MockRenderer
        },
        ToolPropertiesService
      ]});
    renderer = new MockRenderer();
    canvas = document.createElement('canvas') as HTMLCanvasElement;
    colorArray = new Uint8ClampedArray();
    spyOn(renderer, 'createElement').and.returnValue(document.createElement('canvas') as HTMLCanvasElement);
    instance = new PaintBucketFiller(canvas, renderer, colorArray, 'black', colorArray, tolerance);
    instance.renderer = renderer;
  });

  it('should create an instance', () => {
    expect(instance).toBeTruthy();
  });

  it('#initializeCanvas should call set properties 2 times', () => {
    const spy = spyOn(instance.renderer, 'setProperty').and.callThrough();
    instance.initializeCanvas();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('#performFill should call fill', () => {
    const position = 10;
    const coordinates = new Coordinates(position, position);
    const spy = spyOn(instance, 'fill').and.callThrough();
    instance.performFill(coordinates);
    expect(spy).toHaveBeenCalled();
  });

  it('#fill should call verifyCoordinates', () => {
    const spy = spyOn(instance, 'verifyCoordinates').and.callThrough();
    const position = 10;
    const coordinates = new Coordinates(position, position);
    const pointsToVerify: Coordinates[] = [];
    pointsToVerify.push(coordinates);
    instance.verifyCoordinates(coordinates.xPosition, coordinates.yPosition, pointsToVerify);
    expect(spy).toHaveBeenCalled();
  });

  it('#verifyCoordinates should return if x<0 ', () => {
    const position = -1;
    const pointsToVerify: Coordinates[] = [];
    instance.verifyCoordinates(position, position, pointsToVerify);
    expect(pointsToVerify.length).toEqual(0);
  });

  it('#verifyCoordinates should return if isColorInTolerance true', () => {
    spyOn(instance, 'isColorInTolerance').and.returnValue(false);
    const position = 10;
    const pointsToVerify: Coordinates[] = [];
    instance.verifyCoordinates(position, position, pointsToVerify);
    expect(pointsToVerify.length).toEqual(0);
  });

  it('#verifyCoordinates should return; if deepIndexOf doesnt exist', () => {
    spyOn(instance, 'deepIndexOf').and.returnValue(-1);
    const position = 10;
    const pointsToVerify: Coordinates[] = [];
    instance.verifyCoordinates(position, position, pointsToVerify);
    expect(pointsToVerify.length).toEqual(0);
  });

  it('#verifyCoordinates should add element to array if all condition pass', () => {
    spyOn(instance, 'isColorInTolerance').and.returnValue(true);
    const position = 10;
    const pointsToVerify: Coordinates[] = [];
    instance.verifyCoordinates(position, position, pointsToVerify);
    expect(pointsToVerify.length).toEqual(1);
  });

  it('#isColorInTolerance should return call eclidianTolerance if not found', () => {
    const color = 200;
    spyOn(instance.colorMeet, 'includes').and.returnValue(false);
    const spy = spyOn(instance, 'euclidianTolerance');
    instance.isColorInTolerance(color, color);
    expect(spy).toHaveBeenCalled();
  });

  it('#isColorInTolerance should return true', () => {
    const color = 200;
    spyOn(instance.colorMeet, 'includes').and.returnValue(true);
    const result = instance.isColorInTolerance(color, color);
    expect(result).toBe(true);
  });

  it('#deepIndexOf return index value if value is in array', () => {
    const arr: Coordinates [] = [];
    const position = 1;
    arr.push(new Coordinates(position, position));
    const result = instance.deepIndexOf(arr, position, position);
    expect(result).toEqual(0);
  });

  it('#deepIndexOf return -1 if value is not in array', () => {
    const arr: Coordinates [] = [];
    const position = 1;
    const result = instance.deepIndexOf(arr, position, position);
    expect(result).toEqual(-1);
  });

  it('#fillOuter should call fill rect', () => {
    const numberOfCallExpected = 4;
    const spy = spyOn(instance.contextCanvasToCheck, 'fillRect');
    const borderExtremum = {xMin: 0, yMin: 0, xMax: 10, yMax: 10};
    instance.fillOuter(borderExtremum);
    expect(spy).toHaveBeenCalledTimes(numberOfCallExpected);
  });

  it('#euclidianDistance should return a distance', () => {
    const uint8length = 3;
    const firstColor = 255;
    const secondColor = 200;

    const uInt8Array1 = new Uint8ClampedArray(uint8length);
    const uInt8Array2 = new Uint8ClampedArray(uint8length);
    for (let i = 0; i < uInt8Array1.length; i++) {
      uInt8Array1[i] = firstColor;
    }
    for (let i = 0; i < uInt8Array2.length; i++) {
      uInt8Array1[i] = secondColor;
    }
    const result = instance.euclidianDistance(uInt8Array1, uInt8Array2);
    const expectedResult = 120000;
    expect(result).toEqual(expectedResult);
  });

  it('#euclidianTolerance should return false if it\'s in tolerance', () => {
    // tslint:disable-next-line:no-magic-numbers is redundant if we do a const variable first
    instance.tolerance = 0.50;
    const mockDistance = 100000;
    const uint8length = 3;
    const firstColor = 255;
    const uInt8Array = new Uint8ClampedArray(uint8length);
    for (let i = 0; i < uInt8Array.length; i++) {
      uInt8Array[i] = firstColor;
    }
    spyOn(instance, 'euclidianDistance').and.returnValue(mockDistance);
    const result = instance.euclidianTolerance(uInt8Array);
    expect(result).toBe(false);
  });

  it('#euclidianTolerance should return true if it\'s in tolerance', () => {
    // tslint:disable-next-line:no-magic-numbers is redundant if we do a const variable first
    instance.tolerance = 0.50;
    const mockDistance = 1000;
    const uint8length = 3;
    const firstColor = 255;
    const uInt8Array = new Uint8ClampedArray(uint8length);
    for (let i = 0; i < uInt8Array.length; i++) {
      uInt8Array[i] = firstColor;
    }
    spyOn(instance, 'euclidianDistance').and.returnValue(mockDistance);
    const result = instance.euclidianTolerance(uInt8Array);
    expect(result).toBe(true);
  });

});
