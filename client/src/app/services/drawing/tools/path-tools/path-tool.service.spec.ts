import { TestBed } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Path } from '@app-services/drawing/paths/path';
import {
  MOCK_MOUSE_EVENT,
  MOCK_MOUSE_EVENT_LEAVE,
  MOCK_MOUSE_EVENT_MOVE,
  MOCK_MOUSE_EVENT_NULL,
  MOCK_MOUSE_EVENT_UP, MOCK_X, MOCK_Y,
} from '../../../../../mock/mock-mouse-event';
import { ColorSelectorService } from '../colorSelector-tool/color-selector.service';
import { ToolPropertiesService } from '../tool-properties.service';
import { PathToolService } from './path-tool.service';

describe('PathToolService', () => {
  let service: PathToolService;
  let injectedColor: ColorsService;
  let injectedtoolProperties: ToolPropertiesService;
  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [ColorSelectorService , { provide: ColorsService },
                  ToolPropertiesService]
    });
    service = TestBed.get(PathToolService);
    injectedColor = TestBed.get(ColorsService);
    injectedtoolProperties = TestBed.get(ToolPropertiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#eventTypeDispatcher should be called', () => {
    spyOn(service, 'eventTypeDispatcher');
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
    expect(service.eventTypeDispatcher).toHaveBeenCalled();
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

  it('#eventTypeDispatcher should be called null', () => {
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_NULL);
    expect(service.eventTypeDispatcher).toBeDefined();
  });

  it('#onMouseMove if isDrawing currentPath should contain the mouse position(L)', () => {
    service.isDrawing = true;
    injectedColor = new ColorsService();
    service.path = new Path(injectedColor, injectedtoolProperties);
    service.onMouseMove(MOCK_MOUSE_EVENT);
    expect(service.path.currentPath).toContain(` L${MOCK_X} ${MOCK_Y}`);
  });

  it('#onMouseLeave isDrawing should be false and isIn should be true', () => {
    service.onMouseLeave(MOCK_MOUSE_EVENT_LEAVE);
    expect(service.isIn).toBe(false);
    expect(service.isDrawing).toBe(false);
  });

  it('#onMouseLeave notIsDrawing should be false', () => {
    service.isDrawing = true;
    service.onMouseLeave(MOCK_MOUSE_EVENT_LEAVE);
    expect(service.isDrawing).toBe(false);
  });

  it('#onMouseLeave onMouseUp() should be called', () => {
    service.isDrawing = true;
    spyOn(service, 'onMouseUp');
    service.eventTypeDispatcher(MOCK_MOUSE_EVENT_LEAVE);
    expect(service.onMouseUp).toHaveBeenCalled();
  });

});
