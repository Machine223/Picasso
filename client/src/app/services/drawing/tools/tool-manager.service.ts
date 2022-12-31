import { Injectable } from '@angular/core';
import { ApplicatorToolService } from '@app-services/drawing/tools/applicator-tool/applicator-tool.service';
import { SelectorToolService } from '@app-services/drawing/tools/selector-tool/selector-tool.service';
import { EllipseToolService } from '@app-services/drawing/tools/shape-tools/ellipse-tool/ellipse-tool.service';
import { PolygonToolService } from '@app-services/drawing/tools/shape-tools/polygon-tool/polygon-tool.service';
import { TOOL_NAME } from 'constants/constants';
import { Subject } from 'rxjs';
import { ColorSelectorService } from './colorSelector-tool/color-selector.service';
import { EraserToolService } from './eraser-tool/eraser-tool.service';
import { PaintBucketService } from './paint-bucket-tool/paint-bucket-tool.service';
import { BrushService } from './path-tools/brush-tool/brush.service';
import { PencilService } from './path-tools/pencil-tool/pencil.service';
import { SprayCanToolService } from './path-tools/spray-can-tool/spray-can-tool.service';
import { LineToolService } from './shape-tools/line-tool/line-tool.service';
import { RectangleToolService } from './shape-tools/rectangle-tool/rectangle-tool.service';
import { TextToolService } from './text-tool/text-tool.service';

@Injectable({
  providedIn: 'root',
})
export class ToolManagerService {
  selectedTool: string;
  toolSubject: Subject<string>;
  mapToolDispatcher: Map<string , () => void>;
  mapShiftKeyDispatcher: Map<string , () => void>;

  constructor(public selectorService: SelectorToolService,
              public lineService: LineToolService,
              private pencilService: PencilService,
              private brushService: BrushService,
              private rectangleService: RectangleToolService,
              private ellipseService: EllipseToolService,
              private polygonService: PolygonToolService,
              private spraycanService: SprayCanToolService,
              private colorSelectorService: ColorSelectorService,
              private textToolService: TextToolService,
              private eraserToolService: EraserToolService,
              private applicatorService: ApplicatorToolService,
              private paintBucketService: PaintBucketService) {
    this.toolSubject = new Subject<string> ();
    this.mapToolDispatcher  = new Map<string, () => void> ();
    this.mapShiftKeyDispatcher = new Map<string, () => void> ();
  }

  toolChange(tool: string): void {
    this.toolSubject.next(tool);
    this.selectedTool = tool;
    if (this.selectedTool !== TOOL_NAME.Mouse) {
      this.selectorService.removeOutline();
    }
    if (this.selectedTool !== TOOL_NAME.SprayCan) {
      this.spraycanService.removeCursor();
    }
    if (this.selectedTool === TOOL_NAME.Eraser) {
      this.eraserToolService.removeHighlight();
    }
    if (tool !== TOOL_NAME.Text && this.textToolService.isWriting) {
      this.textToolService.finalizeText();
    }
  }

  removeTool(): void {
    this.selectorService.removeOutline();
    this.spraycanService.removeCursor();
    this.eraserToolService.removeHighlight();
    this.toolSubject.next('');
    this.selectedTool = '';
  }

  eventToolDispatcher(event: MouseEvent): void {
    this.mapToolDispatcher.set(TOOL_NAME.Mouse, () => this.selectorService.eventTypeDispatcher(event));
    this.mapToolDispatcher.set(TOOL_NAME.Pencil, () => this.pencilService.eventTypeDispatcher(event));
    this.mapToolDispatcher.set(TOOL_NAME.PaintBrush, () => this.brushService.eventTypeDispatcher(event));
    this.mapToolDispatcher.set(TOOL_NAME.SprayCan, () => this.spraycanService.eventTypeDispatcher(event));
    this.mapToolDispatcher.set(TOOL_NAME.Line, () => this.lineService.eventTypeDispatcher(event));
    this.mapToolDispatcher.set(TOOL_NAME.Rectangle, () => this.rectangleService.eventTypeDispatcher(event));
    this.mapToolDispatcher.set(TOOL_NAME.Ellipse, () => this.ellipseService.eventTypeDispatcher(event));
    this.mapToolDispatcher.set(TOOL_NAME.Polygon, () => this.polygonService.eventTypeDispatcher(event));
    this.mapToolDispatcher.set(TOOL_NAME.Pipette, () => this.colorSelectorService.eventTypeDispatcher(event));
    this.mapToolDispatcher.set(TOOL_NAME.Text, () => this.textToolService.eventTypeDispatcher(event));
    this.mapToolDispatcher.set(TOOL_NAME.Eraser, () => this.eraserToolService.eventTypeDispatcher(event));
    this.mapToolDispatcher.set(TOOL_NAME.Applicator, () => this.applicatorService.eventTypeDispatcher(event));
    this.mapToolDispatcher.set(TOOL_NAME.Bucket, () => this.paintBucketService.eventTypeDispatcher(event));
    (this.mapToolDispatcher.get(this.selectedTool) || (() => null))();
  }

  keyboardLineDispatcher(event: KeyboardEvent): void {
    if (this.selectedTool === TOOL_NAME.Line) {
      this.lineService.keyboardEventDispatcher(event);
    }
  }

  keyboardTextDispatcher(event: KeyboardEvent): void {
    if (event.type === 'keyup') {
      this.textToolService.keyboardEventDispatcher(event);
    }
  }

  shiftKeyToolDispatcher(isDown: boolean): void {
    this.mapShiftKeyDispatcher.set(TOOL_NAME.Line, () => this.lineService.onShiftKey(isDown));
    this.mapShiftKeyDispatcher.set(TOOL_NAME.Rectangle, () => this.rectangleService.activateSquare(isDown));
    this.mapShiftKeyDispatcher.set(TOOL_NAME.Ellipse, () => this.ellipseService.activateSquare(isDown));
    (this.mapShiftKeyDispatcher.get(this.selectedTool) || (() => null))();
  }

  wheelDispatcher(wheelEvent: WheelEvent): void {
    if (this.selectedTool === TOOL_NAME.Mouse) {
      this.selectorService.onWheel(wheelEvent);
    }
  }
}
