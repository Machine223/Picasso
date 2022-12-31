import { TestBed } from '@angular/core/testing';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { Junctions } from '../../../../../../constants/constants';
import { LineToolService } from './line-tool.service';

enum Radial45Degrees {FirstRay = 0, SecondRay = 45, ThirdRay = 90, FourthRay = 135,
FifthRay = 180, SixthRay = 225, SeventhRay = 270, EightRay = 315}

const MOCK_X = 10;
const MOCK_Y = 20;

const MOCK_X_RADIAL = 500;
const MOCK_Y_RADIAL = -570;
const MOCK_X_8 = -400;
const MOCK_Y_8 = -1000;

const createMouseEvent = (
  x: number,
  y: number,
  buttonPressed: number,
  shiftPressed: boolean,
  offSetx?: number,
  offSety?: number,
): MouseEvent => {
  const mouseEvent = {
    clientX: x,
    clientY: y,
    button: buttonPressed,
    shiftKey: shiftPressed,
    offsetX: offSetx,
    offsetY: offSety,
  };
  return (mouseEvent as unknown) as MouseEvent;
};
const MOCK_MOUSE_EVENT = createMouseEvent(MOCK_X, MOCK_Y, 0, false, MOCK_X, MOCK_Y, );

describe('LineToolService', () => {

  let service: LineToolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(LineToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#eventTypeDispatcher should call an event', () => {
    const spyOnMouseMoveEvent = spyOn(service, 'onMouseMove');
    service.eventTypeDispatcher(new MouseEvent('mousemove'));
    expect(spyOnMouseMoveEvent).toHaveBeenCalled();
  });

  it('#keyboardEventDispatcher should call an event', () => {
    const spyOnDeleteLineCompletely = spyOn(service, 'deleteLineCompletely');
    const eventMock = new KeyboardEvent('keydown', { key : 'Escape' });
    service.keyboardEventDispatcher(eventMock);
    expect(spyOnDeleteLineCompletely).toHaveBeenCalled();
  });

  it('#onMouseUp line should contain the mouse position in initialPoint', () => {
    const toolProperties = TestBed.get(ToolPropertiesService);
    toolProperties.junctionType = Junctions.Dotted;
    service.onMouseUp(MOCK_MOUSE_EVENT);
    expect(service.line.initialPoint).toEqual((new Coordinates(MOCK_X, MOCK_Y)));
  });

  it('#onMouseUp isLineStarted should be true', () => {
    service.onMouseUp(MOCK_MOUSE_EVENT);
    expect(service.isLineStarted).toBe(true);
  });

  it('#onMouseUp should define line ending point on line end', () => {
    service.isLineStarted = true;
    service.line.initialPoint = new Coordinates(0, 0);
    service.line.isWithDots = true;
    service.onMouseUp(MOCK_MOUSE_EVENT);
    expect(service.line.endingPoint).toEqual((new Coordinates(MOCK_X, MOCK_Y)));
  });

  it('#onMouseUp should change coordinates if close enough', () => {
    service.isLineStarted = true;
    service.isAwaitingMove = false;
    service.line.initialPoint = new Coordinates(MOCK_X + 1, MOCK_Y - 2);
    service.onMouseUp(MOCK_MOUSE_EVENT);
    expect(service.line.startingPoint).toEqual((new Coordinates(MOCK_X + 1, MOCK_Y - 2)));
  });

  it('#onMouseMove should modify line ending point', () => {
    service.isLineStarted = true;
    service.onMouseMove(MOCK_MOUSE_EVENT.shiftKey, MOCK_MOUSE_EVENT);
    expect(service.line.endingPoint).toEqual(new Coordinates(MOCK_X, MOCK_Y));
  });

  it('#lineEndEvent should end the line', () => {
    service.isLineStarted = true;
    const finishElementSpy = spyOn(service.lineCreator, 'finishElementWithParts');
    service.lineEndEvent();
    expect(service.isLineStarted).toBe(false);
    expect(finishElementSpy).toHaveBeenCalled();
  });

  it('#deleteLineCompletely should delete the whole line', () => {
    service.onMouseUp(MOCK_MOUSE_EVENT);
    const secondClick = createMouseEvent(MOCK_Y, MOCK_X, 0, false, MOCK_Y, MOCK_X);
    service.isAwaitingMove = false;
    service.onMouseUp(secondClick);
    service.deleteLineCompletely();
    expect(service.isLineStarted).toBe(false);
  });

  it('#deleteLinePartially should delete the temporary part of the line', () => {
    service.onMouseUp(MOCK_MOUSE_EVENT);
    const secondClick = createMouseEvent(MOCK_Y, MOCK_X, 0, false, MOCK_Y, MOCK_X);
    service.isAwaitingMove = false;
    service.onMouseUp(secondClick);
    service.deleteLinePartially();
    expect(service.line.startingPoint).toEqual(new Coordinates(MOCK_X, MOCK_Y));
  });

  it('#onShiftKey should call mouseMoveEvent', () => {
    const spyOnMouseMoveEvent = spyOn(service, 'onMouseMove');
    service.lastMouseEvent = MOCK_MOUSE_EVENT;
    service.onShiftKey(false);
    expect(spyOnMouseMoveEvent).toHaveBeenCalled();
  });

  it('#onShiftKey should modify isShiftMode', () => {
    service.lastMouseEvent = MOCK_MOUSE_EVENT;
    service.isShiftMode = true;
    service.onShiftKey(false);
    expect(service.isShiftMode).toEqual(false);
    service.onShiftKey(true);
    expect(service.isShiftMode).toEqual(true);
  });

  it('#shiftKeyEquation should call useRadialGroup', () => {
    const spyOnUseRadialGroup = spyOn(service, 'useRadialGroup');
    service.line.startingPoint = new Coordinates(0, 0);
    service.shiftKeyEquation(true, MOCK_MOUSE_EVENT);
    expect(spyOnUseRadialGroup).toHaveBeenCalled();
  });

  it('#getRadialValue should return a radial', () => {
    service.line.startingPoint = new Coordinates(0, 0);
    const returnValue = service.getRadialValue(new Coordinates(MOCK_X_RADIAL, MOCK_Y_RADIAL));
    expect(returnValue).toEqual(Radial45Degrees.SixthRay);
  });

  it('#getRadialValue should return 0 if on the last half eighth', () => {
    service.line.startingPoint = new Coordinates(0, 0);
    const returnValue = service.getRadialValue(new Coordinates(MOCK_X_8, MOCK_Y_8));
    expect(returnValue).toEqual(0);
  });

  it('#useRadialGroup should return a Coordinates', () => {
    service.line.startingPoint = new Coordinates(0, 0);
    const returnValue = service.useRadialGroup(Radial45Degrees.SixthRay, new Coordinates(MOCK_X_RADIAL, MOCK_Y_RADIAL));
    expect(returnValue).not.toBeUndefined();
  });

});
