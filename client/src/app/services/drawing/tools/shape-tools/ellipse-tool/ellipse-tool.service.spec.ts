import { TestBed } from '@angular/core/testing';
import { EllipseToolService } from './ellipse-tool.service';

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

describe('EllipseToolService', () => {

  let ellipseTool: EllipseToolService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    ellipseTool = TestBed.get(EllipseToolService);
  });

  it('should be created', () => {
    expect(ellipseTool).toBeTruthy();
  });

  it('#eventTypeDispatcher should be called', () => {
    const spyOnEventDispatcher = spyOn(ellipseTool, 'finalizeShape');
    ellipseTool.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
    expect(spyOnEventDispatcher).toHaveBeenCalled();
  });

  it('#eventTypeDispatcher should be called if cover', () => {
    ellipseTool.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
    expect(ellipseTool.eventTypeDispatcher).toBeDefined();
  });

  it('#onMouseDown isEllipseStarted should be true', () => {
    ellipseTool.onMouseDown(MOCK_MOUSE_EVENT);
    expect(ellipseTool.isEllipseStarted).toBe(true);
  });

  it('#onMouseMove should do nothing if ellipse is not started', () => {
    ellipseTool.isEllipseStarted = false;
    const createEllipseSpy = spyOn(ellipseTool.svgElementCreator, 'createEllipse');
    ellipseTool.onMouseMove(MOCK_MOUSE_EVENT);
    expect(createEllipseSpy).not.toHaveBeenCalled();
  });

  it('#onMouseMove should create a temporary ellipse', () => {
    ellipseTool.onMouseDown(MOCK_MOUSE_EVENT);
    const createEllipseSpy = spyOn(ellipseTool.svgElementCreator, 'createEllipse');
    ellipseTool.onMouseMove(MOCK_MOUSE_EVENT);
    expect(ellipseTool.isCreatingEllipse).toBe(true);
    expect(createEllipseSpy).toHaveBeenCalled();
  });

  it('#finalizeShape isEllipseStarted should be false and it should create an ellipse', () => {
    ellipseTool.isEllipseStarted = true;
    ellipseTool.isCreatingEllipse = true;
    const createEllipseSpy = spyOn(ellipseTool.svgElementCreator, 'createEllipse');
    ellipseTool.finalizeShape();
    expect(createEllipseSpy).toHaveBeenCalled();
    expect(ellipseTool.isEllipseStarted).toBe(false);
  });

  it('#activateSquare update mouseMoveEvent if lastMouseMove', () => {
    spyOn(ellipseTool, 'onMouseMove').and.callFake((receivedLastMouseMove: MouseEvent) => {
      expect(receivedLastMouseMove).toEqual(receivedLastMouseMove);
    });
    const MOCK_BOOLEAN = true ;
    ellipseTool.rectangleTool.lastMouseMove = MOCK_MOUSE_EVENT;
    ellipseTool.activateSquare(MOCK_BOOLEAN);
    expect(ellipseTool.onMouseMove).toHaveBeenCalled();
  });

  it('#activateSquare update mouseMoveEvent if notLastMouseMove', () => {
    spyOn(ellipseTool, 'onMouseMove').and.callFake((receivedLastMouseMove: MouseEvent) => {
      expect(receivedLastMouseMove).toEqual(receivedLastMouseMove);
    });
    const MOCK_BOOLEAN = true ;
    ellipseTool.activateSquare(MOCK_BOOLEAN);
    expect(ellipseTool.onMouseMove).not.toHaveBeenCalled();
  });
});
