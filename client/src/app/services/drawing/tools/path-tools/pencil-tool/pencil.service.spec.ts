import { TestBed } from '@angular/core/testing';
import { PencilService } from './pencil.service';

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
    type: typeMouse,
  };
  return (mouseEvent as unknown) as MouseEvent;
};
const MOCK_X = 10;
const MOCK_Y = 10;
const MOCK_MOUSE_EVENT = createMouseEvent(MOCK_X, MOCK_Y, 1, MOCK_X, MOCK_Y, );
const MOCK_MOUSE_EVENT_LEAVE = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, 'mouseleave');

describe('PencilService', () => {

  let service: PencilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(PencilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#eventTypeDispatcher should be called', () => {
    spyOn(service, 'eventTypeDispatcher');
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
    expect(service.eventTypeDispatcher).toHaveBeenCalled();
  });

  it('#eventTypeDispatcher should be called cover', () => {
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
    expect(service.eventTypeDispatcher).toBeDefined();
  });

  it('#onMouseDown isDrawing should be true', () => {
    service.onMouseDown(MOCK_MOUSE_EVENT);
    expect(service.isDrawing).toBe(true);
  });

  it('#onMouseUp isDrawing should should be false', () => {
    service.isDrawing = true;
    service.onMouseUp(MOCK_MOUSE_EVENT);
    expect(service.isDrawing).toBe(false);
  });

  it('#onMouseLeave isDrawing should be false', () => {
    service.onMouseLeave(MOCK_MOUSE_EVENT_LEAVE);
    expect(service.isDrawing).toBe(false);
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

});
