import { TestBed } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { BehaviorSubject } from 'rxjs';
import { ColorSelectorService } from './color-selector.service';

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
createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, 'mouseup');
const MOCK_MOUSE_EVENT_LEAVE = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, 'mouseleave');
const MOCK_RETURN_COLOR = '#000000';

describe('ColorSelectorService', () => {
  let service: ColorSelectorService ;
  let injectedService: ColorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColorSelectorService ,
        { provide: ColorsService }]
    });
    service = TestBed.get(ColorSelectorService);
    injectedService = TestBed.get(ColorSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#eventTypeDispatcher should be called mousedown', () => {
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_DOWN);
    expect(service.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher should be called mouseleave', () => {
    spyOn(service, 'eventTypeDispatcher');
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
    expect(service.eventTypeDispatcher).toHaveBeenCalled();
  });

  it('#eventTypeDispatcher should be called', () => {
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
    expect(service.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher should be null', () => {
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT);
    expect(service.eventTypeDispatcher).toBeDefined();
  });

  it('#onMouseDown isIn should to be true', () => {
    service.onMouseDown();
    expect(service.isIn).toBe(true);
  });

  it('#onMouseUp isIn & LeftButton should change mainColor', () => {
    service.isIn = true;
    spyOn(service, 'getColor').and.returnValue(MOCK_RETURN_COLOR);
    injectedService.mainColor = jasmine.createSpyObj<BehaviorSubject<string>>
      ('BehaviorSubject<string>', ['next']);
    service.colorsService = injectedService;
    service.onMouseUp(MOCK_MOUSE_EVENT_LEAVE);
    expect(service.colorsService.mainColor.next).toHaveBeenCalled();
  });

  it('#onMouseUp isIn & RightButton should change secondaryColor', () => {
    service.isIn = true;
    spyOn(service, 'getColor').and.returnValue(MOCK_RETURN_COLOR);
    injectedService.secondaryColor = jasmine.createSpyObj<BehaviorSubject<string>>
      ('BehaviorSubject<string>', ['next']);
    service.colorsService = injectedService;
    service.onMouseUp(MOCK_MOUSE_EVENT);
    expect(service.colorsService.secondaryColor.next).toHaveBeenCalled();
  });

  it('#onMouseLeave isIn should be false', () => {
    service.onMouseLeave();
    expect(service.isIn ).toBe(false);
  });

  it('#getColor should be called', () => {
    const spryGetColor = spyOn(service, 'getColor');
    service.getColor(MOCK_MOUSE_EVENT);
    expect(spryGetColor).toHaveBeenCalled();
  });

});
