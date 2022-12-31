import { TestBed } from '@angular/core/testing';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { PolygonToolService } from './polygon-tool.service';

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

const MOCK_X = 20;
const MOCK_Y = 10;
const MOCK_MOUSE_EVENT = createMouseEvent(MOCK_X, MOCK_Y, 1, MOCK_X, MOCK_Y, );
const MOCK_MOUSE_EVENT_LEAVE = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, 'mouseleave');

describe('PolygonToolService', () => {

  let polygonTool: PolygonToolService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    polygonTool = TestBed.get(PolygonToolService);
  });

  it('should be created', () => {
    expect(polygonTool).toBeTruthy();
  });

  it('#eventTypeDispatcher should be called', () => {
    const spyOnEventDispatcher = spyOn(polygonTool, 'finalizeShape');
    polygonTool.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
    expect(spyOnEventDispatcher).toHaveBeenCalled();
  });

  it('#eventTypeDispatcher should be called if cover', () => {
    polygonTool.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
    expect(polygonTool.eventTypeDispatcher).toBeDefined();
  });

  it('#onMouseDown isPolygonStarted should be true', () => {
    polygonTool.onMouseDown(MOCK_MOUSE_EVENT);
    expect(polygonTool.isPolygonStarted).toBe(true);
  });

  it('#onMouseMove should do nothing if polygon is not started', () => {
    polygonTool.isPolygonStarted = false;
    const createPolygonSpy = spyOn(polygonTool.svgElementCreator, 'createPolygon');
    polygonTool.onMouseMove(MOCK_MOUSE_EVENT);
    expect(createPolygonSpy).not.toHaveBeenCalled();
  });

  it('#onMouseMove should create a temporary polygon', () => {
    polygonTool.onMouseDown(MOCK_MOUSE_EVENT);
    const createPolygonSpy = spyOn(polygonTool.svgElementCreator, 'createPolygon');
    polygonTool.onMouseMove(MOCK_MOUSE_EVENT);
    expect(createPolygonSpy).toHaveBeenCalled();
  });

  it('#fitRectangleSize sets the size of the outline rectangle using the offset', () => {
    const sides4 = 4;
    polygonTool.polygon.sides = sides4;
    polygonTool.polygon.width = MOCK_X;
    polygonTool.polygon.height = MOCK_Y;
    polygonTool.fitRectangleSize();
    expect(polygonTool.rectangleTool.rectangle.height).toEqual(polygonTool.polygon.width);

    polygonTool.polygon.height = MOCK_Y + MOCK_X;
    polygonTool.fitRectangleSize();
    expect(polygonTool.rectangleTool.rectangle.width).toEqual(polygonTool.polygon.height);

    const sides7 = 7;
    polygonTool.polygon.sides = sides7;
    polygonTool.polygon.radius = 2;
    polygonTool.fitRectangleSize();
    expect(polygonTool.rectangleTool.rectangle.width).toEqual(polygonTool.polygon.height / polygonTool.polygon.getSidesRatio());
  });

  it('#fitRectangle should return the coord of the top left corner of the outline rectangle', () => {
    const sides = 4;
    polygonTool.polygon.sides = sides;
    polygonTool.rectangleTool.mouseStart = new Coordinates(MOCK_X, MOCK_X);
    polygonTool.rectangleTool.mouseOffset = new Coordinates(-MOCK_X, -MOCK_Y);
    polygonTool.rectangleTool.rectangle.width = MOCK_X;
    polygonTool.rectangleTool.rectangle.height = MOCK_Y;
    polygonTool.polygon.width = MOCK_X;
    polygonTool.polygon.height = MOCK_Y;
    const topLeft = polygonTool.fitRectangle();
    expect(topLeft).toEqual(new Coordinates(
      polygonTool.rectangleTool.mouseStart.xPosition - polygonTool.rectangleTool.rectangle.width,
      polygonTool.rectangleTool.mouseStart.yPosition - polygonTool.rectangleTool.rectangle.height));

    polygonTool.polygon.height = MOCK_Y + MOCK_X;
    polygonTool.fitRectangle();
    expect(topLeft).toEqual(new Coordinates(
      polygonTool.rectangleTool.mouseStart.xPosition - polygonTool.rectangleTool.rectangle.width,
      polygonTool.rectangleTool.mouseStart.yPosition - polygonTool.rectangleTool.rectangle.height));
  });

  it('#finalizeShape isPolygonStarted should be false and it should create a polygon', () => {
    polygonTool.isPolygonStarted = true;
    polygonTool.isCreatingPolygon = true;
    const createPolygonSpy = spyOn(polygonTool.svgElementCreator, 'createPolygon');
    polygonTool.finalizeShape();
    expect(createPolygonSpy).toHaveBeenCalled();
    expect(polygonTool.isPolygonStarted).toBe(false);
  });
});
