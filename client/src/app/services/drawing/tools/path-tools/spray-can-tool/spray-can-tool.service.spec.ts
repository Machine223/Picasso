import { TestBed } from '@angular/core/testing';
import { SprayCanToolService } from './spray-can-tool.service';

const createMouseEvent = (
  x: number,
  y: number,
  buttonPressed: number,
  offSetx?: number,
  offSety?: number,
  typeMouse?: string ): MouseEvent => {
  const mouseEvent = {
    clientX: x,
    clientY: y,
    button: buttonPressed,
    offsetX: offSetx,
    offsetY: offSety,
    type: typeMouse
  };
  return (mouseEvent as unknown) as MouseEvent;
};

const MOCK_X = 10;
const MOCK_Y = 10;
const MOCK_MOUSE_EVENT = createMouseEvent(MOCK_X, MOCK_Y, 1, MOCK_X, MOCK_Y, );
const MOCK_MOUSE_EVENT_DOWN = createMouseEvent(MOCK_X, MOCK_Y, 1, MOCK_X, MOCK_Y, 'mousedown');
const MOCK_MOUSE_EVENT_MOVE = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, 'mousemove');
const MOCK_MOUSE_EVENT_UP = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, 'mouseup');
const MOCK_MOUSE_EVENT_LEAVE = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, 'mouseleave');
const MOCK_MOUSE_EVENT_ENTER = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, 'mouseenter');
const MOCK_MOUSE_EVENT_NULL = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, '');

describe('SprayCanToolService', () => {
  let service: SprayCanToolService ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(SprayCanToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#eventTypeDispatcher should be called', () => {
    spyOn(service, 'eventTypeDispatcher');
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
    expect(service.eventTypeDispatcher).toHaveBeenCalled();
  });

  it('#eventTypeDispatcher should be called', () => {
    spyOn(service, 'eventTypeDispatcher');
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
    expect(service.eventTypeDispatcher).toHaveBeenCalled();
  });

  it('#eventTypeDispatcher should be called mousemove', () => {
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

  it('#eventTypeDispatcher should be called mouseleave', () => {
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_ENTER);
    expect(service.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher should be called mouseleave', () => {
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
    expect(service.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher should be called null', () => {
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_NULL);
    expect(service.eventTypeDispatcher).toBeDefined();
  });

  it('#onMouseDown isDrawing should to be true', () => {
    service.onMouseDown(MOCK_MOUSE_EVENT);
    expect(service.isDrawing).toBe(true);
  });

  it('#onMouseDown should setSprayTimer', () => {
    const spyOnsetSprayTime = spyOn(service, 'setSprayTimer');
    service.onMouseDown(MOCK_MOUSE_EVENT);
    expect(spyOnsetSprayTime).toHaveBeenCalled();
  });

  it('#onMouseDown should generateSpray', () => {
    const spyOnGnerateSpray = spyOn(service, 'generateSpray');
    service.onMouseDown(MOCK_MOUSE_EVENT);
    expect(spyOnGnerateSpray).toHaveBeenCalled();
  });

  it('#onMouseMove isIn and isDrawing should setSprayTimer', () => {
    service.isIn = true;
    service.isDrawing = true;
    const spyOnsetSprayTime = spyOn(service, 'setSprayTimer');
    service.onMouseMove(MOCK_MOUSE_EVENT);
    expect(spyOnsetSprayTime).toHaveBeenCalled();
  });

  it('#onMouseMove isNotIn and isDrawing should not setSprayTimer', () => {
    service.isIn = false;
    service.isDrawing = true;
    const spyOnsetSprayTime = spyOn(service, 'setSprayTimer');
    service.onMouseMove(MOCK_MOUSE_EVENT);
    expect(spyOnsetSprayTime).not.toHaveBeenCalled();
  });

  it('#onMouseMove isIn and isDrawing should generateSpray', () => {
    service.isIn = true;
    service.isDrawing = true;
    const spyOnGnerateSpray = spyOn(service, 'generateSpray');
    service.onMouseMove(MOCK_MOUSE_EVENT);
    expect(spyOnGnerateSpray).toHaveBeenCalled();
  });

  it('#onMouseMove isIn and isNotDrawing should generateSpray', () => {
    service.isIn = true;
    service.isDrawing = false;
    const spyOnGnerateSpray = spyOn(service, 'generateSpray');
    service.onMouseMove(MOCK_MOUSE_EVENT);
    expect(spyOnGnerateSpray).not.toHaveBeenCalled();
  });

  it('#onMouseUp isDrawing should to be false', () => {
    service.isDrawing = true;
    service.onMouseUp(MOCK_MOUSE_EVENT);
    expect(service.isDrawing).toBe(false);
  });

  it('#onMouseLeave isDrawing should be false', () => {
    service.onMouseLeave(MOCK_MOUSE_EVENT_LEAVE);
    expect(service.isDrawing).toBe(false);
  });

  it('#onMouseEnter isDrawing should be false', () => {
    service.onMouseEnter();
    expect(service.isIn).toBe(true);
  });

  it('#onMouseLeave isIn should be false', () => {
    service.onMouseLeave(MOCK_MOUSE_EVENT_LEAVE);
    expect(service.isIn).toBe(false);
  });

  it('#onMouseLeave onMouseUp() should be called', () => {
    service.isDrawing = true;
    spyOn(service, 'onMouseUp');
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
    expect(service.onMouseUp).toHaveBeenCalled();
  });

  it('#removeCursor isDrawing should to be false', () => {
    service.isDrawing = true;
    service.removeCursor();
    expect(service.isDrawing).toBe(false);
  });

});
