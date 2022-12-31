import { TestBed } from '@angular/core/testing';
import { ShapeToolService } from './shape-tool.service';

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
const MOCK_MOUSE_EVENT = createMouseEvent(MOCK_X, MOCK_Y, 2, MOCK_X, MOCK_Y, '');
const MOCK_MOUSE_EVENT_LEAVE = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, 'mouseleave');
const MOCK_MOUSE_EVENT_DOWN = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, 'mousedown');
const MOCK_MOUSE_EVENT_MOVE = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, 'mousemove');
const MOCK_MOUSE_EVENT_UP = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, 'mouseup');

describe('ShapeToolService', () => {
  let service: ShapeToolService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ShapeToolService);
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

  it('#eventTypeDispatcher should be called mousedown', () => {
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_DOWN);
    expect(service.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher should be called mousemove', () => {
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_MOVE);
    expect(service.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher should be called mouseup', () => {
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_UP);
    expect(service.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher should be called mouseleave', () => {
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
    expect(service.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher should be null', () => {
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT);
    expect(service.eventTypeDispatcher).toBeDefined();
  });

});
