import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { TOOL_NAME } from 'constants/constants';
import { ApplicatorToolService } from './applicator-tool/applicator-tool.service';
import { ColorSelectorService } from './colorSelector-tool/color-selector.service';
import { EraserToolService } from './eraser-tool/eraser-tool.service';
import { BrushService } from './path-tools/brush-tool/brush.service';
import { PencilService } from './path-tools/pencil-tool/pencil.service';
import { SprayCanToolService } from './path-tools/spray-can-tool/spray-can-tool.service';
import { SelectorToolService } from './selector-tool/selector-tool.service';
import { EllipseToolService } from './shape-tools/ellipse-tool/ellipse-tool.service';
import { LineToolService } from './shape-tools/line-tool/line-tool.service';
import { PolygonToolService } from './shape-tools/polygon-tool/polygon-tool.service';
import { RectangleToolService } from './shape-tools/rectangle-tool/rectangle-tool.service';
import { TextToolService } from './text-tool/text-tool.service';
import { ToolManagerService } from './tool-manager.service';

const MOCK_TOOL_MOUSE = TOOL_NAME.Mouse;
const MOCK_TOOL_PENCIL = TOOL_NAME.Pencil;
const MOCK_TOOL_BRUSH = TOOL_NAME.PaintBrush;
const MOCK_TOOL_SPRAY = TOOL_NAME.SprayCan;
const MOCK_TOOL_LINE = TOOL_NAME.Line;
const MOCK_TOOL_RECTANGLE = TOOL_NAME.Rectangle;
const MOCK_TOOL_ELLIPSE = TOOL_NAME.Ellipse;
const MOCK_TOOL_POLYGON = TOOL_NAME.Polygon;
const MOCK_TOOL_COLORSELECTOR = TOOL_NAME.Pipette;
const MOCK_TOOL_ERASER = TOOL_NAME.Eraser;
const MOCK_TOOL_APPLICATOR = TOOL_NAME.Applicator;
const MOCK_TOOL_TEXT = TOOL_NAME.Text;

const MOCK_X = 10;
const MOCK_Y = 10;

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
const MOCK_MOUSE_EVENT = createMouseEvent(MOCK_X, MOCK_Y, 1, MOCK_X, MOCK_Y, 'mouseleave');
const MOCK_EVENT_KEY = new KeyboardEvent('keypress', { key: 'Backspace' });

describe('ToolManagerService', () => {
  let service: ToolManagerService;
  let selectorService: SelectorToolService;
  let pencilService: PencilService;
  let brushService: BrushService;
  let sprayCanService: SprayCanToolService;
  let lineService: LineToolService;
  let rectangleService: RectangleToolService;
  let ellipseService: EllipseToolService;
  let polygonService: PolygonToolService;
  let colorSelectorService: ColorSelectorService;
  let eraserService: EraserToolService;
  let applicatorService: ApplicatorToolService;
  let textService: TextToolService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ MatSnackBarModule  ]
    });
    service = TestBed.get(ToolManagerService);
    selectorService = TestBed.get(SelectorToolService);
    pencilService = TestBed.get(PencilService);
    brushService = TestBed.get(BrushService);
    sprayCanService = TestBed.get(SprayCanToolService);
    lineService = TestBed.get(LineToolService);
    rectangleService = TestBed.get(RectangleToolService);
    ellipseService = TestBed.get(EllipseToolService);
    polygonService = TestBed.get(PolygonToolService);
    colorSelectorService = TestBed.get(ColorSelectorService);
    eraserService = TestBed.get(EraserToolService);
    applicatorService = TestBed.get(ApplicatorToolService);
    textService = TestBed.get(TextToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#toolChange should update observer toolSubject', () => {
    spyOn(service.toolSubject, 'next').and.callFake((receivedTool: string) => {
      expect(receivedTool).toEqual(receivedTool);
    });
    service.toolChange(MOCK_TOOL_PENCIL);
    expect(service.toolSubject.next).toHaveBeenCalled();
  });

  it('#toolChange should update selectedTool', () => {
    service.toolChange(MOCK_TOOL_PENCIL);
    expect(service.selectedTool).toEqual(MOCK_TOOL_PENCIL);
  });

  it('#toolChange if Mouse should removeOutline of selector Service', () => {
    service.toolChange(MOCK_TOOL_MOUSE);
    spyOn(selectorService, 'removeOutline');
    expect(selectorService.removeOutline).toBeDefined();
  });

  it('#toolChange if Spray should removeCursor of sprayCan Service', () => {
    service.toolChange(MOCK_TOOL_SPRAY);
    spyOn(sprayCanService, 'removeCursor');
    expect(selectorService.removeOutline).toBeDefined();
  });

  it('#toolChange if Eraser should removeHighlight of sprayCan Service', () => {
    service.toolChange(MOCK_TOOL_ERASER);
    spyOn(eraserService, 'removeHighlight');
    expect(eraserService.removeHighlight).toBeDefined();
  });

  it('#toolChange should finalize text if tool isn\'t text anymore and that a text was being written', () => {
    textService.isWriting = true;
    const spy = spyOn(textService, 'finalizeText');
    service.toolChange(MOCK_TOOL_ERASER);
    expect(spy).toHaveBeenCalled();
  });

  it('#removeTool if Mouse should removeOutline of selector Service', () => {
    service.selectedTool = MOCK_TOOL_MOUSE;
    service.removeTool();
    spyOn(selectorService, 'removeOutline');
    expect(selectorService.removeOutline).toBeDefined();
  });

  it('#removeTool if Spray should removeCursor of sprayCan Service', () => {
    service.selectedTool = MOCK_TOOL_SPRAY;
    service.removeTool();
    spyOn(sprayCanService, 'removeCursor');
    expect(selectorService.removeOutline).toBeDefined();
  });

  it('#removeTool if Eraser should removeHighlight of sprayCan Service', () => {
    service.selectedTool = MOCK_TOOL_ERASER;
    service.removeTool();
    spyOn(eraserService, 'removeHighlight');
    expect(eraserService.removeHighlight).toBeDefined();
  });

  it('#eventToolDispatcher should be called if cover', () => {
    service.eventToolDispatcher(MOCK_MOUSE_EVENT);
    expect(service.eventToolDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher if Mouse should called selectorService', () => {
    service.selectedTool = MOCK_TOOL_MOUSE;
    service.eventToolDispatcher(MOCK_MOUSE_EVENT);
    expect(selectorService.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher if Pencil should called pencilService', () => {
    service.selectedTool = MOCK_TOOL_PENCIL;
    service.eventToolDispatcher(MOCK_MOUSE_EVENT);
    expect(pencilService.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher if Brush should called brushService', () => {
    service.selectedTool = MOCK_TOOL_BRUSH;
    service.eventToolDispatcher(MOCK_MOUSE_EVENT);
    expect(brushService.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher if Spray should called sprayCanService', () => {
    service.selectedTool = MOCK_TOOL_SPRAY;
    service.eventToolDispatcher(MOCK_MOUSE_EVENT);
    expect(sprayCanService.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher if Line should called lineService', () => {
    service.selectedTool = MOCK_TOOL_LINE;
    service.eventToolDispatcher(MOCK_MOUSE_EVENT);
    expect(lineService.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher if Rectangle should called rectangleService', () => {
    service.selectedTool = MOCK_TOOL_RECTANGLE;
    service.eventToolDispatcher(MOCK_MOUSE_EVENT);
    expect(rectangleService.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher if Ellipse should called ellipseService', () => {
    service.selectedTool = MOCK_TOOL_ELLIPSE;
    service.eventToolDispatcher(MOCK_MOUSE_EVENT);
    expect(ellipseService.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher if Polygon should called polygonService', () => {
    service.selectedTool = MOCK_TOOL_POLYGON;
    service.eventToolDispatcher(MOCK_MOUSE_EVENT);
    expect(polygonService.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher if ColorSelection should called colorSelectorService', () => {
    service.selectedTool = MOCK_TOOL_COLORSELECTOR;
    service.eventToolDispatcher(MOCK_MOUSE_EVENT);
    expect(colorSelectorService.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher if Text should called textService', () => {
    service.selectedTool = MOCK_TOOL_TEXT;
    service.eventToolDispatcher(MOCK_MOUSE_EVENT);
    expect(textService.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher if Eraser should called eraserService', () => {
    service.selectedTool = MOCK_TOOL_ERASER;
    service.eventToolDispatcher(MOCK_MOUSE_EVENT);
    expect(eraserService.eventTypeDispatcher).toBeDefined();
  });

  it('#eventTypeDispatcher if Applicator should called applicatorService', () => {
    service.selectedTool = MOCK_TOOL_APPLICATOR;
    service.eventToolDispatcher(MOCK_MOUSE_EVENT);
    expect(applicatorService.eventTypeDispatcher).toBeDefined();
  });

  it('#keyboardLineDispatcher if selectedTool keyboardEventDispatcher should be updated', () => {
    service.selectedTool = MOCK_TOOL_LINE;
    spyOn(service.lineService, 'keyboardEventDispatcher').and.callFake((receivedEvent: KeyboardEvent) => {
      expect(receivedEvent).toEqual(receivedEvent);
    });
    service.keyboardLineDispatcher(MOCK_EVENT_KEY);
    expect(service.lineService.keyboardEventDispatcher).toHaveBeenCalled();
  });

  it('#keyboardLineDispatcher if not selectedTool keyboardEventDispatcher should not be updated', () => {
    service.selectedTool = MOCK_TOOL_BRUSH;
    spyOn(service.lineService, 'keyboardEventDispatcher').and.callFake((receivedEvent: KeyboardEvent) => {
      expect(receivedEvent).toEqual(receivedEvent);
    });
    service.keyboardLineDispatcher(MOCK_EVENT_KEY);
    expect(service.lineService.keyboardEventDispatcher).not.toHaveBeenCalled();
  });

  it('#keyboardTextDispatcher should call keyboardEventDispatcher if event.type is keyup', () => {
    const MOCK_KEY_UP = new KeyboardEvent('keyup', {key: 'A'});
    const spy = spyOn(textService, 'keyboardEventDispatcher');
    service.keyboardTextDispatcher(MOCK_KEY_UP);
    expect(spy).toHaveBeenCalledWith(MOCK_KEY_UP);
  });

  it('#shiftKeyToolDispatcher should be called if cover', () => {
    service.shiftKeyToolDispatcher(true);
    expect(service.mapShiftKeyDispatcher).toBeDefined();
  });

  it('#shiftKeyToolDispatcher if Line should called lineService', () => {
    service.selectedTool = MOCK_TOOL_LINE;
    lineService.isShiftMode = true;
    service.shiftKeyToolDispatcher(true);
    expect(lineService.onShiftKey).toBeDefined();
  });

  it('#shiftKeyToolDispatcher if Rectangle should called rectangleService', () => {
    service.selectedTool = MOCK_TOOL_RECTANGLE;
    service.shiftKeyToolDispatcher(false);
    expect(rectangleService.activateSquare).toBeDefined();
  });

  it('#shiftKeyToolDispatcher if Ellipse should called ellipseService', () => {
    service.selectedTool = MOCK_TOOL_ELLIPSE;
    service.shiftKeyToolDispatcher(false);
    expect(ellipseService.activateSquare).toBeDefined();
  });

});
