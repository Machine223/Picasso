import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { ColorSelectorService } from '@app-services/drawing/tools/colorSelector-tool/color-selector.service';
import { MOCK_MOUSE_EVENT } from '../../../../../mock/mock-mouse-event';
import { Coordinates } from '../coordinates';
import { PaintBucketService } from './paint-bucket-tool.service';

const CANVAS_HEIGHT = 100;
const CANVAS_WIDTH = 100;
const INITIAL_POSITION  = 25;
const RECTANGLE_LENGTH = 50;
const MOUSE_EVENT_POSITION = 50;

describe('PaintBucketService', () => {
  let service: PaintBucketService;
  let canvasMock: HTMLCanvasElement;
  let ctxMock: CanvasRenderingContext2D;
  let colorSelectorService: ColorSelectorService;
  let event: MouseEvent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule, BrowserAnimationsModule],
      providers: [
        ColorSelectorService,
        ColorsService
      ]
    });
    service = TestBed.get(PaintBucketService);
    colorSelectorService = TestBed.get(ColorSelectorService);
    canvasMock = document.createElement('canvas');
    canvasMock.height = CANVAS_HEIGHT;
    canvasMock.width = CANVAS_WIDTH;
    ctxMock = canvasMock.getContext('2d') as CanvasRenderingContext2D;
    ctxMock.fillStyle = 'rgba(200, 0, 250,255)';
    ctxMock.fillRect( INITIAL_POSITION, INITIAL_POSITION, RECTANGLE_LENGTH , RECTANGLE_LENGTH);
    ctxMock.fillStyle = 'rgba(100, 0, 100,255)';
    // tslint:disable-next-line: no-magic-numbers
    ctxMock.fillRect( 40, 40, 5 , 5);
    colorSelectorService.context2D = ctxMock;
    event = new MouseEvent('mousedown');
    spyOnProperty(event, 'offsetX').and.returnValue(MOUSE_EVENT_POSITION);
    spyOnProperty(event, 'offsetY').and.returnValue(MOUSE_EVENT_POSITION);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#eventTypeDispatcher should call onMouseDown', () => {
    const spy = spyOn(service, 'onMouseDown');
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT);
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseDown should open snackBar', () => {
    const spy = spyOn(service.snackBar, 'open').and.callThrough();
    service.onMouseDown(MOCK_MOUSE_EVENT);
    expect(spy).toHaveBeenCalled();
  });

  it('#doPaintShape should call paintShape', () => {
    const spy = spyOn(service, 'paintShape');
    service.doPaintShape(MOCK_MOUSE_EVENT);
    expect(spy).toHaveBeenCalled();
  });

  it('#paintShape should set initial coordinates', () => {
    service.paintShape(event, () => true);
    expect(service.initialCoordinates.xPosition).toEqual(event.offsetX);
    expect(service.initialCoordinates.yPosition).toEqual(event.offsetY);
  });

  it('#paintShape should call getColorPosition from colorSelector', () => {
    const spy = spyOn(colorSelectorService, 'getColorPosition').and.callThrough();
    service.paintShape(event, () => true);
    expect(spy).toHaveBeenCalled();
  });

  it('#paintShape should call cloneCanvas', () => {
    const spy = spyOn(service, 'cloneCanvas').and.callThrough();
    service.paintShape(event, () => true);
    expect(spy).toHaveBeenCalled();
  });

  it('#paintShape should call colorToUint8ClampedArray 3 times', () => {
    const spy = spyOn(service, 'colorToUint8ClampedArray').and.callThrough();
    service.paintShape(event, () => true);
    // tslint:disable-next-line: no-magic-numbers
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('#paintShape should call findOuterBorder', () => {
    const spy = spyOn(service, 'findOuterBorder').and.callThrough();
    service.paintShape(event, () => true);
    expect(spy).toHaveBeenCalled();
  });

  it('#paintShape should call traceshape', () => {
    const spy = spyOn(service, 'traceShape').and.callThrough();
    service.paintShape(event, () => true);
    expect(spy).toHaveBeenCalled();
  });

  it('#cloneCanvas should return a newCanvas with the same size as the one passed', () => {
    const result = service.cloneCanvas(ctxMock);
    expect(result.height).toEqual(CANVAS_HEIGHT);
    expect(result.width).toEqual(CANVAS_WIDTH);
  });

  it('#findOuterBorder should return the coordinates of the hole', () => {
    service.initialCoordinates = new Coordinates(MOUSE_EVENT_POSITION, MOUSE_EVENT_POSITION);
    const colorToApply = service.colorToUint8ClampedArray('#c800fa');
    const result = service.findOuterBorder(ctxMock, colorToApply);
    // tslint:disable-next-line: no-magic-numbers
    expect(result.xPosition).toEqual(25);
    expect(result.yPosition).toEqual(MOUSE_EVENT_POSITION);
  });

  it('#traceShape should call createPath', () => {
    const spy = spyOn(service.svgPaintBucketCreator, 'createPath').and.callThrough();
    service.traceShape('M 0 0 L 0 0 Z', '#c800fa');
    expect(spy).toHaveBeenCalled();
  });

  it('#colorToUint8ClampedArray should return an array with the right color', () => {
    const result = service.colorToUint8ClampedArray('#000000');
    expect(result[0]).toEqual(0);
    expect(result[1]).toEqual(0);
    expect(result[2]).toEqual(0);
  });
});
