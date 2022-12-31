import { TestBed } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { EraserCursor } from './eraser-cursor';

const createMouseEvent = (
  x: number,
  y: number,
  buttonPressed: number,
  offSetx?: number,
  offSety?: number,
  typeMouse?: string,
): MouseEvent => {
  const mouseEvent = {
    clientX: x,
    clientY: y,
    button: buttonPressed,
    offsetX: offSetx,
    offsetY: offSety,
    type: typeMouse,
  };
  return (mouseEvent as unknown) as MouseEvent;
};

describe('EraserCursor', () => {
  let colorsService: ColorsService;
  let toolProperties: ToolPropertiesService;
  let eraserCursor: EraserCursor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    colorsService = TestBed.get(ColorsService);
    toolProperties = TestBed.get(ToolPropertiesService);
    eraserCursor = new EraserCursor(colorsService, toolProperties);
  });

  it('should create an instance', () => {
    expect(eraserCursor).toBeTruthy();
  });

  it('#setCursorStartingPoint should set the startingPoint', () => {
    const xCoord = 200;
    const yCoord = 100;
    const mouseEvent = createMouseEvent(xCoord, yCoord, 2, xCoord, yCoord, '');
    const width = 100;
    eraserCursor.width = width;
    const height = 50;
    eraserCursor.height = height;
    eraserCursor.setCursorStartingPoint(mouseEvent);
    expect(eraserCursor.startingPoint).toEqual(new Coordinates(xCoord - width / 2, yCoord - height / 2));
  });

  it('#updateSize should set the height and width', () => {
    const eraserSize = 100;
    toolProperties.eraserSize = eraserSize;
    eraserCursor.updateSize();
    expect(eraserCursor.height).toEqual(eraserSize);
    expect(eraserCursor.width).toEqual(eraserSize);
  });
});
