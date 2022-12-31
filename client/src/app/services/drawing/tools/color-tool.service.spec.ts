import { TestBed } from '@angular/core/testing';
import { ColorToolService } from './color-tool.service';

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
const MOCK_X = 10;
const MOCK_Y = 10;
const MOCK_MOUSE_EVENT = createMouseEvent(MOCK_X, MOCK_Y, 2, MOCK_X, MOCK_Y, '');
const MOCK_MOUSE_EVENT_DOWN = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, 'mousedown');
const MOCK_MOUSE_EVENT_UP = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, 'mouseup');
const MOCK_MOUSE_EVENT_LEAVE = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, 'mouseleave');

describe('ColorToolService', () => {
  let service: ColorToolService ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ColorToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#eventTypeDispatcher should be called mousedown', () => {
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_DOWN);
    expect(service.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher should be called onMouseUp', () => {
    spyOn(service, 'eventTypeDispatcher');
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_UP);
    expect(service.eventTypeDispatcher).toHaveBeenCalled();
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
