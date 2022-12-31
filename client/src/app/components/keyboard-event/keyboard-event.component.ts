import { Component, HostListener, OnInit, RendererFactory2 } from '@angular/core';
import { Router } from '@angular/router';
import { GridService } from '@app-services/drawing/grid/grid.service';
import { SelectorToolService } from '@app-services/drawing/tools/selector-tool/selector-tool.service';
import { TextToolService } from '@app-services/drawing/tools/text-tool/text-tool.service';
import { ToolManagerService } from '@app-services/drawing/tools/tool-manager.service';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { RotationService } from '@app-services/drawing/transform/rotation.service';
import { TranslateService } from '@app-services/drawing/transform/translate.service';
import { OpenDialogService } from '@app-services/open-dialog/open-dialog.service';
import { SelectionManipulationService } from '@app-services/selection-manipulation/selection-manipulation.service';
import { ShortcutsInfoService } from '@app-services/shortcuts-info/shortcuts-info.service';
import { TransformSVGElement } from '@app-services/undo-redo/transform-svgelement';
import { UndoRedoManagerService } from '@app-services/undo-redo/undo-redo-manager.service';
import { ROTATION_ANGLE, TOOL_NAME } from 'constants/constants';
import { Subscription } from 'rxjs';

const DEFAULT_MOVEMENT_NUMBER = 3;

@Component({
  selector: 'app-keyboard-event',
  templateUrl: './keyboard-event.component.html',
  styleUrls: ['./keyboard-event.component.scss']
})
export class KeyboardEventComponent implements OnInit {

  openedDialog: boolean;
  openedDialogSubscription: Subscription;
  editingText: boolean;
  editingTextSubscription: Subscription;
  arrowHandler: Map<string, boolean>;
  command: TransformSVGElement;
  firstKeyDownArrow: boolean;
  urlIsDrawingView: boolean;

  constructor(private router: Router,
              private toolManagerService: ToolManagerService,
              private shortcutsInfo: ShortcutsInfoService,
              private gridService: GridService,
              private toolPropertiesService: ToolPropertiesService,
              private undoRedoService: UndoRedoManagerService,
              private openDialogService: OpenDialogService,
              private selectorToolService: SelectorToolService,
              private translateService: TranslateService,
              private textToolService: TextToolService,
              private rotationService: RotationService,
              private rendererFactory: RendererFactory2,
              private copyPasteService: SelectionManipulationService) {
    this.openedDialog = false;
    this.arrowHandler = new Map<string, boolean>();
    this.command = new TransformSVGElement([], this.rendererFactory);
    this.firstKeyDownArrow = true;
    this.urlIsDrawingView = false;
  }

  ngOnInit(): void {
    this.openedDialogSubscription = this.shortcutsInfo.openedDialogSubject.subscribe(
      (inputOpenedDialog) => { this.openedDialog = inputOpenedDialog; }
    );
    this.editingTextSubscription = this.textToolService.editingTextSubject.subscribe(
      (inputEditingText) => { this.editingText = inputEditingText; }
    );
    this.setArrow();
  }

  setArrow(): void {
    this.arrowHandler.set('ArrowLeft', false);
    this.arrowHandler.set('ArrowUp', false);
    this.arrowHandler.set('ArrowRight', false);
    this.arrowHandler.set('ArrowDown', false);
  }

  pageDispatcher(currentUrl: string, event: KeyboardEvent): void {
    switch (currentUrl) {
      case '/starting-menu':
        this.urlIsDrawingView = false;
        event.preventDefault();
        break;
      case '/drawing-view':
        this.drawingViewShortcut(event);
        this.updateArrowMap(event);
        this.urlIsDrawingView = true;
        break;
    }
  }

  updateArrowMap(event: KeyboardEvent): void {
    const updateArrowHandler  = new Map<string, () => void> ();
    updateArrowHandler.set('ArrowDown', () =>  this.arrowHandler.set('ArrowDown', false));
    updateArrowHandler.set('ArrowUp', () =>    this.arrowHandler.set('ArrowUp', false));
    updateArrowHandler.set('ArrowLeft', () =>  this.arrowHandler.set('ArrowLeft', false));
    updateArrowHandler.set('ArrowRight', () => this.arrowHandler.set('ArrowRight', false));
    if (event.type === 'keyup' && this.checkIsArrow(event)) {
      this.firstKeyDownArrow = true;
      this.command.getLastTransform();
      this.undoRedoService.executeCommand(this.command);
      (updateArrowHandler.get(event.key) || (() => null))();
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    if (this.openedDialog || this.editingText) { return; }
    this.copyPasteEvent(event);

    if ((event.ctrlKey) && event.key === 'o') {
      this.toolManagerService.removeTool();
      this.shortcutsInfo.openedDialogChange(true);
      this.openDialogService.openNewDrawingDialog();
      event.preventDefault();
    } else if ((event.ctrlKey) && event.key === 's' && this.urlIsDrawingView) {
      this.toolManagerService.removeTool();
      this.openDialogService.openSavingDialog();
      event.preventDefault();
    }  else if ((event.ctrlKey) && event.key === 'g' ) {
      this.toolManagerService.removeTool();
      this.openDialogService.openGallery();
      event.preventDefault();
    } else if ((event.ctrlKey) && event.key === 'a') {
      event.preventDefault();
      if (this.toolManagerService.selectedTool === TOOL_NAME.Mouse) {
        this.toolManagerService.selectorService.selectAll();
      }
    } else if ((event.ctrlKey) && event.key === 'e' ) {
      this.shortcutsInfo.openedDialogChange(true);
      this.openDialogService.openExportDialog();
      event.preventDefault();
    } else {
      this.pageDispatcher(this.router.url, event);
    }
    this.checkArrowDisplacement(event);
  }

  copyPasteEvent(event: KeyboardEvent): void {
    if ((event.ctrlKey) && event.key === 'x' && this.urlIsDrawingView) {
      this.copyPasteService.cut();
      event.preventDefault();
    } else if ((event.ctrlKey) && event.key === 'c' && this.urlIsDrawingView) {
      this.copyPasteService.copy();
      event.preventDefault();
    } else if ((event.ctrlKey) && event.key === 'v' && this.urlIsDrawingView) {
      this.copyPasteService.paste();
      event.preventDefault();
    } else if ((event.ctrlKey) && event.key === 'd' && this.urlIsDrawingView) {
      this.copyPasteService.duplicate();
      event.preventDefault();
    }
  }

  checkIsArrow(event: KeyboardEvent): boolean {
    return (event.key === 'ArrowDown' || event.key === 'ArrowUp' ||
            event.key === 'ArrowLeft' || event.key === 'ArrowRight');
  }

  checkArrowDisplacement(event: KeyboardEvent): void {
    if (this.toolManagerService.selectedTool === TOOL_NAME.Mouse && this.checkIsArrow(event)) {
      event.preventDefault();
      const arrowDispatcher  = new Map<string, () => void> ();
      arrowDispatcher.set('ArrowDown', () => {  this.downArrowPressed();
                                                this.arrowHandler.set('ArrowDown', true); });
      arrowDispatcher.set('ArrowUp', () => {    this.upArrowPressed();
                                                this.arrowHandler.set('ArrowUp', true); });
      arrowDispatcher.set('ArrowLeft', () => {  this.leftArrowPressed();
                                                this.arrowHandler.set('ArrowLeft', true); });
      arrowDispatcher.set('ArrowRight', () => { this.rightArrowPressed();
                                                this.arrowHandler.set('ArrowRight', true); });
      (arrowDispatcher.get(event.key) || (() => null))();

      if ((this.arrowHandler.get('ArrowDown')) && (this.arrowHandler.get('ArrowLeft'))) {
        this.downArrowPressed();
        this.leftArrowPressed();
        this.arrowHandler.set('ArrowDown', true);
        this.arrowHandler.set('ArrowLeft', true);
      }
      if ((this.arrowHandler.get('ArrowLeft')) && (this.arrowHandler.get('ArrowUp'))) {
        this.upArrowPressed();
        this.leftArrowPressed();
        this.arrowHandler.set('ArrowLeft', true);
        this.arrowHandler.set('ArrowUp', true);
      }
      if ((this.arrowHandler.get('ArrowUp')) && (this.arrowHandler.get('ArrowRight'))) {
        this.upArrowPressed();
        this.rightArrowPressed();
        this.arrowHandler.set('ArrowUp', true);
        this.arrowHandler.set('ArrowRight', true);
      }
      if ((this.arrowHandler.get('ArrowRight')) && (this.arrowHandler.get('ArrowDown'))) {
        this.rightArrowPressed();
        this.downArrowPressed();
        this.arrowHandler.set('ArrowRight', true);
        this.arrowHandler.set('ArrowDown', true);
      }
      if (this.firstKeyDownArrow) {
        this.command = new TransformSVGElement(this.selectorToolService.selector.selectedElements, this.rendererFactory);
        this.firstKeyDownArrow = false;
      }
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent): void {
    this.pageDispatcher(this.router.url, event);
  }

  drawingViewShortcut(event: KeyboardEvent): void {
  if (!this.editingText) {
    if ((event.ctrlKey) && event.type === 'keydown' && event.key === 'z') {
      this.undoRedoService.undo();
      this.toolManagerService.selectorService.removeOutline();
    }
    if ((event.ctrlKey) && event.type === 'keydown' && event.key === 'Z') {
      this.undoRedoService.redo();
      this.toolManagerService.selectorService.removeOutline();
    }
  }
  this.editingText ? this.toolManagerService.keyboardTextDispatcher(event) : this.eventMapDispatcher(event);
  }

  eventMapDispatcher(event: KeyboardEvent): void {
    const mapShortcut = new Map<string, () => void>();
    if (this.openedDialog || this.editingText) { return; }
    if (event.type === 'keydown') {
        mapShortcut.set('s', () => this.toolManagerService.toolChange(TOOL_NAME.Mouse));
        mapShortcut.set('c', () => this.toolManagerService.toolChange(TOOL_NAME.Pencil));
        mapShortcut.set('w', () => this.toolManagerService.toolChange(TOOL_NAME.PaintBrush));
        mapShortcut.set('a', () => this.toolManagerService.toolChange(TOOL_NAME.SprayCan));
        mapShortcut.set('l', () => this.toolManagerService.toolChange(TOOL_NAME.Line));
        mapShortcut.set('1', () => this.toolManagerService.toolChange(TOOL_NAME.Rectangle));
        mapShortcut.set('2', () => this.toolManagerService.toolChange(TOOL_NAME.Ellipse));
        mapShortcut.set('3', () => this.toolManagerService.toolChange(TOOL_NAME.Polygon));
        mapShortcut.set('i', () =>  this.toolManagerService.toolChange(TOOL_NAME.Pipette));
        mapShortcut.set('t', () =>  this.toolManagerService.toolChange(TOOL_NAME.Text));
        mapShortcut.set('e', () =>  this.toolManagerService.toolChange(TOOL_NAME.Eraser));
        mapShortcut.set('r', () =>  this.toolManagerService.toolChange(TOOL_NAME.Applicator));
        mapShortcut.set('b', () => this.toolManagerService.toolChange(TOOL_NAME.Bucket));
        mapShortcut.set('Backspace', () => this.toolManagerService.keyboardLineDispatcher(event));
        mapShortcut.set('Escape', () => this.toolManagerService.keyboardLineDispatcher(event));
        mapShortcut.set('Shift', () => { this.toolManagerService.shiftKeyToolDispatcher(true);
                                         this.rotationService.isShiftDown = true; });
        mapShortcut.set('Alt', () => {  this.rotationService.isAltDown = true;
                                        this.rotationService.rotationAngle = ROTATION_ANGLE.Alt; });
        mapShortcut.set('Delete', () => this.copyPasteService.delete());
        mapShortcut.set('g', () => this.toolPropertiesService.gridChange());
        mapShortcut.set('+', () => this.gridService.increment());
        mapShortcut.set('-', () => this.gridService.decrement());
      } else if (event.type === 'keyup') {
        if (event.key === 'Shift') {
          mapShortcut.set('Shift', () => { this.toolManagerService.shiftKeyToolDispatcher(false);
                                           this.rotationService.isShiftDown = false;
                                           this.selectorToolService.updateOrigins(); });
        }
        if (event.key === 'Alt') {
          mapShortcut.set('Alt', () => {  this.rotationService.isAltDown = false;
                                          this.rotationService.rotationAngle = ROTATION_ANGLE.Normal; });
        }
      }
    (mapShortcut.get(event.key) || (() => null))();
  }

  leftArrowPressed(): void {
    this.translateService.translateSelection(-DEFAULT_MOVEMENT_NUMBER, 0, this.selectorToolService.selector);
    this.selectorToolService.updateSelectedOutline();
    this.selectorToolService.updateOrigins();
  }

  rightArrowPressed(): void {
    this.translateService.translateSelection(DEFAULT_MOVEMENT_NUMBER, 0, this.selectorToolService.selector);
    this.selectorToolService.updateSelectedOutline();
    this.selectorToolService.updateOrigins();
  }

  upArrowPressed(): void {
    this.translateService.translateSelection(0, -DEFAULT_MOVEMENT_NUMBER, this.selectorToolService.selector);
    this.selectorToolService.updateSelectedOutline();
    this.selectorToolService.updateOrigins();
  }

  downArrowPressed(): void {
    this.translateService.translateSelection(0, DEFAULT_MOVEMENT_NUMBER, this.selectorToolService.selector);
    this.selectorToolService.updateSelectedOutline();
    this.selectorToolService.updateOrigins();
  }
}
