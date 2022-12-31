import { TestBed } from '@angular/core/testing';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { RectangleToolService } from './rectangle-tool.service';

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

describe('RectangleToolService', () => {

  let service: RectangleToolService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(RectangleToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#eventTypeDispatcher should be called', () => {
    const spyOnEventDispatcher = spyOn(service, 'finalizeShape');
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
    expect(spyOnEventDispatcher).toHaveBeenCalled();
  });

  it('#eventTypeDispatcher should be called if cover', () => {
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
    expect(service.eventTypeDispatcher).toBeDefined();
  });

  it('#onMouseDown isRectangleStarted should be true', () => {
    service.onMouseDown(MOCK_MOUSE_EVENT);
    expect(service.isRectangleStarted).toBe(true);
  });

  it('#onMouseMove should do nothing if rectangle is not started', () => {
    service.isRectangleStarted = false;
    const createRectangleSpy = spyOn(service.svgElementCreator, 'createRectangle');
    service.onMouseMove(MOCK_MOUSE_EVENT);
    expect(createRectangleSpy).not.toHaveBeenCalled();
  });

  it('#onMouseMove should create a temporary rectangle', () => {
    service.onMouseDown(MOCK_MOUSE_EVENT);
    const createRectangleSpy = spyOn(service.svgElementCreator, 'createRectangle');
    service.onMouseMove(MOCK_MOUSE_EVENT);
    expect(createRectangleSpy).toHaveBeenCalled();
  });

  it('#setSize sets the size of the rectangle using the offset', () => {
    service.setSize(new Coordinates(MOCK_X, MOCK_Y));
    expect(service.rectangle.width).toEqual(MOCK_X);
    expect(service.rectangle.height).toEqual(MOCK_Y);

    service.isSquare = true;
    service.setSize(new Coordinates(MOCK_X, MOCK_Y));
    expect(service.rectangle.height).toEqual(service.rectangle.width);
  });

  it('#startRectangle should return the coord of the top left corner of the rectangle', () => {
    service.mouseStart = new Coordinates(MOCK_X, MOCK_X);
    service.mouseOffset = new Coordinates(-MOCK_X, -MOCK_Y);
    service.isSquare = true;
    const topLeft = service.startRectangle(MOCK_X > MOCK_Y);
    expect(topLeft).toEqual(new Coordinates(service.mouseStart.xPosition + service.mouseOffset.xPosition,
      service.mouseStart.yPosition + service.mouseOffset.xPosition));

    service.startRectangle(false);
    expect(topLeft).toEqual(new Coordinates(service.mouseOffset.yPosition + service.mouseStart.xPosition,
      service.mouseOffset.yPosition + service.mouseStart.yPosition));
  });

  it('#finalizeShape isRectangleStarted should be false and it should create a rectangle', () => {
    service.isRectangleStarted = true;
    service.rectangle.height = 2;
    const createRectangleSpy = spyOn(service.svgElementCreator, 'createRectangle');
    service.finalizeShape();
    expect(createRectangleSpy).toHaveBeenCalled();
    expect(service.isRectangleStarted).toBe(false);
  });

  it('#activateSquare update mouseMoveEvent if lastMouseMove', () => {
    spyOn(service, 'onMouseMove').and.callFake((receivedLastMouseMove: MouseEvent) => {
      expect(receivedLastMouseMove).toEqual(receivedLastMouseMove);
    });
    const MOCK_BOOLEAN = true ;
    service.lastMouseMove = MOCK_MOUSE_EVENT;
    service.activateSquare(MOCK_BOOLEAN);
    expect(service.onMouseMove).toHaveBeenCalled();
  });

  it('#activateSquare update mouseMoveEvent if notLastMouseMove', () => {
    spyOn(service, 'onMouseMove').and.callFake((receivedLastMouseMove: MouseEvent) => {
      expect(receivedLastMouseMove).toEqual(receivedLastMouseMove);
    });
    const MOCK_BOOLEAN = true ;
    service.activateSquare(MOCK_BOOLEAN);
    expect(service.onMouseMove).not.toHaveBeenCalled();
  });
});
